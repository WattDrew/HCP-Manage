from pathlib import Path
p=Path(__file__).parent/'assets/app.js'
s=p.read_text(encoding='utf-8')
s=s.replace("const [page, setPage] = useState('project')", "const [page, setPage] = useState('flow')")
marker="  const visiblePeople = people.filter"
insert="""  const [flowSearch, setFlowSearch] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [batchKeys, setBatchKeys] = useState([]);
  const [batchExporting, setBatchExporting] = useState(false);
  useEffect(() => { setFlowSearch(''); setBatchMode(false); setBatchKeys([]); }, [flowTab, task.key, page]);
  function matchesHcp(person) {
    const query = flowSearch.trim().toLowerCase();
    return !query || [person.name, person.phone, person.rawPhone].some(value => String(value || '').toLowerCase().includes(query));
  }
  async function exportSelectedHcps() {
    const selectedPeople = visiblePeople.filter(person => batchKeys.includes(person.key));
    const selectedRecords = visibleRecords.filter(item => item.apiKey === task.apiKey && selectedPeople.some(person => item.hcpKey ? item.hcpKey === person.key : item.name === person.name));
    if (!selectedRecords.length) { message.info('所选 HCP 暂无可导出的对话数据'); return; }
    setBatchExporting(true);
    try {
      const rows = selectedRecords.flatMap(item => {
        const saved = item.conversation || item.originalConversation;
        const entries = saved || initialConversation.map((text, index) => ({text, sender: index % 2 === 0 ? 'rep' : 'doctor'}));
        return entries.map((entry, index) => [item.key, item.name, item.time, conversationStatus.collector[item.stage]?.[0], index + 1, entry.sender === 'rep' ? '医药代表' : '医生', entry.text, saved ? '已保存对话' : '演示对话']);
      });
      await downloadConversationWorkbook('HCP批量导出-对话数据.xlsx', [['记录编号','采集对象','对话时间','数据状态','消息序号','发言角色','对话内容','内容来源'], ...rows]);
      message.success(`已导出 ${selectedRecords.length} 条对话记录`);
    } catch (error) { message.error('导出失败，请重试'); }
    finally { setBatchExporting(false); }
  }
  function flowToolbar(isPeople) {
    return React.createElement('div', {className: 'hcp-search-batch-toolbar', style: {display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, marginBottom:20}},
      React.createElement(Input, {allowClear:true, 'aria-label':'搜索 HCP 姓名或手机号', placeholder:'搜索 HCP 姓名或手机号', prefix:React.createElement(Icon,{name:'search',size:16}), value:flowSearch, style:{width:320,maxWidth:'100%'}, onChange:event => {setFlowSearch(event.target.value); setBatchKeys([]);}}),
      isPeople && (batchMode ? React.createElement(Space, {wrap:true},
        React.createElement('span', {'aria-live':'polite'}, `已选择 ${batchKeys.length} 位 HCP`),
        React.createElement(Button, {type:'primary', disabled:!batchKeys.length, loading:batchExporting, onClick:exportSelectedHcps}, '导出所选'),
        React.createElement(Button, {disabled:batchExporting, onClick:()=>{setBatchMode(false);setBatchKeys([]);}}, '取消')) :
        React.createElement(Button, {onClick:()=>setBatchMode(true)}, '批量操作')));
  }
"""
assert marker in s
s=s.replace(marker,insert+marker,1)
s=s.replace('dataSource: visiblePeople,', "dataSource: visiblePeople.filter(matchesHcp),\n    rowSelection: batchMode ? {selectedRowKeys: batchKeys, onChange: setBatchKeys, preserveSelectedRowKeys: true} : undefined,\n    locale: {emptyText: flowSearch.trim() ? '未找到匹配的 HCP，请尝试其他姓名或手机号' : '暂无采集对象'},",1)
needle='  }, /*#__PURE__*/React.createElement(Table, {\n    dataSource: visiblePeople.filter(matchesHcp),'
assert needle in s
s=s.replace(needle,'  }, flowToolbar(true), /*#__PURE__*/React.createElement(Table, {\n    dataSource: visiblePeople.filter(matchesHcp),',1)
s=s.replace("const reviewRecords = sourceRecords.filter(item => getConversationStatus(item, page === 'detail' ? 'demand' : 'collector'));", "const reviewRecords = sourceRecords.filter(item => getConversationStatus(item, page === 'detail' ? 'demand' : 'collector')).filter(item => page !== 'flow' || matchesHcp({...item, ...visiblePeople.find(person => item.hcpKey ? person.key === item.hcpKey : person.name === item.name)}));")
s=s.replace("    }, page === 'detail' && /*#__PURE__*/React.createElement(\"div\", {\n      className: \"dataset-status-toolbar\"", "    }, page === 'flow' && flowToolbar(false), page === 'detail' && /*#__PURE__*/React.createElement(\"div\", {\n      className: \"dataset-status-toolbar\"")
s=s.replace("page === 'flow' ? '暂无医生已提交的数据'", "page === 'flow' ? (flowSearch.trim() ? '未找到匹配的数据，请尝试其他姓名或手机号' : '暂无医生已提交的数据')")
p.write_text(s,encoding='utf-8')
