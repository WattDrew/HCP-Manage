(function () {
  const h = React.createElement;
  const {Button, Descriptions, Modal, Form, InputNumber, Switch} = antd;
  const defaults = {minTurns: 20, minDoctorChars: 500};
  const valid = value => Number.isSafeInteger(value) && value > 0;
  const reviewKey = projectId => `yubei-review-demo:${projectId}`;
  function autoApprove(projectId) {
    try { return JSON.parse(localStorage.getItem(reviewKey(projectId)))?.autoFinalApprove === true; }
    catch (_) { return false; }
  }
  window.ReviewSettings = {autoApprove};
  window.ScreeningSettings = function ScreeningSettings({projectId, frequency, onEditFrequency}) {
    const storageKey = `yubei-ai-screening-demo:${projectId}`;
    const [rule, setRule] = React.useState(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(storageKey));
        return stored && valid(stored.minTurns) && valid(stored.minDoctorChars) ? stored : {...defaults};
      } catch (_) { return {...defaults}; }
    });
    const [automatic, setAutomatic] = React.useState(() => autoApprove(projectId));
    const [reviewOpen, setReviewOpen] = React.useState(false);
    const [reviewDraft, setReviewDraft] = React.useState(automatic);
    const [open, setOpen] = React.useState(false);
    const [form] = Form.useForm();
    const {message} = antd.App.useApp();
    const openEditor = () => {form.setFieldsValue(rule);setOpen(true);};
    const save = values => {
      try {localStorage.setItem(storageKey, JSON.stringify(values));}
      catch (_) {message.error('保存失败，浏览器存储不可用，请重试');return;}
      setRule(values);setOpen(false);message.success('AI 初筛标准已保存');
    };
    const saveReview = checked => {
      try {localStorage.setItem(reviewKey(projectId), JSON.stringify({autoFinalApprove:checked}));}
      catch (_) {message.error('保存失败，浏览器存储不可用，请重试');return;}
      setAutomatic(checked);
      setReviewOpen(false);
      message.success(checked ? '已开启自动终审通过' : '已关闭自动终审通过');
    };
    const fieldRules = [{required:true,message:'请输入正整数'}, {validator:(_, value) => valid(value) ? Promise.resolve() : Promise.reject(new Error('请输入大于 0 的整数'))}];
    return h(React.Fragment, null,
      h(Descriptions, {bordered:true,column:1,style:{marginBottom:0},items:[
        {key:'screening',label:'AI 初筛标准',children:h('div',{className:'project-setting-value'},
          h('span',null,`对话不少于 ${rule.minTurns} 轮，且医生回复总字数不少于 ${rule.minDoctorChars} 字`),
          h(Button,{type:'link',size:'small',onClick:openEditor},'修改'))},
        {key:'review',label:'审核设置',children:h('div',{className:'project-setting-value'},
          h('span',null,automatic?'自动终审通过（初审通过后自动终审通过）':'人工终审（初审通过后，由需求端人工终审）'),
          h(Button,{type:'link',size:'small',onClick:()=>{setReviewDraft(automatic);setReviewOpen(true);}},'修改'))},
        {key:'frequency',label:'HCP 采集频率限制',children:h('div',{className:'project-setting-value'},
          h('span',null,frequency.frequencyMode === 'once' ? '当前项目不能重复采集' : `指定周期内不能重复采集（${frequency.days}天内可采集${frequency.times}次）`),
          h(Button,{type:'link',size:'small',onClick:onEditFrequency},'修改'))}
      ]}),
      h(Modal,{title:'修改审核设置',open:reviewOpen,onCancel:()=>setReviewOpen(false),onOk:()=>saveReview(reviewDraft),okText:'保存',cancelText:'取消'},
        h('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'24px 0 12px'}},
          h('span',null,'自动终审通过'),h(Switch,{'aria-label':'自动终审通过',checked:reviewDraft,onChange:setReviewDraft,checkedChildren:'开启',unCheckedChildren:'关闭'})),
        h('p',{style:{color:'#667085',marginBottom:24}},'开启后，初审通过的数据自动终审通过。')),
      h(Modal,{title:'修改 AI 初筛标准',open,onCancel:()=>setOpen(false),onOk:()=>form.submit(),okText:'保存',cancelText:'取消',destroyOnClose:true},
        h(Form,{form,layout:'horizontal',labelCol:{flex:'180px'},wrapperCol:{flex:'1'},labelAlign:'left',colon:false,onFinish:save},
          h(Form.Item,{name:'minTurns',label:'最低对话轮次',rules:fieldRules,validateFirst:true},h(InputNumber,{'aria-label':'最低对话轮次',min:1,step:1,addonAfter:'轮',style:{width:'100%'}})),
          h(Form.Item,{name:'minDoctorChars',label:'医生回复最低总字数',rules:fieldRules,validateFirst:true},h(InputNumber,{'aria-label':'医生回复最低总字数',min:1,step:1,addonAfter:'字',style:{width:'100%'}})),
          h(Button,{type:'link',style:{padding:0},onClick:()=>form.setFieldsValue(defaults)},'恢复默认值（20 轮、500 字）'))))
  };
})();

