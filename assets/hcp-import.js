(function () {
  const h = React.createElement;
  const {Button, Modal, Upload, Alert} = antd;
  const icon = name => h('svg', {width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true},
    h('path', {d: name === 'download' ? 'M12 3v12 M7 10l5 5 5-5 M4 15v5h16v-5' : 'M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7'}));
  function parseCSV(text) {
    const rows = []; let row = [], cell = '', quoted = false;
    text = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (quoted && text[i + 1] === '"') {cell += '"'; i++;}
        else if (quoted || !cell) quoted = !quoted;
        else throw new Error('CSV 引号格式不正确，请使用模板重新保存');
      } else if (c === ',' && !quoted) {row.push(cell); cell = '';}
      else if ((c === '\n' || c === '\r') && !quoted) {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (quoted) throw new Error('CSV 引号未闭合');
    if (cell || row.length) rows.push([...row, cell]);
    return rows;
  }
  async function readXLSX(file) {
    const zip = await JSZip.loadAsync(file);
    const xml = async path => {
      const entry = zip.file(path);
      if (!entry) throw new Error('Excel 文件内容不完整，请使用 .xlsx 文件');
      const doc = new DOMParser().parseFromString(await entry.async('string'), 'application/xml');
      if (doc.querySelector('parsererror')) throw new Error('Excel 文件格式不正确');
      return doc;
    };
    const strings = zip.file('xl/sharedStrings.xml') ? [...(await xml('xl/sharedStrings.xml')).querySelectorAll('si')].map(si => [...si.querySelectorAll('t')].map(t => t.textContent).join('')) : [];
    const book = await xml('xl/workbook.xml');
    const id = book.querySelector('sheet')?.getAttribute('r:id');
    const rel = [...(await xml('xl/_rels/workbook.xml.rels')).querySelectorAll('Relationship')].find(r => r.getAttribute('Id') === id);
    const target = rel?.getAttribute('Target');
    if (!target) throw new Error('Excel 中未找到工作表');
    const sheet = await xml(target.startsWith('/') ? target.slice(1) : 'xl/' + target.replace(/^\.\//, ''));
    return [...sheet.querySelectorAll('sheetData > row')].map(row => {
      const values = [];
      row.querySelectorAll('c').forEach(cell => {
        const letters = cell.getAttribute('r')?.match(/^[A-Z]+/)?.[0];
        const index = letters ? [...letters].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1 : values.length;
        const value = cell.querySelector('v')?.textContent || '';
        values[index] = cell.getAttribute('t') === 's' ? strings[Number(value)] : cell.getAttribute('t') === 'inlineStr' ? [...cell.querySelectorAll('is t')].map(t => t.textContent).join('') : value;
      });
      return values;
    });
  }
  function validate(rows, existing) {
    const header = rows[0]?.map(v => String(v || '').trim()) || [];
    const nameIndex = header.findIndex(v => v === '医生姓名' || v === '姓名');
    const phoneIndex = header.indexOf('手机号');
    if (nameIndex < 0 || phoneIndex < 0) throw new Error('缺少“医生姓名”和“手机号”表头，请下载导入模板');
    const data = rows.slice(1).map((row, index) => ({row, line: index + 2})).filter(({row}) => row.some(v => String(v || '').trim()));
    if (!data.length) throw new Error('文件中没有可导入的数据');
    if (data.length > 500) throw new Error('单次最多导入 500 条，请拆分文件后重试');
    const seen = new Set(existing.flatMap(p => [p.rawPhone, p.phone]).filter(Boolean));
    return data.map(({row, line}) => {
      const name = String(row[nameIndex] || '').trim(), phone = String(row[phoneIndex] || '').trim();
      let error = !name ? '医生姓名不能为空' : name.length > 50 ? '医生姓名最多 50 字' : !/^1\d{10}$/.test(phone) ? '请输入 11 位有效手机号' : seen.has(phone) ? '手机号已存在或文件内重复' : '';
      if (!error) seen.add(phone);
      return {key: line, line, name, phone, error};
    });
  }
  function saveBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function exportErrors(rows) {
    const escape = value => String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const data = [['原始行号', '医生姓名', '手机号', '失败原因'], ...rows.map(r => [r.line, r.name, r.phone, r.error])];
    const zip = new JSZip();
    zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
    zip.file('_rels/.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    zip.file('xl/workbook.xml', '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="导入失败数据" sheetId="1" r:id="rId1"/></sheets></workbook>');
    zip.file('xl/_rels/workbook.xml.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
    zip.file('xl/worksheets/sheet1.xml', '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="14" customWidth="1"/><col min="2" max="3" width="22" customWidth="1"/><col min="4" max="4" width="48" customWidth="1"/></cols><sheetData>' + data.map((row, i) => `<row r="${i + 1}">${row.map((value, j) => `<c r="${String.fromCharCode(65 + j)}${i + 1}" t="inlineStr"><is><t xml:space="preserve">${escape(value)}</t></is></c>`).join('')}</row>`).join('') + '</sheetData></worksheet>');
    return zip.generateAsync({type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  window.HcpBatchImport = function ({hcps, onImport, message}) {
    const [open, setOpen] = React.useState(false), [rows, setRows] = React.useState([]), [fileName, setFileName] = React.useState(''), [error, setError] = React.useState(''), [loading, setLoading] = React.useState(false), [result, setResult] = React.useState(null);
    const [errorsDownloaded, setErrorsDownloaded] = React.useState(false), [downloading, setDownloading] = React.useState(false);
    const sequence = React.useRef(0);
    const mustDownload = Boolean(result?.failed.length && !errorsDownloaded);
    const close = () => {if (mustDownload || downloading) return; sequence.current++; setOpen(false); setLoading(false);};
    const removeFile = () => {sequence.current++; setRows([]); setFileName(''); setError(''); setLoading(false);};
    const download = () => {
      const a = document.createElement('a'); a.href = 'outputs/hcp-import/HCP批量导入模板.xlsx'; a.download = 'HCP批量导入模板.xlsx'; a.click();
    };
    const downloadErrors = async () => {
      if (downloading) return;
      setDownloading(true);
      try {saveBlob(await exportErrors(result.failed), 'HCP导入失败数据.xlsx'); setErrorsDownloaded(true);}
      catch {message.error('错误文件生成失败，请重试');}
      finally {setDownloading(false);}
    };
    const read = async file => {
      const token = ++sequence.current;
      setRows([]); setError(''); setFileName(file.name); setLoading(true);
      try {
        if (file.size > 5 * 1024 * 1024) throw new Error('文件不能超过 5 MB');
        if (!/\.(csv|xlsx)$/i.test(file.name)) throw new Error('请选择 CSV 或 Excel（.xlsx）文件');
        const data = /\.xlsx$/i.test(file.name) ? await readXLSX(file) : parseCSV(await file.text());
        const result = validate(data, hcps);
        if (sequence.current === token) setRows(result);
      } catch (e) {if (sequence.current === token) setError(e.message || '文件读取失败，请重新上传');}
      finally {if (sequence.current === token) setLoading(false);}
      return false;
    };
    const submit = () => {
      if (loading || !rows.length || result) return;
      const checked = validate([['医生姓名', '手机号'], ...rows.map(r => [r.name, r.phone])], hcps).map((r, i) => ({...r, line: rows[i].line}));
      const valid = checked.filter(r => !r.error), failed = checked.filter(r => r.error);
      const stamp = Date.now();
      if (valid.length) onImport(valid.map((r, i) => ({key: `HCP-${stamp}-${i}`, name: r.name, rawPhone: r.phone, phone: r.phone.slice(0, 3) + '*****' + r.phone.slice(-4), registrationStatus: 'pending_registration', createdAt: dayjs().format('YYYY.MM.DD')})));
      setResult({success: valid.length, failed, total: checked.length});
    };
    return h(React.Fragment, null,
      h(Button, {onClick: () => {setRows([]); setResult(null); setErrorsDownloaded(false); setDownloading(false); setFileName(''); setError(''); setOpen(true);}}, '批量导入'),
      h(Modal, {title: result ? 'HCP 导入结果' : '批量导入 HCP', open, width: 760, onCancel: close, closable: !mustDownload && !downloading, maskClosable: !mustDownload && !downloading, keyboard: !mustDownload && !downloading, onOk: submit, okText: '确认导入', cancelText: '取消', okButtonProps: {disabled: loading || !rows.length}, ...(result ? {footer: mustDownload ? h(Button, {type: 'primary', icon: icon('download'), loading: downloading, onClick: downloadErrors}, '下载错误文件') : h(Button, {type: 'primary', onClick: close}, '完成')} : {}), destroyOnHidden: true},
        result ? h('div', {style: {padding: '20px 0'}},
          h(Alert, {type: result.failed.length ? (result.success ? 'warning' : 'error') : 'success', showIcon: true, message: h('div', {style: {display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8}}, h('span', null, `导入完成：成功 ${result.success} 条，失败 ${result.failed.length} 条`)), description: `共处理 ${result.total} 条数据${result.success ? '，成功数据已加入 HCP 列表' : ''}。`})
        ) : h(React.Fragment, null,
        h('div', {style: {margin: '18px 0 12px'}}, h(Button, {type: 'primary', icon: icon('download'), onClick: download}, '下载导入模板')),
        fileName ? h('div', {style: {display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fafafa'}},
          h('span', {style: {flex: 1, minWidth: 0, overflowWrap: 'anywhere'}}, fileName),
          loading && h('span', {style: {color: '#667085'}}, '正在读取…'),
          h(Button, {type: 'text', danger: true, icon: icon('delete'), onClick: removeFile, title: '删除文件', 'aria-label': '删除已上传文件'})
        ) : h(Upload.Dragger, {accept: '.csv,.xlsx', beforeUpload: read, showUploadList: false, multiple: false}, h('p', {style: {fontSize: 16, margin: '12px 0'}}, '点击或拖拽文件到此处'), h('p', {style: {color: '#667085'}}, 'CSV / XLSX · 最大 5 MB')),
        error && h(Alert, {type: 'error', showIcon: true, message: error, style: {marginTop: 16}}))));
  };
  window.HcpImportUtils = {parseCSV, validate};
})();
