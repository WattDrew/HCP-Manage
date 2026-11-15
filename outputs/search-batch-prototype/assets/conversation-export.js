/* Create a single-sheet Excel workbook in the browser, including on file://. */
async function downloadConversationWorkbook(filename, rows) {
  const spreadsheet = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const office = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const packageRelationships = 'http://schemas.openxmlformats.org/package/2006/relationships';
  const escapeXml = value => String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\r/g, '&#13;');
  const sheetRows = rows.map(row => '<row>' + row.map(value =>
    typeof value === 'number' && Number.isFinite(value)
      ? `<c><v>${value}</v></c>`
      : `<c t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`
  ).join('') + '</row>').join('');

  const zip = new JSZip();
  zip.file('[Content_Types].xml', `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
    <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  </Types>`);
  zip.file('_rels/.rels', `<Relationships xmlns="${packageRelationships}">
    <Relationship Id="rId1" Type="${office}/officeDocument" Target="xl/workbook.xml"/>
  </Relationships>`);
  zip.file('xl/workbook.xml', `<workbook xmlns="${spreadsheet}" xmlns:r="${office}">
    <sheets><sheet name="对话数据" sheetId="1" r:id="rId1"/></sheets>
  </workbook>`);
  zip.file('xl/_rels/workbook.xml.rels', `<Relationships xmlns="${packageRelationships}">
    <Relationship Id="rId1" Type="${office}/worksheet" Target="worksheets/sheet1.xml"/>
  </Relationships>`);
  zip.file('xl/worksheets/sheet1.xml', `<worksheet xmlns="${spreadsheet}">
    <cols>
      <col min="1" max="2" width="16" customWidth="1"/>
      <col min="3" max="4" width="21" customWidth="1"/>
      <col min="5" max="6" width="14" customWidth="1"/>
      <col min="7" max="7" width="72" customWidth="1"/>
      <col min="8" max="8" width="16" customWidth="1"/>
    </cols>
    <sheetData>${sheetRows}</sheetData>
  </worksheet>`);

  const workbook = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(workbook);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
