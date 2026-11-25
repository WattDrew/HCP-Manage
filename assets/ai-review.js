(function () {
  const h = React.createElement;
  const {Button, Modal, Input, Alert, Tag, Progress, message} = antd;
  const dimensions = ['内容完整性', '主题相关性', '信息有效性', '合规与隐私'];
  const cache = new Map();

  // Local prototype rules: no remote model or medical judgment is involved.
  function analyze(entries) {
    const doctor = entries.map((e,i)=>({...e,index:i})).filter(e=>e.sender !== 'rep' && e.text?.trim());
    const all = entries.map(e=>e.text || '').join('\n');
    const complete = /随访|复查/.test(all) && /评估|疗效/.test(all) && /适用|年龄|人群/.test(all);
    const evidence = doctor.length ? doctor[doctor.length-1] : null;
    const rules = {
      '内容完整性': {status:doctor.length < 2?'risk':complete?'pass':'warning', summary:doctor.length < 2?'医生有效回答不足，建议补充采集。':complete?'对话覆盖适用人群、随访及效果评估。':'对话包含问答，但干预依据、随访及效果评估仍需人工核实。', evidence},
      '主题相关性': {status:/近视|眼科|儿童|干预/.test(all)?'pass':'warning', summary:/近视|眼科|儿童|干预/.test(all)?'识别到近视防控相关内容，与当前眼科采集主题相关。':'未识别到明确的眼科主题关键词，请人工核实项目相关性。', evidence:doctor.find(e=>/近视|儿童|干预/.test(e.text))||evidence},
      '信息有效性': {status:doctor.some(e=>e.text.length>=30)?'pass':'warning', summary:doctor.some(e=>e.text.length>=30)?'包含具体诊疗经验描述，可作为人工评估的参考。':'回答信息量较少，建议核实是否满足采集要求。', evidence},
      '合规与隐私': {status:/1[3-9]\d{9}|\d{17}[\dXx]/.test(all)?'risk':'pass', summary:/1[3-9]\d{9}|\d{17}[\dXx]/.test(all)?'发现疑似联系方式或证件号码，请脱敏后重新审核。':'未检出明显手机号或身份证号。', evidence:/1[3-9]\d{9}|\d{17}[\dXx]/.test(all)?entries.map((e,index)=>({...e,index})).find(e=>/1[3-9]\d{9}|\d{17}[\dXx]/.test(e.text)):null}
    };
    return dimensions.map(name=>({name,...rules[name]}));
  }

  function reviewReport(rows) {
    const recommendation = rows.some(row=>row.status==='risk') ? '建议驳回' : rows.every(row=>row.status==='pass') ? '建议通过' : '建议符合';
    const reasonMarkdown = '### 审核理由\n\n'+rows.map(row=>'- **'+row.name+'**：'+row.summary).join('\n');
    return {rows,recommendation,reasonMarkdown,at:new Date().toLocaleString('zh-CN')};
  }

  // Render Markdown as React text nodes; raw HTML is never executed.
  function Markdown({text}) {
    const inline = value=>value.split(/(\*\*[^*]+\*\*)/g).map((part,index)=>part.startsWith('**')?h('strong',{key:index},part.slice(2,-2)):part);
    const blocks=[];let list=[];
    function flush(){if(list.length){blocks.push(h('ul',{key:blocks.length},list));list=[];}}
    text.split('\n').forEach((line,index)=>{
      if(/^[-*] /.test(line)){list.push(h('li',{key:index},inline(line.slice(2))));return;}
      flush();
      if(/^### /.test(line))blocks.push(h('h4',{key:index},inline(line.slice(4))));
      else if(line.trim())blocks.push(h('p',{key:index},inline(line)));
    });
    flush();return h('div',{className:'ai-review-markdown'},blocks);
  }

  window.AIReview = function AIReview({scope,record,conversation,onDecision,reviewStage="final",disabled=false}) {
    const label = reviewStage === 'initial' ? '初审' : '终审';
    const approved = reviewStage === 'initial' ? 'initial_approved' : 'final_approved';
    const rejected = reviewStage === 'initial' ? 'initial_rejected' : 'final_rejected';
    const key = scope+':'+record.key+':'+reviewStage+':'+JSON.stringify(conversation);
    const [open,setOpen] = React.useState(false);
    const [phase,setPhase] = React.useState('running');
    const [progress,setProgress] = React.useState(0);
    const [result,setResult] = React.useState(null);
    const [error,setError] = React.useState('');
    const [source,setSource] = React.useState(null);
    const [decision,setDecision] = React.useState(null);
    const [reason,setReason] = React.useState('');
    const timer = React.useRef(null);
    React.useEffect(()=>()=>clearInterval(timer.current),[]);
    function close(){clearInterval(timer.current);setOpen(false);setDecision(null);setSource(null);}
    function launch(){if(disabled)return;const saved=cache.get(key);setResult(saved||null);setError('');setOpen(true);if(saved)setPhase('result');else run();}
    function run(){
      if(!conversation.some(e=>e.text?.trim())){setError('暂无对话内容，请检查后重试。');setPhase('error');return;}
      setError('');setSource(null);setProgress(0);setPhase('running');
      let value=0;
      clearInterval(timer.current);
      timer.current=setInterval(()=>{
        value+=20;setProgress(value);
        if(value>=100){
          clearInterval(timer.current);
          try {
            const rows=analyze(conversation);
            const report=reviewReport(rows);
            cache.set(key,report);setResult(report);setPhase('result');
          } catch (_) {setError('分析未完成，请重试。');setPhase('error');}
        }
      },450);
    }
    function confirm(){
      if(disabled)return;
      if(decision===rejected&&!reason.trim()){message.warning('请填写不通过原因');return;}
      close();onDecision(decision,{aiReview:result,reviewMethod:'AI辅助审核后人工'+label,...(decision===rejected?{reason:reason.trim()}: {})});
    }
    const resultColor=result?.recommendation==='建议通过'?'success':result?.recommendation==='建议驳回'?'error':'warning';
    return h(React.Fragment,null,
      h(Button,{className:'ai-review-trigger',disabled,onClick:launch},h('span',{'aria-hidden':true},'✦ '),'AI 辅助审核'),
      h(Modal,{title:h('div',{className:'ai-review-title'},h('span',{className:'ai-review-symbol'},'✦'),'AI 辅助审核'),open,width:760,zIndex:1400,onCancel:close,footer:phase==='running'?h('div',{className:'ai-review-cancel'},h(Button,{onClick:close},'取消分析')):phase==='error'?h('div',{className:'ai-review-footer'},h(Button,{onClick:close},'返回'),h(Button,{type:'primary',onClick:run},'重试')):h('div',{className:'ai-review-footer'},h(Button,{onClick:run},'重新分析'),h('span',{className:'ai-review-spacer'}),h(Button,{onClick:close},'返回'),h(Button,{danger:true,onClick:()=>{setReason(result.rows.filter(r=>r.status!=='pass').map(r=>r.name+'：'+r.summary).join('\n'));setDecision(rejected);}},label+'不通过'),h(Button,{type:'primary',onClick:()=>setDecision(approved)},label+'通过'))},
        h('div',{className:'ai-review-body'},
          phase==='error'&&h(Alert,{type:'error',message:error,showIcon:true}),
          phase==='running'&&h('div',{className:'ai-review-running','aria-live':'polite'},h('div',{className:'ai-review-orbit'},'✦'),h('h3',null,'正在审核对话'),h('p',null,['读取对话','检查内容完整性','核查有效信息与隐私','整理原文依据','生成审核建议'][Math.min(4,Math.floor(progress/20))]),h(Progress,{percent:progress})),
          phase==='result'&&result&&h('div',{className:'ai-review-results'},
            h('div',{className:'ai-review-summary'},h('div',null,h('small',null,'审核建议'),h('h3',null,h(Tag,{color:resultColor},result.recommendation)))),
            h(Markdown,{text:result.reasonMarkdown}),
            h(Button,{type:'link',size:'small',onClick:()=>setSource(source?null:'all')},source?'收起原文依据':'查看原文依据'),
            source&&h('div',{className:'ai-review-evidence'},result.rows.filter(row=>row.evidence).filter((row,index,rows)=>rows.findIndex(other=>other.evidence.index===row.evidence.index)===index).map(row=>h('blockquote',{key:row.evidence.index},h('small',null,`第 ${row.evidence.index+1} 条 · ${row.evidence.sender==='rep'?'医药代表':'医生'}`),h('p',null,row.evidence.text))))))),
      h(Modal,{title:'确认'+label+(decision===rejected?'不通过':'通过'),open:!!decision,zIndex:1500,onCancel:()=>setDecision(null),onOk:confirm,okText:'确认提交',cancelText:'继续复核',okButtonProps:{danger:decision===rejected,disabled:disabled||decision===rejected&&!reason.trim()}},h('p',null,decision===rejected?'请填写不通过原因。':'确认通过'+label+'？'),decision===rejected&&h(Input.TextArea,{value:reason,onChange:e=>setReason(e.target.value),rows:4,maxLength:1000,showCount:true,'aria-label':label+'不通过原因',placeholder:'请输入不通过原因'})));
  };
})();
