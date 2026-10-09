/* Ant Design 5 + React 18. Source for assets/app.js; browser bundles are pinned locally. */
const {
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} = React;
const {
  ConfigProvider,
  Layout,
  Menu,
  Button,
  Card,
  Table,
  Tabs,
  Input,
  Select,
  Tag,
  Avatar,
  Space,
  Breadcrumb,
  Progress,
  Checkbox,
  Form,
  InputNumber,
  Drawer,
  Modal,
  Empty,
  Alert,
  Descriptions,
  Popconfirm,
  Dropdown,
  App: AntApp,
  QRCode,
  Tooltip,
  Segmented
} = antd;
const {
  Header,
  Sider,
  Content
} = Layout;
function Icon({
  name = 'grid',
  size = 18
}) {
  const paths = {
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    task: 'M8 4h12v17H4V4h4 M9 2h6v5H9z M8 12h8 M8 16h5',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 4a4 4 0 0 1 0 7 M22 21v-2a4 4 0 0 0-3-3.87',
    setting: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',
    ai: 'M12 3l2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8z',
    search: 'M21 21l-5-5 M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15',
    plus: 'M12 5v14 M5 12h14',
    arrow: 'M19 12H5 M11 6l-6 6 6 6',
    data: 'M4 5h16v14H4z M8 9h8 M8 13h5',
    clock: 'M12 8v5l3 2 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
    info: 'M12 11v6 M12 7h.01 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
    menu: 'M4 6h16 M4 12h16 M4 18h16',
    check: 'M5 12l4 4L19 6',
    link: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2',
    copy: 'M8 8h11v11H8z M5 16H4V4h12v1',
    more: 'M12 5h.01 M12 12h.01 M12 19h.01'
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.65",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: paths[name] || paths.grid
  }));
}
const initialProjects = [{
  key: 'P-001',
  name: '眼科数据采集项目',
  owner: '小贝',
  specialty: '内科｜主任医生',
  current: 652,
  target: 1000,
  state: 'active',
  date: '2026.09.17',
  goal: '提升 AI 医生的专业性和对话自然度，采集真实 HCP 的拜访对话数据。',
  requirements: '采集对象为主任医师',
  collector: '张三'
}, {
  key: 'P-002',
  name: '眼科数据采集项目',
  owner: '小贝',
  specialty: '内科｜主任医生',
  current: 1023,
  target: 1000,
  state: 'done',
  date: '2026.09.16',
  collector: '张三'
}, {
  key: 'P-003',
  name: '呼吸科数据采集项目',
  owner: null,
  specialty: null,
  current: 186,
  target: 800,
  state: 'active',
  date: '2026.09.18',
  goal: '提升 AI 医生在呼吸科常见疾病沟通中的专业性。',
  requirements: '采集呼吸科 HCP 的真实拜访对话数据',
  collector: '张三'
}, {
  key: 'P-004',
  name: '儿科数据采集项目',
  owner: '王医生',
  specialty: '儿科｜主治医生',
  current: 320,
  target: 800,
  state: 'void',
  date: '2026.09.19',
  goal: '提升 AI 医生在儿科常见疾病沟通中的专业性。',
  requirements: '采集儿科 HCP 的真实拜访对话数据',
  collector: '张三'
}];
const initialTasks = [{
  key: 'T-001',
  project: 'P-001',
  name: '眼科数据采集接口',
  collector: '张三',
  state: 'active',
  target: 1000,
  current: 234
}, {
  key: 'T-002',
  project: 'P-002',
  name: '眼科数据采集接口',
  collector: '张三',
  state: 'done',
  target: 1000,
  current: 234
}, {
  key: 'T-003',
  project: 'P-001',
  name: '眼科随访采集接口',
  collector: '李四',
  state: 'stopped',
  target: 600,
  current: 176
}, {
  key: 'T-004',
  project: 'P-003',
  name: '儿科数据采集接口',
  collector: '王五',
  state: 'invalid',
  target: 800,
  current: 0
}];
const initialApis = [{
  key: 'API-001',
  project: 'P-001',
  name: '华东区域采集 API',
  value: 'yb_live_huadong_8F3K9Q2M',
  peak: 600,
  collector: '张三',
  collectorRole: '医药代表',
  note: '用于华东区域采集公司对接',
  status: 'collecting',
  company: '核盛网络科技有限公司',
  createdAt: '2026.09.17 10:28'
}, {
  key: 'API-002',
  project: 'P-001',
  name: '华南区域采集 API',
  value: 'yb_live_huanan_2D7N4X8P',
  peak: 400,
  collector: '小贝',
  collectorRole: '数据专员',
  note: '待分配给华南采集供应商',
  status: 'pending',
  company: '',
  createdAt: '2026.09.18 14:06'
}, {
  key: 'API-003',
  project: 'P-001',
  name: '华北区域采集 API',
  value: 'yb_live_huabei_5M8R2C7L',
  peak: 500,
  collector: '李四',
  collectorRole: '医药代表',
  note: '华北区域采集已完成',
  status: 'completed',
  company: '北京博采数据服务有限公司',
  createdAt: '2026.09.16 09:42'
}, {
  key: 'API-004',
  project: 'P-001',
  name: '西南区域采集 API',
  value: 'yb_live_xinan_3P6T9B4H',
  peak: 350,
  collector: '王五',
  collectorRole: '数据专员',
  note: '西南区域采集已暂停',
  status: 'stopped',
  company: '成都新源数据科技有限公司',
  createdAt: '2026.09.15 16:20'
}];
const initialProjectTasks = [{
  key: 'PT-001',
  project: 'P-001',
  name: '眼科首轮采集任务',
  collector: '张三',
  state: 'draft',
  target: 1000,
  current: 0
}, {
  key: 'PT-002',
  project: 'P-001',
  name: '眼科数据采集任务',
  collector: '张三',
  state: 'active',
  target: 1000,
  current: 234
}, {
  key: 'PT-003',
  project: 'P-001',
  name: '眼科随访采集任务',
  collector: '张三',
  state: 'stopped',
  target: 600,
  current: 176
}];
const initialRecords = [{
  key: 'D-001',
  apiKey: 'API-001',
  name: '张医生',
  turns: 20,
  stage: 'pending_cleaning',
  time: '2026.09.17 11:25'
}, {
  key: 'D-002',
  apiKey: 'API-002',
  name: '李医生',
  turns: 18,
  stage: 'pending_initial_review',
  time: '2026.09.17 11:25'
}, {
  key: 'D-003',
  apiKey: 'API-001',
  name: '王医生',
  turns: 21,
  stage: 'initial_approved',
  time: '2026.09.17 11:25'
}, {
  key: 'D-004',
  apiKey: 'API-003',
  name: '赵医生',
  turns: 16,
  stage: 'initial_rejected',
  time: '2026.09.17 11:25'
}, {
  key: 'D-005',
  apiKey: 'API-002',
  name: '陈医生',
  turns: 22,
  stage: 'final_rejected',
  time: '2026.09.17 11:25'
}, {
  key: 'D-006',
  apiKey: 'API-003',
  name: '周医生',
  turns: 19,
  stage: 'final_approved',
  time: '2026.09.17 11:25'
}, {
  key: 'D-007',
  apiKey: 'API-004',
  name: '李医生',
  turns: 14,
  stage: 'pending_cleaning',
  time: '2026.09.16 16:40'
}, {
  key: 'D-008',
  apiKey: 'API-004',
  name: '李医生',
  turns: 22,
  stage: 'initial_approved',
  time: '2026.09.15 09:18'
}];
const conversationStatus = {
  collector: {
    pending_cleaning: ['待错别字清洗', 'warning'],
    pending_initial_review: ['待初审', 'processing'],
    initial_rejected: ['初审未通过', 'error'],
    initial_approved: ['初审通过', 'success'],
    final_rejected: ['终审未通过', 'error'],
    final_approved: ['终审通过', 'success']
  },
  demand: {
    initial_approved: ['待审核', 'warning'],
    final_rejected: ['终审未通过', 'error'],
    final_approved: ['终审通过', 'success']
  }
};
function getConversationStatus(record, end) {
  return conversationStatus[end][record.stage] || null;
}
function getReviewProgress(record) {
  const stage = record?.stage;
  const cleaned = stage && stage !== 'pending_cleaning';
  const initial = stage === 'pending_initial_review' ? '待初审' : stage === 'initial_rejected' ? '初审未通过' : ['initial_approved', 'final_rejected', 'final_approved'].includes(stage) ? '初审通过' : '未开始';
  const final = stage === 'initial_approved' ? '待终审' : stage === 'final_rejected' ? '终审未通过' : stage === 'final_approved' ? '终审通过' : '未开始';
  return {
    submitted: '已提交',
    cleaned: cleaned ? '已完成' : '待处理',
    initial,
    final
  };
}
const initialPermissions = [{
  key: 'PERM-001',
  module: '采集项目',
  name: '项目查看',
  code: 'project:read',
  enabled: true
}, {
  key: 'PERM-002',
  module: '采集接口',
  name: '接口管理',
  code: 'task:manage',
  enabled: true
}, {
  key: 'PERM-003',
  module: 'HCP 管理',
  name: 'HCP 档案管理',
  code: 'hcp:manage',
  enabled: true
}, {
  key: 'PERM-004',
  module: '系统设置',
  name: '权限配置',
  code: 'system:manage',
  enabled: true
}];
const initialRoles = [{
  key: 'ROLE-001',
  name: '管理员',
  description: '负责全局配置与账号管理',
  permissions: ['PERM-001', 'PERM-002', 'PERM-003', 'PERM-004']
}, {
  key: 'ROLE-002',
  name: '项目管理员',
  description: '负责项目与采集接口管理',
  permissions: ['PERM-001', 'PERM-002', 'PERM-003']
}, {
  key: 'ROLE-003',
  name: '数据专员',
  description: '负责数据清洗与提交',
  permissions: ['PERM-001', 'PERM-002']
}];
const initialAccounts = [{
  key: 'USER-001',
  name: '周新华',
  phone: '138****8888',
  role: '管理员',
  status: 'active'
}, {
  key: 'USER-002',
  name: '小贝',
  phone: '139****6666',
  role: '项目管理员',
  status: 'active'
}, {
  key: 'USER-003',
  name: '张三',
  phone: '137****5128',
  role: '数据专员',
  status: 'active'
}];
const initialConversation = ['张主任您好', '你好', '今天主要想跟您交流一下儿童近视防控这块。最近门诊这类患者多吗？', '挺多的，尤其是低龄儿童，现在家长对近视也比较焦虑。', '那您现在临床上对于低龄近视患儿，一般会怎么做干预？', '要看具体情况。首先是用眼习惯、户外活动，必要时也会考虑药物或者 OK 镜。'];
function Status({
  state
}) {
  return /*#__PURE__*/React.createElement(Tag, {
    color: {
      active: 'processing',
      done: 'success',
      pending: 'warning',
      stopped: 'default',
      invalid: 'error',
      draft: 'default',
      ready: 'default'
    }[state]
  }, {
    active: '采集中',
    done: '已完成',
      pending: '待清洗',
      stopped: '已停止',
      invalid: '已失效',
      draft: '待发布',
    ready: '待采集'
  }[state]);
}
function maskName(name) {
  return name?.endsWith('医生') ? `${name.slice(0, 1)}*医生` : name;
}
const ownerProfiles = {
  '李医生': '眼科｜主任医生',
  '小贝': '内科｜主任医生',
  '王医生': '儿科｜主治医生'
};
function personMeta(name, sub) {
  return ownerProfiles[name] && ['主任医师', '主治医师', '心血管专线'].includes(sub) ? ownerProfiles[name] : sub;
}
function Person({
  name,
  sub,
  masked = true
}) {
  if (!name) return /*#__PURE__*/React.createElement("span", {
    className: "empty-value"
  }, "-");
  return /*#__PURE__*/React.createElement("div", {
    className: "person"
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 32,
    style: {
      background: '#edf3ff',
      color: '#5d7cac'
    }
  }, name.slice(0, 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cell-title"
  }, masked ? maskName(name) : name), /*#__PURE__*/React.createElement("div", {
    className: "cell-meta"
  }, personMeta(name, sub))));
}
function PersonOption({
  name,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "person-option"
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 30,
    style: {
      background: '#edf3ff',
      color: '#5d7cac'
    }
  }, name.slice(0, 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, name), /*#__PURE__*/React.createElement("small", null, personMeta(name, sub))));
}
function MiniappPreview() {
  const host = useRef(null);
  const [scale, setScale] = useState(null);
  useLayoutEffect(() => {
    const resize = () => {
      const box = host.current;
      if (!box) return;
      const style = getComputedStyle(box);
      const width = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      setScale(Math.max(0, Math.min(1, width / 375, height / 812)));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host.current);
    resize();
    return () => observer.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "miniapp-shell",
    ref: host
  }, /*#__PURE__*/React.createElement("div", {
    className: "miniapp-device",
    style: {
      width: 375 * (scale || 0),
      height: 812 * (scale || 0),
      visibility: scale === null ? 'hidden' : 'visible'
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    title: "\u5143\u533B AI \u91C7\u96C6\u7AEF",
    src: "miniapp.html?embedded=1&v=4",
    style: {
      transform: `scale(${scale || 0})`
    }
  })));
}
const removedHcpStorageKey = 'yubei-removed-task-hcps';
function Workspace() {
  const {
    message
  } = AntApp.useApp();
  const statusFilter = (options, getValue = record => record.state) => ({
    filterDropdown: ({
      selectedKeys,
      setSelectedKeys,
      confirm
    }) => /*#__PURE__*/React.createElement("div", {
      className: "status-filter-menu"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: selectedKeys.length === 0,
      onChange: () => setSelectedKeys([])
    }, "\u5168\u90E8"), options.map(option => /*#__PURE__*/React.createElement(Checkbox, {
      key: option.value,
      checked: selectedKeys.includes(option.value),
      onChange: event => setSelectedKeys(event.target.checked ? [...selectedKeys, option.value] : selectedKeys.filter(key => key !== option.value))
    }, option.text)), /*#__PURE__*/React.createElement("div", {
      className: "status-filter-confirm"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      size: "small",
      onClick: () => confirm()
    }, "\u786E\u8BA4"))),
    onFilter: (value, record) => getValue(record) === value,
    onHeaderCell: () => ({
      className: 'status-filter-header'
    })
  });
  const [page, setPage] = useState('project'),
    [mobile, setMobile] = useState(false),
    [projects, setProjects] = useState(initialProjects),
    [tasks, setTasks] = useState(initialTasks),
    [projectTasks, setProjectTasks] = useState(initialProjectTasks),
    [selected, setSelected] = useState(initialProjects[0]),
    [task, setTask] = useState(initialTasks[0]);
  const [filter, setFilter] = useState('active'),
    [search, setSearch] = useState(''),
    [detailTab, setDetailTab] = useState('apis'),
    [flowTab, setFlowTab] = useState('people'),
    [modal, setModal] = useState(null),
    [record, setRecord] = useState(null),
    [records, setRecords] = useState(initialRecords),
    [datasetReviewFilter, setDatasetReviewFilter] = useState('all'),
    [recordTab, setRecordTab] = useState('raw'),
    [conversation, setConversation] = useState(initialConversation.map((text, i) => ({
      text,
      sender: i % 2 === 0 ? 'rep' : 'doctor'
    }))),
    [editing, setEditing] = useState(-1),
    [editText, setEditText] = useState('');
  const [people, setPeople] = useState([{
    key: 'H-001',
    name: '张医生',
    phone: '138*****1026',
    turns: 6,
    submitted: 1,
    initialApproved: 0,
    finalApproved: 0,
    state: 'active'
  }, {
    key: 'H-002',
    name: '李医生',
    phone: '153*****3212',
    turns: 10,
    submitted: 3,
    initialApproved: 2,
    finalApproved: 0,
    state: 'active'
  }, {
    key: 'H-003',
    name: '赵医生',
    phone: '136*****5874',
    turns: 7,
    submitted: 1,
    initialApproved: 0,
    finalApproved: 0,
    state: 'active'
  }, {
    key: 'H-004',
    name: '王医生',
    phone: '139*****7318',
    turns: 10,
    submitted: 10,
    initialApproved: 8,
    finalApproved: 5,
    state: 'done'
  }, {
    key: 'H-005',
    name: '陈医生',
    phone: '137*****9045',
    turns: 8,
    submitted: 1,
    initialApproved: 0,
    finalApproved: 0,
    state: 'done'
  }, {
    key: 'H-006',
    name: '周医生',
    phone: '135*****2469',
    turns: 12,
    submitted: 1,
    initialApproved: 1,
    finalApproved: 1,
    state: 'done'
  }]);
  const [hcps, setHcps] = useState(() => people.map((p, index) => ({
    ...p,
    title: index === 0 ? '主任医师' : '执业医师'
  })));
  const [removedHcpKeys, setRemovedHcpKeys] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(removedHcpStorageKey) || '[]');
    } catch {
      return [];
    }
  });
  const [doctorDrawer, setDoctorDrawer] = useState(null),
    [doctorSession, setDoctorSession] = useState(null),
    [taskDrawer, setTaskDrawer] = useState(null),
    [taskEditing, setTaskEditing] = useState(null),
    [projectEditing, setProjectEditing] = useState(null),
    [aiGenerating, setAiGenerating] = useState(false),
    [aiGenerated, setAiGenerated] = useState(false),
    [inviteMode, setInviteMode] = useState('existing');
  const aiGenerateTimer = useRef(null);
  const [form] = Form.useForm(),
    [inviteForm] = Form.useForm(),
    [taskForm] = Form.useForm(),
    [hcpForm] = Form.useForm(),
    [accountForm] = Form.useForm(),
    [roleForm] = Form.useForm(),
    [permissionForm] = Form.useForm();
  const [settingsTab, setSettingsTab] = useState('account'),
    [accounts, setAccounts] = useState(initialAccounts),
    [roles, setRoles] = useState(initialRoles),
    [permissions, setPermissions] = useState(initialPermissions),
    [settingEdit, setSettingEdit] = useState(null),
    [apis, setApis] = useState(initialApis),
    [apiEditing, setApiEditing] = useState(null),
    [profileTab, setProfileTab] = useState('personal');
  const [apiForm] = Form.useForm(),
    [integrationForm] = Form.useForm();
  const activeMenu = ['detail', 'form', 'api'].includes(page) ? 'project' : ['flow', 'conversation'].includes(page) ? 'task' : page;
  const labels = {
    training: '训练 E 人',
    knowledge: '知识库',
    project: '采集项目',
    task: '采集接口',
    hcp: 'HCP 管理',
    setting: '系统设置',
    profile: '用户中心',
    api: 'API 管理',
    ai: '元医 AI',
    detail: '项目详情',
    form: projectEditing ? '编辑采集项目' : '新建采集项目',
    flow: '接口详情',
    conversation: '对话详情'
  };
  function navigate(p) {
    if (p !== 'form' && aiGenerateTimer.current) {
      clearTimeout(aiGenerateTimer.current);
      aiGenerateTimer.current = null;
      setAiGenerating(false);
    }
    setPage(p);
    setFilter(p === 'project' ? 'active' : 'all');
    setSearch('');
    setMobile(false);
    window.scrollTo(0, 0);
  }
  function openProject(p) {
    setSelected(p);
    setDetailTab('apis');
    setDatasetReviewFilter('all');
    navigate('detail');
  }
  function openApiCreator() {
    setApiEditing(null);
    apiForm.resetFields();
    apiForm.setFieldsValue({
      collector: selected.collector || '张三',
      peak: selected.target || 1000
    });
    setModal('api');
  }
  function generateProjectPlan() {
    const values = form.getFieldsValue(['name', 'owner', 'goal']);
    if (!values.name || !values.owner || !values.goal) {
      message.warning('请先填写项目名称、提升 E 人和提升目标');
      return;
    }
    setAiGenerating(true);
    setAiGenerated(false);
    aiGenerateTimer.current = setTimeout(() => {
      form.setFieldsValue({
        requirements: `围绕「${values.goal}」采集真实 HCP 对话；建议对象为相关专科主治及以上医师，单次对话不少于 12 轮，并完成脱敏与质量审核。`,
        target: values.name.includes('首轮') ? 500 : 1000,
        collector: '张三'
      });
      setAiGenerating(false);
      setAiGenerated(true);
      aiGenerateTimer.current = null;
      message.success('AI 已生成采集要求和预估数量');
    }, 3000);
  }
  function createApi(values) {
    const suffix = Math.random().toString(36).slice(2, 10).toUpperCase();
    setApis([{
      key: 'API-' + Date.now(),
      project: selected.key,
      name: values.name,
      value: `yb_live_${suffix}`,
      peak: values.peak,
      collector: values.collector,
      collectorRole: ['小贝', '王五'].includes(values.collector) ? '数据专员' : '医药代表',
      note: values.note || '',
      status: 'pending',
      company: '',
      createdAt: dayjs().format('YYYY.MM.DD HH:mm')
    }, ...apis]);
    setModal(null);
    apiForm.resetFields();
    message.success('API 已生成，可复制给采集公司');
  }
  function editApi(row) {
    setApiEditing(row);
    apiForm.setFieldsValue({
      name: row.name,
      peak: row.peak,
      collector: row.collector,
      note: row.note
    });
    setModal('api');
  }
  function saveApi(values) {
    if (!apiEditing) {
      createApi(values);
      return;
    }
    setApis(apis.map(item => item.key === apiEditing.key ? {
      ...item,
      ...values,
      collectorRole: ['小贝', '王五'].includes(values.collector) ? '数据专员' : '医药代表'
    } : item));
    setModal(null);
    setApiEditing(null);
    apiForm.resetFields();
    message.success('API 已更新');
  }
  function copyApi(value) {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(value);
    message.success('API 已复制');
  }
  function updateApiStatus(row, status) {
    setApis(apis.map(item => item.key === row.key ? {...item, status} : item));
    message.success(status === 'stopped' ? '采集已停止' : status === 'completed' ? '采集已完成' : '已继续采集');
  }
  function handleApiMenu(row, key) {
    if (key === 'copy') {
      copyApi(row.value);
      return;
    }
    if (key === 'stop') {
      Modal.confirm({
        title: '确认停止采集？',
        okText: '停止采集',
        cancelText: '取消',
        onOk: () => updateApiStatus(row, 'stopped')
      });
      return;
    }
    if (key === 'continue') {
      updateApiStatus(row, 'collecting');
      return;
    }
    if (key === 'complete') {
      Modal.confirm({
        title: '确认完成采集？',
        content: '完成后将不再接收新数据。',
        okText: '完成采集',
        cancelText: '取消',
        onOk: () => updateApiStatus(row, 'completed')
      });
      return;
    }
    if (key === 'delete') Modal.confirm({
      title: '确认删除该 API？',
      content: '删除后无法恢复，已发出的密钥将失效。',
      okText: '确认删除',
      okButtonProps: {danger: true},
      cancelText: '取消',
      onOk: () => {
        setApis(current => current.filter(item => item.key !== row.key));
        message.success('API 已删除');
      }
    });
  }
  function apiMenuItems(row) {
    const stateItems = row.status === 'collecting' ? [{key: 'stop', label: '停止采集'}, {key: 'complete', label: '完成采集'}] : row.status === 'stopped' ? [{key: 'continue', label: '继续采集'}, {key: 'complete', label: '完成采集'}] : [];
    return [...stateItems, ...(stateItems.length ? [{type: 'divider'}] : []), {key: 'copy', label: '复制密钥'}, {type: 'divider'}, {key: 'delete', label: '删除', danger: true}];
  }
  function connectApi(values) {
    const matched = apis.find(item => item.value === values.api.trim());
    if (!matched) {
      message.error('接口编号无效，请检查后重试');
      return;
    }
    setApis(apis.map(item => item.key === matched.key ? {...item, status: 'collecting', company: '上海元采数据服务有限公司'} : item));
    if (!tasks.some(item => item.apiKey === matched.key)) {
      const project = projects.find(item => item.key === matched.project);
      setTasks([{
        key: 'T-' + Date.now(),
        apiKey: matched.key,
        project: matched.project,
        name: `${project?.name || '新项目'}采集接口`,
        collector: matched.collector,
        target: matched.peak,
        current: 0,
        state: 'active'
      }, ...tasks]);
    }
    setModal(null);
    integrationForm.resetFields();
    message.success('采集接口接入成功，采集需求已接收');
  }
  function openTask(t) {
    setTask(t);
    setFlowTab('people');
    navigate('flow');
  }
  function viewTask(t) {
    setTaskDrawer(t);
  }
  function updateTaskState(key, state) {
    if (page === 'detail') {
      setProjectTasks(projectTasks.map(t => t.key === key ? {
        ...t,
        state
      } : t));
    } else {
      setTasks(tasks.map(t => t.key === key ? {
        ...t,
        state
      } : t));
    }
  }
  function editTask(t) {
    setTaskEditing(t);
    taskForm.setFieldsValue({
      name: t.name,
      collector: t.collector,
      target: t.target
    });
    setModal('task');
  }
  function openRecord(r) {
    setRecord(r);
    setRecordTab('clean');
    setConversation(r.conversation || initialConversation.map((text, i) => ({
      text,
      sender: i % 2 === 0 ? 'rep' : 'doctor'
    })));
    setEditing(-1);
  }
  function openDoctorSession(session) {
    setDoctorSession(session);
  }
  function openSettingModal(type, item) {
    setSettingEdit(item ? {
      type,
      key: item.key
    } : null);
    const activeForm = {
      account: accountForm,
      role: roleForm,
      permission: permissionForm
    }[type];
    activeForm.resetFields();
    if (item) activeForm.setFieldsValue(item);else if (type === 'account') activeForm.setFieldsValue({
      status: 'active'
    });else if (type === 'role') activeForm.setFieldsValue({
      permissions: []
    });
    setModal(type);
  }
  function saveAccount(values) {
    const item = {
      key: settingEdit?.key || 'USER-' + Date.now(),
      ...values
    };
    setAccounts(settingEdit ? accounts.map(a => a.key === item.key ? item : a) : [...accounts, item]);
    setModal(null);
    message.success(settingEdit ? '账号已更新' : '账号已添加');
  }
  function saveRole(values) {
    const item = {
      key: settingEdit?.key || 'ROLE-' + Date.now(),
      ...values
    };
    setRoles(settingEdit ? roles.map(r => r.key === item.key ? item : r) : [...roles, item]);
    setModal(null);
    message.success(settingEdit ? '角色已更新' : '角色已添加');
  }
  function savePermission(values) {
    const item = {
      key: settingEdit?.key || 'PERM-' + Date.now(),
      enabled: settingEdit?.enabled ?? true,
      ...values
    };
    setPermissions(settingEdit ? permissions.map(p => p.key === item.key ? item : p) : [...permissions, item]);
    setModal(null);
    message.success(settingEdit ? '权限已更新' : '权限已添加');
  }
  function markSessionValidity(valid) {
    if (!doctorSession) return;
    if (valid) {
      setRecords([...records, {
        key: `D-${Date.now()}`,
        name: doctorSession.doctor,
        turns: doctorSession.turns,
        stage: 'pending_cleaning',
        apiKey: task.apiKey || apis.find(item => item.project === task.project)?.key || 'API-001',
        time: doctorSession.time
      }]);
      setFlowTab('data');
      message.success('已标记为有效，进入待错别字清洗');
    } else message.success('已标记为无效');
    setDoctorSession(null);
    setDoctorDrawer(null);
  }
  const visiblePeople = people.filter(person => !removedHcpKeys.includes(person.key));
  const removedHcpNames = new Set(people.filter(person => removedHcpKeys.includes(person.key)).map(person => person.name));
  const visibleRecords = records.filter(item => !removedHcpNames.has(item.name));
  function removeHcpFromTask(person) {
    const next = [...new Set([...removedHcpKeys, person.key])];
    setRemovedHcpKeys(next);
    localStorage.setItem(removedHcpStorageKey, JSON.stringify(next));
    setDoctorSession(null);
    setDoctorDrawer(null);
    message.success('已移除 HCP，相关任务与数据已隐藏');
  }
  function updateRecordStage(target, stage, successMessage) {
    setRecords(records.map(item => item.key === target.key ? {
      ...item,
      stage,
      conversation
    } : item));
    setRecord(null);
    message.success(successMessage);
  }
  const pagination = {
    pageSize: 5,
    showSizeChanger: false,
    showTotal: n => `共 ${n} 条`,
    locale: {
      items_per_page: '条/页',
      prev_page: '上一页',
      next_page: '下一页'
    }
  };
  function title(text, sub, action, back) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page-heading"
    }, /*#__PURE__*/React.createElement("div", {
      className: "back-heading"
    }, back && /*#__PURE__*/React.createElement(Button, {
      "aria-label": "\u8FD4\u56DE",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow"
      }),
      onClick: back
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, text), sub && /*#__PURE__*/React.createElement("div", {
      className: "subtitle"
    }, sub))), action);
  }
  function ProjectStatus({state}) {
    return /*#__PURE__*/React.createElement(Tag, {color: {active: 'processing', done: 'success', void: 'default'}[state]}, {active: '进行中', done: '已完成', void: '已作废'}[state]);
  }
  function updateProjectState(row, state) {
    setProjects(current => current.map(item => item.key === row.key ? {...item, state} : item));
    setSelected(current => current?.key === row.key ? {...current, state} : current);
    message.success({active: '项目已恢复为进行中', done: '项目已完成采集', void: '项目已作废'}[state]);
  }
  function handleProjectAction(row, key) {
    if (key === 'continue') { updateProjectState(row, 'active'); return; }
    if (key === 'complete') {
      Modal.confirm({title: '确认完成采集？', content: '完成后项目将移至「已完成」，可通过“继续采集”恢复。', okText: '完成采集', cancelText: '取消', onOk: () => updateProjectState(row, 'done')});
      return;
    }
    if (key === 'void') Modal.confirm({title: '确认作废项目？', content: '作废后项目将移至「已作废」，可通过“继续采集”恢复。', okText: '作废项目', okButtonProps: {danger: true}, cancelText: '取消', onOk: () => updateProjectState(row, 'void')});
  }
  function projectMoreItems(row) {
    if (row.state === 'active') return [{key: 'complete', label: '完成采集'}, {key: 'void', label: '作废项目', danger: true}];
    if (row.state === 'done') return [{key: 'continue', label: '继续采集'}, {key: 'void', label: '作废项目', danger: true}];
    return [{key: 'continue', label: '继续采集'}];
  }
  const tabs = [{key: 'active', label: '进行中'}, {key: 'done', label: '已完成'}, {key: 'void', label: '已作废'}];
  const projectColumns = [{
    title: '项目名称', dataIndex: 'name', width: 260,
    render: (v, r) => /*#__PURE__*/React.createElement("div", {className: "project-cell"}, /*#__PURE__*/React.createElement("span", {className: "project-icon"}, /*#__PURE__*/React.createElement(Icon, {name: "data"})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {className: "cell-title", onClick: () => openProject(r)}, v)))
  }, {
    title: '提升 E 人', width: 160, render: (_, r) => /*#__PURE__*/React.createElement(Person, {name: r.owner, sub: r.specialty})
  }, {
    title: '已采集 / 目标', width: 160,
    render: (_, r) => /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {className: "numeric"}, r.current.toLocaleString()), /*#__PURE__*/React.createElement("span", {style: {color: '#98a2b3'}}, " / ", r.target.toLocaleString(), " 条"))
  }, {
    title: '状态', dataIndex: 'state', width: 110,
    ...statusFilter([{text: '进行中', value: 'active'}, {text: '已完成', value: 'done'}, {text: '已作废', value: 'void'}]),
    render: state => /*#__PURE__*/React.createElement(ProjectStatus, {state})
  }, {
    title: '采集进度', width: 160,
    render: (_, r) => /*#__PURE__*/React.createElement("div", {className: "progress-cell"}, /*#__PURE__*/React.createElement(Progress, {percent: Math.min(100, Math.round(r.current / r.target * 100)), size: "small", strokeColor: r.state === 'done' ? '#52c41a' : r.state === 'void' ? '#bfbfbf' : '#1677ff'}))
  }, {
    title: '操作', width: 180, fixed: 'right',
    render: (_, r) => /*#__PURE__*/React.createElement(Space, null,
      /*#__PURE__*/React.createElement(Button, {type: "link", style: {padding: 0}, onClick: () => openProject(r)}, "查看"),
      /*#__PURE__*/React.createElement(Button, {type: "link", style: {padding: 0}, onClick: () => editProject(r)}, "编辑"),
      /*#__PURE__*/React.createElement(Dropdown, {trigger: ['click'], menu: {items: projectMoreItems(r), onClick: ({key}) => handleProjectAction(r, key)}}, /*#__PURE__*/React.createElement(Button, {type: "link", style: {padding: 0}}, "更多"))
    )
  }];
  const apiColumns = [{
    title: 'API 名称',
    dataIndex: 'name',
    width: 220,
    render: value => /*#__PURE__*/React.createElement('span', {
      className: 'cell-title'
    }, value)
  }, {
    title: 'API 密钥',
    dataIndex: 'value',
    width: 220,
    render: (value, row) => /*#__PURE__*/React.createElement('div', {
      className: 'api-secret'
    }, /*#__PURE__*/React.createElement('code', {
      className: 'api-code'
    }, row.status !== 'pending' ? `${value.slice(0, 10)}****${value.slice(-4)}` : value), /*#__PURE__*/React.createElement(Tooltip, {
      title: '复制 API 密钥'
    }, /*#__PURE__*/React.createElement(Button, {
      type: 'text',
      size: 'small',
      className: 'api-copy-button',
      icon: /*#__PURE__*/React.createElement(Icon, {name: 'copy', size: 15}),
      'aria-label': '复制 API 密钥',
      onClick: () => copyApi(value)
    })))
  }, {
    title: '峰值限制',
    dataIndex: 'peak',
    width: 100,
    render: value => `${value.toLocaleString()} 条`
  }, {
    title: '采集用 E 人',
    dataIndex: 'collector',
    width: 160,
    render: (value, row) => /*#__PURE__*/React.createElement(Person, {
      name: value,
      sub: row.collectorRole || '医药代表',
      masked: false
    })
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: value => /*#__PURE__*/React.createElement(Tag, {
      color: value === 'completed' ? 'success' : value === 'collecting' ? 'processing' : value === 'stopped' ? 'default' : 'warning'
    }, value === 'completed' ? '已完成' : value === 'collecting' ? '采集中' : value === 'stopped' ? '已停止' : '待对接')
  }, {
    title: '对接企业',
    dataIndex: 'company',
    width: 220,
    render: value => value || '—'
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 170
  }, {
    title: '操作',
    key: 'action',
    width: 130,
    fixed: 'right',
    render: (_, row) => /*#__PURE__*/React.createElement(Space, {
      size: 4,
      className: 'api-actions'
    }, /*#__PURE__*/React.createElement(Button, {
      type: 'link',
      size: 'small',
      onClick: () => editApi(row)
    }, '编辑'), /*#__PURE__*/React.createElement(Dropdown, {
      trigger: ['click'],
      menu: {
        items: apiMenuItems(row),
        onClick: ({key}) => handleApiMenu(row, key)
      }
    }, /*#__PURE__*/React.createElement(Button, {
      type: 'link',
      size: 'small'
    }, '更多')))
  }];
  const taskColumns = [{
    title: page === 'task' ? '采集接口' : '采集任务',
    dataIndex: 'name',
    width: 240,
    render: (v, r) => /*#__PURE__*/React.createElement("a", {
      onClick: () => page === 'detail' ? viewTask(r) : openTask(r)
    }, v)
  }, {
    title: page === 'task' ? '采集要求' : '提升 E 人',
    width: page === 'task' ? 260 : 150,
    render: (_, r) => page === 'task' ? projects.find(project => project.key === r.project)?.goal || '暂未填写' : /*#__PURE__*/React.createElement(Person, {
      name: "\u674E\u533B\u751F",
      sub: "\u4E3B\u4EFB\u533B\u5E08",
      masked: false
    })
  }, ...(page === 'task' ? [{
    title: '采集要求',
    width: 200,
    render: (_, r) => projects.find(project => project.key === r.project)?.requirements || '暂未填写'
  }] : []), {
    title: '采集用 E 人',
    width: 150,
    render: (_, r) => /*#__PURE__*/React.createElement(Person, {
      name: r.collector || '张三',
      sub: "\u533B\u836F\u4EE3\u8868"
    })
  }, {
    title: '已收到 / 预计数据',
    width: 160,
    render: (_, r) => `${r.current} / ${r.target}`
  }, {
    title: '状态',
    dataIndex: 'state',
    width: 110,
    filters: page === 'detail' ? [{
      text: '待发布',
      value: 'draft'
    }, {
      text: '采集中',
      value: 'active'
    }, {
      text: '已停止',
      value: 'stopped'
    }] : [{
      text: '采集中',
      value: 'active'
    }, {
      text: '已停止',
      value: 'stopped'
    }, {
      text: '已完成',
      value: 'done'
    }, {
      text: '已失效',
      value: 'invalid'
    }],
    onFilter: (value, record) => record.state === value,
    ...statusFilter(page === 'detail' ? [{ text: '待发布', value: 'draft' }, { text: '采集中', value: 'active' }, { text: '已停止', value: 'stopped' }] : [{ text: '采集中', value: 'active' }, { text: '已停止', value: 'stopped' }, { text: '已完成', value: 'done' }, { text: '已失效', value: 'invalid' }]),
    render: s => /*#__PURE__*/React.createElement(Status, {
      state: s
    })
  }, {
    title: '操作',
    width: 220,
    fixed: 'right',
    render: (_, r) => /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      },
      onClick: () => page === 'detail' ? viewTask(r) : openTask(r)
    }, "\u67E5\u770B"), page === 'detail' && (r.state === 'draft' || r.state === 'ready') && /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      },
      onClick: () => editTask(r)
    }, "\u7F16\u8F91"), page === 'detail' && (r.state === 'draft' || r.state === 'ready') && /*#__PURE__*/React.createElement(Popconfirm, {
      title: "\u786E\u8BA4\u53D1\u5E03\u8BE5\u91C7\u96C6\u4EFB\u52A1\uFF1F",
      okText: "\u786E\u8BA4\u53D1\u5E03",
      cancelText: "\u53D6\u6D88",
      onConfirm: () => {
        updateTaskState(r.key, 'active');
        message.success('任务已发布');
      }
    }, /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      }
    }, "\u53D1\u5E03")), page === 'detail' && r.state === 'active' && /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      },
      onClick: () => editTask(r)
    }, "\u7F16\u8F91"), page === 'detail' && r.state === 'active' && /*#__PURE__*/React.createElement(Popconfirm, {
      title: "\u786E\u8BA4\u505C\u6B62\u8BE5\u91C7\u96C6\u4EFB\u52A1\uFF1F",
      okText: "\u786E\u8BA4\u505C\u6B62",
      cancelText: "\u53D6\u6D88",
      onConfirm: () => {
        updateTaskState(r.key, 'stopped');
        message.success('任务已停止');
      }
    }, /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      }
    }, "\u505C\u6B62")), page === 'detail' && r.state === 'stopped' && /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      },
      onClick: () => editTask(r)
    }, "\u7F16\u8F91"), page === 'detail' && r.state === 'stopped' && /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      },
      onClick: () => {
        updateTaskState(r.key, 'active');
        message.success('任务已恢复采集');
      }
    }, "\u7EE7\u7EED\u91C7\u96C6"), false && page === 'task' && r.state === 'active' && /*#__PURE__*/React.createElement(Popconfirm, {
      title: "\u786E\u8BA4\u63D0\u4EA4\u8BE5\u91C7\u96C6\u4EFB\u52A1\uFF1F",
      okText: "\u786E\u8BA4\u63D0\u4EA4",
      cancelText: "\u53D6\u6D88",
      onConfirm: () => {
        setTasks(tasks.map(t => t.key === r.key ? {
          ...t,
          state: 'done'
        } : t));
        message.success('任务已提交');
      }
    }, /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      }
    }, "\u63D0\u4EA4")))
  }];
  const recordColumns = [{
    title: '采集对象',
    dataIndex: 'name',
    width: 130,
    render: v => page === 'flow' ? v : maskName(v)
  }, {
    title: '采集用 E 人',
    width: 180,
    render: () => /*#__PURE__*/React.createElement(Person, {
      name: "\u5F20\u4E09",
      sub: "\u533B\u836F\u4EE3\u8868"
    })
  }, ...(page === 'detail' ? [{
    title: '来源接口',
    width: 210,
    render: (_, record) => apis.find(api => api.key === record.apiKey)?.name || '—'
  }] : []), {
    title: '对话轮次',
    dataIndex: 'turns',
    width: 100
  }, {
    title: '数据状态',
    dataIndex: 'stage',
    width: 150,
    ...statusFilter((page === 'detail' ? conversationStatus.demand : conversationStatus.collector) && Object.entries(page === 'detail' ? conversationStatus.demand : conversationStatus.collector).map(([value, item]) => ({
      text: item[0],
      value
    })), record => record.stage),
    defaultFilteredValue: page === 'flow' && flowTab === 'data' ? ['initial_approved'] : undefined,
    render: (_, record) => {
      const status = getConversationStatus(record, page === 'detail' ? 'demand' : 'collector');
      return status ? /*#__PURE__*/React.createElement(Tag, {
        color: status[1]
      }, status[0]) : null;
    }
  }, {
    title: '时间',
    dataIndex: 'time',
    width: 160
  }, {
    title: '操作',
    width: 130,
    fixed: 'right',
    render: (_, r) => /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
      type: "link",
      style: {
        padding: 0
      },
      onClick: () => openRecord(r)
    }, "\u67E5\u770B"))
  }];
  function getLatestDoctorRecord(name) {
    return records.filter(item => item.name === name && getConversationStatus(item, 'collector')).sort((a, b) => b.time.localeCompare(a.time))[0];
  }
  function recordTable() {
    const reviewRecords = visibleRecords.filter(item => getConversationStatus(item, page === 'detail' ? 'demand' : 'collector'));
    const filteredRecords = page === 'detail' && datasetReviewFilter !== 'all' ? reviewRecords.filter(item => item.stage === datasetReviewFilter) : reviewRecords;
    const reviewOptions = [
      {label: `全部 ${reviewRecords.length}`, value: 'all'},
      {label: `待审核 ${reviewRecords.filter(item => item.stage === 'initial_approved').length}`, value: 'initial_approved'},
      {label: `终审未通过 ${reviewRecords.filter(item => item.stage === 'final_rejected').length}`, value: 'final_rejected'},
      {label: `终审通过 ${reviewRecords.filter(item => item.stage === 'final_approved').length}`, value: 'final_approved'}
    ];
    return /*#__PURE__*/React.createElement("div", {
      className: ['flow', 'detail'].includes(page) ? 'table-wrap task-flow-table record-data-table' : 'table-wrap',
      style: ['flow', 'detail'].includes(page) ? {paddingTop: 20} : undefined
    }, page === 'detail' && /*#__PURE__*/React.createElement("div", {
      className: "dataset-status-toolbar"
    }, /*#__PURE__*/React.createElement(Segmented, {
      value: datasetReviewFilter,
      onChange: setDatasetReviewFilter,
      options: reviewOptions
    })), /*#__PURE__*/React.createElement(Table, {
      key: page === 'detail' ? `record-table-${datasetReviewFilter}` : page === 'flow' ? 'flow-data-table' : 'record-table',
      columns: recordColumns,
      dataSource: filteredRecords,
      pagination: pagination,
      scroll: {x: 1000},
      locale: {emptyText: page === 'flow' ? '暂无医生已提交的数据' : datasetReviewFilter === 'all' ? '暂无待审核数据' : '当前状态暂无数据'}
    }));
  }
  function newProject() {
    if (aiGenerateTimer.current) clearTimeout(aiGenerateTimer.current);
    aiGenerateTimer.current = null;
    setAiGenerating(false);
    setAiGenerated(false);
    setProjectEditing(null);
    form.resetFields();
    navigate('form');
  }
  function editProject(p) {
    if (aiGenerateTimer.current) clearTimeout(aiGenerateTimer.current);
    aiGenerateTimer.current = null;
    setAiGenerating(false);
    setAiGenerated(true);
    setProjectEditing(p);
    form.setFieldsValue({
      name: p.name,
      owner: p.owner,
      collector: p.collector,
      target: p.target,
      goal: p.goal,
      requirements: p.requirements
    });
    navigate('form');
  }
  function editProjectName(p) {
    var nextName = p.name;
    Modal.confirm({
      title: '编辑项目名称',
      content: /*#__PURE__*/React.createElement(Input, {
        defaultValue: p.name,
        maxLength: 60,
        onChange: e => {
          nextName = e.target.value;
        }
      }),
      okText: '保存',
      cancelText: '取消',
      onOk: () => {
        var name = nextName.trim();
        if (!name) return Promise.reject();
        setProjects(projects.map(item => item.key === p.key ? {
          ...item,
          name
        } : item));
        if (selected.key === p.key) setSelected({
          ...selected,
          name
        });
        message.success('项目名称已更新');
      }
    });
  }
  function saveProject(v) {
    const p = {
      key: `P-${String(projects.length + 1).padStart(3, '0')}`,
      name: v.name.trim(),
      owner: v.owner,
      specialty: {
        '李医生': '眼科｜主任医生',
        '小贝': '内科｜主任医生',
        '王医生': '儿科｜主治医生'
      }[v.owner] || projectEditing?.specialty || '—',
      collector: v.collector,
      current: 0,
      target: v.target,
      state: 'active',
      date: dayjs().format('YYYY.MM.DD'),
      goal: v.goal,
      requirements: v.requirements
    };
    if (projectEditing) {
      var updated = {
        ...projectEditing,
        ...p,
        key: projectEditing.key,
        current: projectEditing.current,
        state: projectEditing.state,
        date: projectEditing.date
      };
      setProjects(projects.map(item => item.key === updated.key ? updated : item));
      setSelected(updated);
      setProjectEditing(null);
      navigate('detail');
      message.success('项目已更新');
    } else {
      setProjects([p, ...projects]);
      navigate('project');
      message.success('采集项目已创建，可在项目详情中生成对接 API');
    }
  }
  function makeTask(v) {
    const nextTask = {
      ...(taskEditing || {}),
      key: `T-${String(tasks.length + 1).padStart(3, '0')}`,
      project: selected.key,
      name: v.name,
      collector: v.collector,
      target: v.target,
      current: 0,
      state: 'draft'
    };
    setTasks(taskEditing ? tasks.map(t => t.key === taskEditing.key ? {
      ...t,
      name: v.name,
      collector: v.collector,
      target: v.target
    } : t) : [nextTask, ...tasks]);
    setTaskEditing(null);
    setModal(null);
    setDetailTab('tasks');
    message.success(taskEditing ? '采集接口已更新' : '采集接口已创建');
  }
  useEffect(() => {
    document.title = `${labels[page]} · 语贝工作台`;
  }, [page]);
  useEffect(() => () => {
    if (aiGenerateTimer.current) clearTimeout(aiGenerateTimer.current);
  }, []);
  return /*#__PURE__*/React.createElement(Layout, {
    className: "app-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: `menu-overlay ${mobile ? 'visible' : ''}`,
    onClick: () => setMobile(false)
  }), /*#__PURE__*/React.createElement(Sider, {
    width: 224,
    theme: "dark",
    className: `sidebar ${mobile ? 'mobile-open' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand-mark"
  }, "\u8BED"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "brand-name"
  }, "HCP\u6570\u5B57\u8D44\u4EA7"))), /*#__PURE__*/React.createElement(Menu, {
    theme: "dark",
    selectedKeys: [activeMenu],
    onClick: ({
      key
    }) => navigate(key),
    items: [{
      type: 'group',
      label: '需求端',
      children: [{
        key: 'training',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "ai"
        }),
        label: '训练 E 人'
      }, {
        key: 'knowledge',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "data"
        }),
        label: '知识库'
      }, {
        key: 'project',
        icon: /*#__PURE__*/React.createElement(Icon, null),
        label: '采集项目'
      }]
    }, {
      type: 'group',
      label: '采集管理端',
      children: [{
        key: 'task',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "task"
        }),
        label: '采集接口'
      }, {
        key: 'hcp',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "users"
        }),
        label: 'HCP 管理'
      }, {
        key: 'setting',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "setting"
        }),
        label: '系统设置'
      }, {
        key: 'profile',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "users"
        }),
        label: '用户中心'
      }]
    }, {
      type: 'group',
      label: '采集端',
      children: [{
        key: 'ai',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "ai"
        }),
        label: '元医 AI'
      }]
    }]
  })), /*#__PURE__*/React.createElement(Layout, {
    className: "workspace"
  }, /*#__PURE__*/React.createElement(Header, {
    className: "topbar"
  }, /*#__PURE__*/React.createElement(Space, {
    size: 14
  }, /*#__PURE__*/React.createElement(Button, {
    className: "mobile-menu",
    type: "text",
    "aria-label": "\u6253\u5F00\u5BFC\u822A",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "menu"
    }),
    onClick: () => setMobile(!mobile)
  }), /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      title: '工作台'
    }, {
      title: labels[activeMenu]
    }, ...(['detail', 'form', 'api', 'flow', 'conversation'].includes(page) ? [{
      title: labels[page]
    }] : [])]
  })), /*#__PURE__*/React.createElement("div", {
    className: "topbar-right"
  }, /*#__PURE__*/React.createElement(Avatar, {
    size: 32,
    style: {
      color: '#1677ff',
      background: '#e6f4ff'
    }
  }, "\u5468"), /*#__PURE__*/React.createElement("span", {
    className: "username"
  }, "\u5468\u65B0\u534E"))), /*#__PURE__*/React.createElement(Content, {
    className: `content ${page === 'ai' ? 'content-ai' : ''}`
  }, page === 'training' && /*#__PURE__*/React.createElement(React.Fragment, null, title('训练 E 人', '管理用于训练的 E 人能力与版本。'), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement(Empty, {
    className: "empty-module",
    description: "训练 E 人内容暂未配置"
  }))), page === 'knowledge' && /*#__PURE__*/React.createElement(React.Fragment, null, title('知识库', '管理训练和采集场景所需的知识内容。'), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement(Empty, {
    className: "empty-module",
    description: "知识库内容暂未配置"
  }))), page === 'project' && /*#__PURE__*/React.createElement(React.Fragment, null, title('采集项目', '', /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    }),
    onClick: newProject
  }, "\u65B0\u5EFA\u91C7\u96C6\u9879\u76EE")), /*#__PURE__*/React.createElement("div", {
    className: "stats"
  }, [{
    label: '进行中项目',
    value: 12 + projects.length - 2,
    unit: '个',
    icon: 'grid'
  }, {
    label: '累计已采集数据',
    value: '863',
    unit: '条',
    icon: 'data'
  }, {
    label: '待审核数据',
    value: records.filter(r => r.stage === 'initial_approved').length,
    unit: '条',
    icon: 'clock'
  }, {
    label: '参与 HCP',
    value: 331 + people.length - 2,
    unit: '人',
    icon: 'users'
  }].map(s => /*#__PURE__*/React.createElement(Card, {
    className: "stat-card",
    key: s.label
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-top"
  }, /*#__PURE__*/React.createElement("span", null, s.label), /*#__PURE__*/React.createElement("span", {
    className: "stat-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon
  }))), /*#__PURE__*/React.createElement("div", {
    className: "stat-number"
  }, s.value, /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, s.unit))))), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "\u9879\u76EE\u5217\u8868"), /*#__PURE__*/React.createElement(Tabs, {
    activeKey: filter,
    onChange: setFilter,
    items: tabs
  }), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement(Table, {
    columns: projectColumns,
    dataSource: projects.filter(p => p.state === filter),
    pagination: pagination,
    scroll: {
      x: 980
    },
    locale: {
      emptyText: /*#__PURE__*/React.createElement(Empty, {
        description: "\u6682\u65E0\u7B26\u5408\u6761\u4EF6\u7684\u9879\u76EE",
        image: Empty.PRESENTED_IMAGE_SIMPLE
      })
    }
  })))), page === 'form' && /*#__PURE__*/React.createElement(React.Fragment, null, title(projectEditing ? '编辑采集项目' : '新建采集项目', '', /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => navigate('project')
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    htmlType: "submit",
    form: "project-form",
    disabled: !aiGenerated || aiGenerating
  }, projectEditing ? "\u4FDD\u5B58\u4FEE\u6539" : "\u521B\u5EFA\u9879\u76EE")), () => navigate('project')), /*#__PURE__*/React.createElement(Card, {
    className: "form-card"
  }, /*#__PURE__*/React.createElement(Form, {
    id: "project-form",
    form: form,
    layout: "vertical",
    requiredMark: false,
    initialValues: {
      owner: '李医生',
      collector: '张三'
    },
    onFinish: saveProject
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-section"
  }, "\u57FA\u672C\u4FE1\u606F"), /*#__PURE__*/React.createElement(Form.Item, {
    name: "name",
    label: "\u9879\u76EE\u540D\u79F0",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入项目名称'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u4F8B\u5982\uFF1A\u773C\u79D1\u6570\u636E\u91C7\u96C6\u9879\u76EE",
    maxLength: 60,
    showCount: true
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "owner",
    label: "\u63D0\u5347 E \u4EBA",
    rules: [{
      required: true,
      message: '请选择提升 E 人'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    className: "person-select",
    optionLabelProp: "label",
    placeholder: "请选择提升 E 人",
    options: [{
      value: '李医生',
      label: /*#__PURE__*/React.createElement(PersonOption, {
        name: "\u674E\u533B\u751F",
        sub: "\u4E3B\u4EFB\u533B\u5E08"
      })
    }, {
      value: '小贝',
      label: /*#__PURE__*/React.createElement(PersonOption, {
        name: "\u5C0F\u8D1D",
        sub: "\u5FC3\u8840\u7BA1\u4E13\u7EBF"
      })
    }, {
      value: '王医生',
      label: /*#__PURE__*/React.createElement(PersonOption, {
        name: "\u738B\u533B\u751F",
        sub: "\u4E3B\u6CBB\u533B\u5E08"
      })
    }]
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "goal",
    label: "\u63D0\u5347\u76EE\u6807",
    rules: [{
      required: true,
      whitespace: true,
      message: '请填写提升目标'
    }]
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    rows: 3,
    placeholder: "\u63CF\u8FF0\u672C\u6B21\u6570\u636E\u91C7\u96C6\u5E0C\u671B\u63D0\u5347\u7684\u80FD\u529B",
    maxLength: 500,
    showCount: true
  })), !projectEditing && /*#__PURE__*/React.createElement("div", {
    className: "ai-generate-panel"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {name: "ai"}),
    loading: aiGenerating,
    disabled: aiGenerating,
    onClick: generateProjectPlan
  }, "AI 智能补全"), /*#__PURE__*/React.createElement("div", {
    className: "subtitle"
  }, aiGenerating ? "AI 正在分析项目信息并生成采集方案…" : "基于项目名称、提升 E 人和目标，自动生成采集要求与预估数量。")), aiGenerated && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form-section form-section-secondary"
  }, projectEditing ? "采集方案" : "AI 生成结果"), /*#__PURE__*/React.createElement(Form.Item, {
    name: "requirements",
    label: "\u91C7\u96C6\u8981\u6C42",
    rules: [{required: true, whitespace: true, message: '请生成或填写采集要求'}]
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    rows: 4,
    placeholder: projectEditing ? "\u586B\u5199\u91C7\u96C6\u5BF9\u8C61\u8D44\u8D28\u3001\u5BF9\u8BDD\u8303\u56F4\u7B49\u8981\u6C42" : "\u70B9\u51FB AI \u667A\u80FD\u8865\u5168\uFF0C\u6216\u624B\u52A8\u586B\u5199\u91C7\u96C6\u8981\u6C42",
    maxLength: 500,
    showCount: true
  })), /*#__PURE__*/React.createElement(Form.Item, {
    name: "target",
    label: "\u9884\u4F30\u91C7\u96C6\u6570\u91CF",
    rules: [{
      required: true,
      message: '请输入预计数据量'
    }]
  }, /*#__PURE__*/React.createElement(InputNumber, {
    min: 1,
    max: 10000000,
    precision: 0,
    addonAfter: "\u6761",
    style: {
      width: 220
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-section form-section-secondary"
  }, "选择采集执行人"), /*#__PURE__*/React.createElement(Form.Item, {
    name: "collector",
    label: "\u91C7\u96C6\u7528 E \u4EBA",
    rules: [{required: true, message: '请选择采集用 E 人'}]
  }, /*#__PURE__*/React.createElement(Select, {
    className: "person-select",
    optionLabelProp: "label",
    options: [{
      value: '张三',
      label: /*#__PURE__*/React.createElement(PersonOption, {name: "\u5F20\u4E09", sub: "\u533B\u836F\u4EE3\u8868"})
    }, {
      value: '小贝',
      label: /*#__PURE__*/React.createElement(PersonOption, {name: "\u5C0F\u8D1D", sub: "\u6570\u636E\u4E13\u5458"})
    }]
  })))))), page === 'detail' && /*#__PURE__*/React.createElement(React.Fragment, null, title(selected.name, '', /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {name: "plus"}),
    onClick: openApiCreator
  }, "新增 API 接口"), () => navigate('project')), /*#__PURE__*/React.createElement("div", {
    className: "detail-stats"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 16
    }
  }, "\u63D0\u5347 E \u4EBA"), /*#__PURE__*/React.createElement(Person, {
    name: selected.owner,
    sub: selected.specialty
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u91C7\u96C6\u8FDB\u5EA6"), /*#__PURE__*/React.createElement("div", {
    className: "stat-number",
    style: {
      margin: '8px 0'
    }
  }, selected.current, /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, "/ ", selected.target, " \u6761")), /*#__PURE__*/React.createElement(Progress, {
    percent: Math.min(100, Math.round(selected.current / selected.target * 100)),
    size: "small"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "HCP \u6570"), /*#__PURE__*/React.createElement("div", {
    className: "stat-number",
    style: {
      marginTop: 12
    }
  }, 98, /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, "\u4EBA"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u5F85\u5BA1\u6838\u6570\u636E"), /*#__PURE__*/React.createElement("div", {
    className: "stat-number",
    style: {
      marginTop: 12
    }
  }, records.filter(r => r.stage === 'initial_approved').length, /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, "\u6761"))), /*#__PURE__*/React.createElement(Card, {
    className: "api-stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "api-stat-heading"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "API 接口数")), /*#__PURE__*/React.createElement("div", {
    className: "stat-number",
    style: {marginTop: 12}
  }, apis.filter(item => item.project === selected.key).length, /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, "个")))), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement(Tabs, {
    activeKey: detailTab,
    onChange: setDetailTab,
    items: [{
      key: 'apis',
      label: 'API 接口'
    }, {
      key: 'data',
      label: '数据集'
    }, {
      key: 'analysis',
      label: '数据分析'
    }, {
      key: 'info',
      label: '项目详情'
    }]
  }), detailTab === 'data' && recordTable(), detailTab === 'apis' && /*#__PURE__*/React.createElement("div", {
    className: "table-wrap",
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(Table, {
    columns: apiColumns,
    dataSource: apis.filter(t => t.project === selected.key),
    pagination: pagination,
    scroll: {
      x: 1320
    }
  })), detailTab === 'analysis' && /*#__PURE__*/React.createElement("div", {
    className: "analysis-grid"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "\u7EC8\u5BA1\u901A\u8FC7\u7387"
  }, /*#__PURE__*/React.createElement(Progress, {
    type: "circle",
    percent: Math.round(records.filter(r => r.stage === 'final_approved').length / records.filter(r => getConversationStatus(r, 'demand')).length * 100)
  })), /*#__PURE__*/React.createElement(Card, {
    title: "\u5BF9\u8BDD\u8F6E\u6B21"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-number"
  }, records.reduce((a, b) => a + b.turns, 0), /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, "\u8F6E")), /*#__PURE__*/React.createElement("p", {
    className: "subtitle"
  }, "\u5E73\u5747 ", Math.round(records.reduce((a, b) => a + b.turns, 0) / records.length), " \u8F6E / \u6761"))), detailTab === 'info' && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-info-toolbar"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => editProject(selected)
  }, "\u7F16\u8F91\u9879\u76EE")), /*#__PURE__*/React.createElement(Descriptions, {
    column: 1,
    bordered: true,
    items: [{
      key: '1',
      label: '项目名称',
      children: selected.name
    }, {
      key: '2',
      label: '提升 E 人',
      children: /*#__PURE__*/React.createElement(Person, {
        name: selected.owner,
        sub: selected.specialty || '医疗专业顾问',
        masked: false
      })
    }, {
      key: '3',
      label: '采集用 E 人',
      children: /*#__PURE__*/React.createElement(Person, {
        name: selected.collector,
        sub: '医药代表',
        masked: false
      })
    }, {
      key: '4',
      label: '预计数据量',
      children: `${selected.target} 条`
    }, {
      key: '5',
      label: '提升目标',
      children: selected.goal || '暂未填写'
    }, {
      key: '6',
      label: '采集要求',
      children: selected.requirements || '暂未填写'
    }, {
      key: '7',
      label: '发布执行端',
      children: '核盛网络采集端'
    }, {
      key: '8',
      label: '创建时间',
      children: selected.date || '暂未填写'
    }]
  })))), page === 'api' && /*#__PURE__*/React.createElement(React.Fragment, null, title('API 管理', '', /*#__PURE__*/React.createElement(Button, {
    type: 'primary',
    icon: /*#__PURE__*/React.createElement(Icon, {name: 'plus'}),
    onClick: openApiCreator
  }, '生成 API'), () => navigate('detail')), /*#__PURE__*/React.createElement(Card, {
    className: 'table-card'
  }, /*#__PURE__*/React.createElement('div', {className: 'section-title'}, 'API 列表'), /*#__PURE__*/React.createElement('div', {className: 'table-wrap api-table-wrap'}, /*#__PURE__*/React.createElement(Table, {
    dataSource: apis.filter(item => item.project === selected.key),
    pagination: pagination,
    scroll: {x: 1320},
    columns: apiColumns
  })))), page === 'task' && /*#__PURE__*/React.createElement(React.Fragment, null, title('采集接口', '', /*#__PURE__*/React.createElement(Button, {
    type: 'primary',
    icon: /*#__PURE__*/React.createElement(Icon, {name: 'link'}),
    onClick: () => {
      integrationForm.resetFields();
      integrationForm.setFieldsValue({
        api: apis.find(item => item.status === 'pending')?.value || ''
      });
      setModal('integration');
    }
  }, '接入采集接口')), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement(Tabs, {
    activeKey: filter,
    onChange: setFilter,
    items: [{
      key: 'all',
      label: '全部接口'
    }, {
      key: 'active',
      label: '采集中'
    }, {
      key: 'stopped',
      label: '已停止'
    }, {
      key: 'done',
      label: '已完成'
    }, {
      key: 'invalid',
      label: '已失效'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement(Input, {
    prefix: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    }),
    allowClear: true,
    placeholder: "\u641C\u7D22\u63A5\u53E3\u540D\u79F0",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement(Table, {
    columns: taskColumns,
    dataSource: tasks.filter(t => t.state !== 'draft' && (filter === 'all' || t.state === filter) && t.name.includes(search)),
    pagination: pagination,
    scroll: {
      x: 1000
    }
  })))), page === 'flow' && /*#__PURE__*/React.createElement(React.Fragment, null, title(task.name, '', /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "link"
    }),
    onClick: () => setModal('share')
  }, "\u5206\u4EAB\u91C7\u96C6\u63A5\u53E3"), /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    }),
    onClick: () => {
      inviteForm.resetFields();
      setInviteMode('existing');
      setModal('invite');
    }
  }, "\u9080\u8BF7\u91C7\u96C6\u5BF9\u8C61")), () => navigate('task')), /*#__PURE__*/React.createElement("div", {
    className: "detail-stats task-detail-stats"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u91C7\u96C6\u76EE\u6807"), /*#__PURE__*/React.createElement("div", {
    className: "subtitle",
    style: {
      marginTop: 12,
      lineHeight: 1.7
    }
  }, projects.find(p => p.key === task.project)?.goal || '\u6682\u672A\u8BBE\u7F6E\u91C7\u96C6\u76EE\u6807')), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "HCP \u6570"), /*#__PURE__*/React.createElement("div", {
    className: "stat-number",
    style: {
      marginTop: 12
    }
  }, visiblePeople.length, /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, "\u4EBA"))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u91C7\u96C6\u8FDB\u5EA6"), /*#__PURE__*/React.createElement("div", {
    className: "task-ring-metric"
  }, /*#__PURE__*/React.createElement(Progress, {
    type: "circle",
    percent: Math.min(100, Math.round(task.current / task.target * 100)),
    size: 64,
    strokeWidth: 11
  }), /*#__PURE__*/React.createElement("div", {
    className: "task-metric-value"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-number"
  }, task.current, /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, "/ ", task.target, " \u6761"))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\u9519\u522B\u5B57\u6E05\u6D17\u7387"), /*#__PURE__*/React.createElement("div", {
    className: "task-ring-metric"
  }, /*#__PURE__*/React.createElement(Progress, {
    type: "circle",
    percent: visibleRecords.length ? Math.round(visibleRecords.filter(r => r.stage !== 'pending_cleaning').length / visibleRecords.length * 100) : 0,
    size: 64,
    strokeWidth: 11,
    strokeColor: "#52c41a"
  }), /*#__PURE__*/React.createElement("div", {
    className: "task-metric-value"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-number"
  }, visibleRecords.filter(r => r.stage !== 'pending_cleaning').length, /*#__PURE__*/React.createElement("span", {
    className: "stat-unit"
  }, "/ ", visibleRecords.length, " \u6761")))))), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement(Tabs, {
    activeKey: flowTab,
    onChange: setFlowTab,
    items: [{
      key: 'people',
      label: '采集对象'
    }, {
      key: 'data',
      label: '数据集'
    }, {
      key: 'info',
      label: '接口详情'
    }]
  }), flowTab === 'people' ? /*#__PURE__*/React.createElement("div", {
    className: "table-wrap task-flow-table",
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(Table, {
    dataSource: visiblePeople,
    pagination: {
      ...pagination,
      pageSize: 10
    },
    scroll: {
      x: 800
    },
    columns: [{
      title: '姓名',
      dataIndex: 'name'
    }, {
      title: '手机号',
      dataIndex: 'phone'
    }, {
      title: '已对话次数',
      dataIndex: 'turns'
    }, {
      title: '已提交',
      dataIndex: 'submitted'
    }, {
      title: '初审通过',
      dataIndex: 'initialApproved',
      width: 120
    }, {
      title: '终审通过',
      dataIndex: 'finalApproved',
      width: 120
    }, {
      title: '操作',
      width: 260,
      fixed: 'right',
      render: (_, p) => /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        onClick: () => setDoctorDrawer(p)
      }, "\u67E5\u770B\u6570\u636E"), p.state === 'active' && /*#__PURE__*/React.createElement(Popconfirm, {
        title: "\u786E\u8BA4\u5B8C\u6210\u8BE5\u91C7\u96C6\u5BF9\u8C61\u7684\u6570\u636E\u91C7\u96C6\uFF1F",
        onConfirm: () => {
          setPeople(people.map(x => x.key === p.key ? {
            ...x,
            state: 'done'
          } : x));
          message.success('采集已完成');
        },
        okText: "\u5B8C\u6210\u91C7\u96C6",
        cancelText: "\u53D6\u6D88"
      }, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        style: {
          padding: 0
        }
      }, "\u5B8C\u6210\u91C7\u96C6")), /*#__PURE__*/React.createElement(Popconfirm, {
        title: "\u786E\u8BA4\u79FB\u9664\u8BE5 HCP\uFF1F",
        onConfirm: () => removeHcpFromTask(p),
        okText: "\u786E\u5B9A",
        cancelText: "\u53D6\u6D88"
      }, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        danger: true,
        style: {
          padding: 0
        }
      }, "\u79FB\u9664")))
    }]
  })) : flowTab === 'data' ? recordTable() : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(Descriptions, {
    bordered: true,
    column: 1,
    labelStyle: {
      width: 120
    },
    items: [{
      key: 'project',
      label: '所属项目',
      children: projects.find(p => p.key === task.project)?.name || '—'
    }, {
      key: 'status',
      label: '接口状态',
      children: /*#__PURE__*/React.createElement(Status, {
        state: task.state
      })
    }, {
      key: 'owner',
      label: '提升 E 人',
      children: /*#__PURE__*/React.createElement(Person, {
        name: "\u674E\u533B\u751F",
        sub: "\u4E3B\u4EFB\u533B\u5E08",
        masked: false
      })
    }, {
      key: 'collector',
      label: '采集用 E 人',
      children: /*#__PURE__*/React.createElement(Person, {
        name: task.collector || '张三',
        sub: "\u533B\u836F\u4EE3\u8868"
      })
    }, {
      key: 'target',
      label: '预计数据量',
      children: `${task.target} 条`
    }, {
      key: 'current',
      label: '已接收数据',
      children: `${task.current} 条`
    }]
  })))), page === 'conversation' && /*#__PURE__*/React.createElement(React.Fragment, null, title(`${doctorSession?.doctor || '医生'}的对话记录`, '', null, () => navigate('flow')), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(Descriptions, {
    size: "small",
    column: 3,
    items: [{
      key: 'task',
      label: '采集接口',
      children: task.name
    }, {
      key: 'time',
      label: '对话时间',
      children: doctorSession?.time || '—'
    }, {
      key: 'turns',
      label: '对话轮次',
      children: `${doctorSession?.turns || 0} 轮`
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "conversation"
  }, initialConversation.map((text, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `message-row ${i % 2 === 0 ? 'right' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-label"
  }, i % 2 === 0 ? '张三 · 医药代表' : `${doctorSession?.doctor || '医生'} · 医生`), /*#__PURE__*/React.createElement("div", {
    className: "bubble"
  }, text))))))), page === 'hcp' && /*#__PURE__*/React.createElement(React.Fragment, null, title('HCP 管理', '', /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    }),
    onClick: () => {
      hcpForm.resetFields();
      setModal('hcp');
    }
  }, "\u6DFB\u52A0 HCP")), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title"
  }, "HCP \u5217\u8868"), /*#__PURE__*/React.createElement("div", {
    className: "table-wrap",
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(Table, {
    dataSource: hcps,
    pagination: pagination,
    scroll: {
      x: 850
    },
    columns: [{
      title: 'HCP 姓名',
      dataIndex: 'name',
      width: 220,
      render: v => v
    }, {
      title: '手机号',
      dataIndex: 'phone',
      width: 200
    }, {
      title: '职业 / 职称',
      dataIndex: 'title',
      width: 240
    }, {
      title: '管理状态',
      width: 160,
      render: () => /*#__PURE__*/React.createElement(Tag, {
        color: "blue"
      }, "\u5DF2\u5165\u5E93")
    }, {
      title: '录入时间',
      width: 180,
      render: () => '2026.09.17'
    }, {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, p) => /*#__PURE__*/React.createElement(Popconfirm, {
        title: "\u786E\u8BA4\u79FB\u9664\u8BE5 HCP\uFF1F",
        okText: "\u786E\u8BA4\u79FB\u9664",
        cancelText: "\u53D6\u6D88",
        onConfirm: () => {
          setHcps(hcps.filter(h => h.key !== p.key));
          message.success('HCP 已移除');
        }
      }, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        danger: true,
        style: {
          padding: 0
        }
      }, "\u79FB\u9664"))
    }]
  })))), page === 'setting' && /*#__PURE__*/React.createElement(React.Fragment, null, title('系统设置', '', /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    }),
    onClick: () => openSettingModal(settingsTab)
  }, "\u6DFB\u52A0", settingsTab === 'account' ? '账号' : '角色')), /*#__PURE__*/React.createElement(Card, {
    className: "table-card"
  }, /*#__PURE__*/React.createElement(Tabs, {
    activeKey: settingsTab,
    onChange: setSettingsTab,
    items: [{
      key: 'account',
      label: '账号管理'
    }, {
      key: 'role',
      label: '角色管理'
    }]
  }), settingsTab === 'account' && /*#__PURE__*/React.createElement("div", {
    className: "table-wrap",
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(Table, {
    dataSource: accounts,
    pagination: pagination,
    scroll: {
      x: 850
    },
    columns: [{
      title: '账号姓名',
      dataIndex: 'name',
      width: 180
    }, {
      title: '手机号',
      dataIndex: 'phone',
      width: 180
    }, {
      title: '所属角色',
      dataIndex: 'role',
      width: 180
    }, {
      title: '账号状态',
      dataIndex: 'status',
      width: 140,
      filters: [{
        text: '启用',
        value: 'active'
      }, {
        text: '停用',
        value: 'disabled'
      }],
      onFilter: (value, record) => record.status === value,
      ...statusFilter([{ text: '启用', value: 'active' }, { text: '停用', value: 'disabled' }], record => record.status),
      render: s => /*#__PURE__*/React.createElement(Tag, {
        color: s === 'active' ? 'success' : 'default'
      }, s === 'active' ? '启用' : '停用')
    }, {
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (_, r) => /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        style: {
          padding: 0
        },
        onClick: () => openSettingModal('account', r)
      }, "\u7F16\u8F91"), /*#__PURE__*/React.createElement(Popconfirm, {
        title: "\u786E\u8BA4\u79FB\u9664\u8BE5\u8D26\u53F7\uFF1F",
        okText: "\u786E\u8BA4\u79FB\u9664",
        cancelText: "\u53D6\u6D88",
        onConfirm: () => {
          setAccounts(accounts.filter(a => a.key !== r.key));
          message.success('账号已移除');
        }
      }, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        danger: true,
        style: {
          padding: 0
        }
      }, "\u79FB\u9664")))
    }]
  })), settingsTab === 'role' && /*#__PURE__*/React.createElement("div", {
    className: "table-wrap",
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(Table, {
    dataSource: roles,
    pagination: pagination,
    scroll: {
      x: 850
    },
    columns: [{
      title: '角色名称',
      dataIndex: 'name',
      width: 200
    }, {
      title: '角色说明',
      dataIndex: 'description',
      width: 360
    }, {
      title: '已配置权限',
      dataIndex: 'permissions',
      width: 180,
      render: p => (p?.length || 0) + ' 项'
    }, {
      title: '关联账号',
      width: 140,
      render: (_, r) => accounts.filter(a => a.role === r.name).length + ' 个'
    }, {
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (_, r) => /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        style: {
          padding: 0
        },
        onClick: () => openSettingModal('role', r)
      }, "\u7F16\u8F91"), /*#__PURE__*/React.createElement(Popconfirm, {
        title: "\u786E\u8BA4\u79FB\u9664\u8BE5\u89D2\u8272\uFF1F",
        okText: "\u786E\u8BA4\u79FB\u9664",
        cancelText: "\u53D6\u6D88",
        onConfirm: () => {
          setRoles(roles.filter(x => x.key !== r.key));
          message.success('角色已移除');
        }
      }, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        danger: true,
        style: {
          padding: 0
        }
      }, "\u79FB\u9664")))
    }]
  })), false && settingsTab === 'permission' && /*#__PURE__*/React.createElement("div", {
    className: "table-wrap",
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(Table, {
    dataSource: permissions,
    pagination: pagination,
    scroll: {
      x: 850
    },
    columns: [{
      title: '所属模块',
      dataIndex: 'module',
      width: 180
    }, {
      title: '权限名称',
      dataIndex: 'name',
      width: 220
    }, {
      title: '权限标识',
      dataIndex: 'code',
      width: 240
    }, {
      title: '状态',
      dataIndex: 'enabled',
      width: 140,
      filters: [{
        text: '启用',
        value: 'true'
      }, {
        text: '停用',
        value: 'false'
      }],
      onFilter: (value, record) => String(record.enabled) === value,
      ...statusFilter([{ text: '启用', value: 'true' }, { text: '停用', value: 'false' }], record => String(record.enabled)),
      render: e => /*#__PURE__*/React.createElement(Tag, {
        color: e ? 'success' : 'default'
      }, e ? '启用' : '停用')
    }, {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, r) => /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
        type: "link",
        style: {
          padding: 0
        },
        onClick: () => openSettingModal('permission', r)
      }, "\u7F16\u8F91"), /*#__PURE__*/React.createElement(Button, {
        type: "link",
        style: {
          padding: 0
        },
        onClick: () => {
          setPermissions(permissions.map(p => p.key === r.key ? {
            ...p,
            enabled: !p.enabled
          } : p));
          message.success(r.enabled ? '权限已停用' : '权限已启用');
        }
      }, r.enabled ? '停用' : '启用'))
    }]
  })))), page === 'profile' && /*#__PURE__*/React.createElement(React.Fragment, null, title('用户中心', '管理个人账号、所属企业与登录安全。'), /*#__PURE__*/React.createElement(Card, {
    className: 'profile-card'
  }, /*#__PURE__*/React.createElement('div', {className: 'profile-summary'}, /*#__PURE__*/React.createElement(Avatar, {size: 64, style: {color: '#1677ff', background: '#e6f4ff', fontSize: 24}}, '周'), /*#__PURE__*/React.createElement('div', null, /*#__PURE__*/React.createElement('div', {className: 'profile-name'}, '周新华'), /*#__PURE__*/React.createElement('div', {className: 'subtitle'}, '管理员 · 上海元采数据服务有限公司')))), /*#__PURE__*/React.createElement(Card, {
    className: 'table-card profile-details'
  }, /*#__PURE__*/React.createElement(Tabs, {
    activeKey: profileTab,
    onChange: setProfileTab,
    items: [{key: 'personal', label: '个人账号信息'}, {key: 'enterprise', label: '企业信息'}, {key: 'login', label: '登录方式'}]
  }), /*#__PURE__*/React.createElement('div', {className: 'profile-panel'}, profileTab === 'personal' ? /*#__PURE__*/React.createElement(Descriptions, {bordered: true, column: 1, items: [{key: 'name', label: '姓名', children: '周新华'}, {key: 'phone', label: '手机号', children: '138****8888'}, {key: 'role', label: '账号角色', children: '管理员'}, {key: 'status', label: '账号状态', children: /*#__PURE__*/React.createElement(Tag, {color: 'success'}, '已启用')} ]}) : profileTab === 'enterprise' ? /*#__PURE__*/React.createElement(Descriptions, {bordered: true, column: 1, items: [{key: 'company', label: '企业名称', children: '上海元采数据服务有限公司'}, {key: 'code', label: '统一社会信用代码', children: '9131**********6X'}, {key: 'type', label: '企业类型', children: '数据采集服务商'}, {key: 'verify', label: '认证状态', children: /*#__PURE__*/React.createElement(Tag, {color: 'success'}, '已认证')} ]}) : /*#__PURE__*/React.createElement(Descriptions, {bordered: true, column: 1, items: [{key: 'mobile', label: '手机号登录', children: /*#__PURE__*/React.createElement(Space, null, '138****8888', /*#__PURE__*/React.createElement(Tag, {color: 'blue'}, '已绑定'))}, {key: 'password', label: '密码', children: /*#__PURE__*/React.createElement(Button, {type: 'link', style: {padding: 0}}, '修改密码')}, {key: 'last', label: '最近登录', children: '2026.09.23 09:42 · 上海'} ]})))), page === 'ai' && /*#__PURE__*/React.createElement(React.Fragment, null, title('元医 AI', '采集端预览 · 模拟移动端对话体验'), /*#__PURE__*/React.createElement(MiniappPreview, null)))), /*#__PURE__*/React.createElement(Modal, {
    title: apiEditing ? '编辑 API' : '生成 API',
    open: modal === 'api',
    onCancel: () => {
      setModal(null);
      setApiEditing(null);
    },
    onOk: () => apiForm.submit(),
    okText: apiEditing ? '保存' : '生成 API',
    cancelText: '取消',
    destroyOnHidden: true
  }, /*#__PURE__*/React.createElement(Form, {
    form: apiForm,
    layout: 'vertical',
    onFinish: saveApi
  }, /*#__PURE__*/React.createElement(Form.Item, {label: 'API 名称', name: 'name', rules: [{required: true, whitespace: true, message: '请输入 API 名称'}]}, /*#__PURE__*/React.createElement(Input, {placeholder: '例如：华北区域采集 API', maxLength: 50})), /*#__PURE__*/React.createElement(Form.Item, {label: '数据峰值', name: 'peak', extra: '该采集公司最多可提交的有效数据条数。', rules: [{required: true, message: '请设置数据峰值'}]}, /*#__PURE__*/React.createElement(InputNumber, {min: 1, max: 10000000, precision: 0, addonAfter: '条', style: {width: '100%'}})), /*#__PURE__*/React.createElement(Form.Item, {label: '采集用 E 人', name: 'collector', rules: [{required: true, message: '请选择采集用 E 人'}]}, /*#__PURE__*/React.createElement(Select, {options: [{value: '张三', label: '张三 · 医药代表'}, {value: '小贝', label: '小贝 · 数据专员'}, {value: '李四', label: '李四 · 医药代表'}, {value: '王五', label: '王五 · 数据专员'}]})), /*#__PURE__*/React.createElement(Form.Item, {label: '备注信息', name: 'note'}, /*#__PURE__*/React.createElement(Input.TextArea, {rows: 3, placeholder: '填写对接公司、区域或结算说明', maxLength: 200, showCount: true})))), /*#__PURE__*/React.createElement(Modal, {
    title: '接入采集接口',
    open: modal === 'integration',
    onCancel: () => setModal(null),
    onOk: () => integrationForm.submit(),
    okText: '确认对接',
    cancelText: '取消',
    destroyOnHidden: true
  }, /*#__PURE__*/React.createElement(Alert, {type: 'info', showIcon: true, message: '当前为演示流程，使用需求端提供的接口编号接收采集需求。', style: {marginBottom: 20}}), /*#__PURE__*/React.createElement(Form, {form: integrationForm, layout: 'vertical', onFinish: connectApi}, /*#__PURE__*/React.createElement(Form.Item, {label: '接口编号', name: 'api', rules: [{required: true, whitespace: true, message: '请输入接口编号'}]}, /*#__PURE__*/React.createElement(Input, {placeholder: '请输入演示接口编号'})))), /*#__PURE__*/React.createElement(Modal, {
    title: "\u9080\u8BF7\u91C7\u96C6\u5BF9\u8C61",
    open: modal === 'invite',
    onCancel: () => setModal(null),
    onOk: () => inviteForm.submit(),
    okText: "\u786E\u8BA4\u9080\u8BF7",
    cancelText: "\u53D6\u6D88",
    destroyOnHidden: true
  }, /*#__PURE__*/React.createElement(Tabs, {
    activeKey: inviteMode,
    onChange: key => {
      setInviteMode(key);
      inviteForm.resetFields();
    },
    items: [{
      key: 'existing',
      label: '从 HCP 列表选择'
    }, {
      key: 'manual',
      label: '手动添加'
    }]
  }), /*#__PURE__*/React.createElement(Form, {
    form: inviteForm,
    layout: "vertical",
    onFinish: v => {
      const selectedHcp = inviteMode === 'existing' ? hcps.find(h => h.key === v.hcpKey) : null;
      const name = selectedHcp?.name || v.name;
      const phone = selectedHcp?.rawPhone || v.phone;
      const maskedPhone = selectedHcp?.phone || phone.slice(0, 3) + '*****' + phone.slice(-3);
      if (people.some(p => p.rawPhone === phone || p.phone === maskedPhone)) {
        message.warning('该 HCP 已在采集对象中');
        return;
      }
      const newHcp = {
        key: 'H-' + Date.now(),
        name,
        rawPhone: phone,
        phone: maskedPhone,
        turns: 0,
        submitted: 0,
        initialApproved: 0,
        finalApproved: 0,
        state: 'active'
      };
      setPeople([...people, newHcp]);
      if (!selectedHcp) setHcps([...hcps, {
        ...newHcp,
        title: v.title || '医生'
      }]);
      setModal(null);
      message.success('已邀请采集对象');
    }
  }, inviteMode === 'existing' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u9009\u62E9 HCP",
    name: "hcpKey",
    rules: [{
      required: true,
      message: '请选择 HCP'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    showSearch: true,
    optionFilterProp: "label",
    placeholder: "\u641C\u7D22\u6216\u9009\u62E9 HCP",
    options: hcps.map(h => ({
      value: h.key,
      label: `${h.name} · ${h.title || '医生'}`
    }))
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u533B\u751F\u59D3\u540D",
    name: "name",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入医生姓名'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u533B\u751F\u59D3\u540D"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u624B\u673A\u53F7",
    name: "phone",
    rules: [{
      required: true,
      message: '请输入手机号'
    }, {
      pattern: /^1\d{10}$/,
      message: '请输入 11 位有效手机号'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7",
    maxLength: 11
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u804C\u79F0",
    name: "title"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u4F8B\u5982\uFF1A\u4E3B\u4EFB\u533B\u5E08"
  }))), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u5BA2\u6237\u7AEF"
  }, /*#__PURE__*/React.createElement(Tag, null, "\u5143\u533B AI")))), /*#__PURE__*/React.createElement(Modal, {
    title: "\u6DFB\u52A0 HCP",
    open: modal === 'hcp',
    onCancel: () => setModal(null),
    onOk: () => hcpForm.submit(),
    okText: "\u6DFB\u52A0",
    cancelText: "\u53D6\u6D88",
    destroyOnHidden: true
  }, /*#__PURE__*/React.createElement(Form, {
    form: hcpForm,
    layout: "vertical",
    onFinish: v => {
      if (hcps.some(h => h.rawPhone === v.phone || h.phone === v.phone.slice(0, 3) + '*****' + v.phone.slice(-3))) {
        message.warning('该手机号已存在');
        return;
      }
      setHcps([...hcps, {
        key: 'HCP-' + Date.now(),
        name: v.name,
        rawPhone: v.phone,
        phone: v.phone.slice(0, 3) + '*****' + v.phone.slice(-3),
        title: v.title
      }]);
      setModal(null);
      message.success('HCP 已添加');
    }
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u533B\u751F\u59D3\u540D",
    name: "name",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入医生姓名'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u533B\u751F\u59D3\u540D"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u624B\u673A\u53F7",
    name: "phone",
    rules: [{
      required: true,
      message: '请输入手机号'
    }, {
      pattern: /^1\d{10}$/,
      message: '请输入 11 位有效手机号'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7",
    maxLength: 11
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u804C\u79F0",
    name: "title",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入职称'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u4F8B\u5982\uFF1A\u4E3B\u4EFB\u533B\u5E08"
  })))), /*#__PURE__*/React.createElement(Modal, {
    title: settingEdit?.type === 'account' ? '编辑账号' : '添加账号',
    open: modal === 'account',
    onCancel: () => setModal(null),
    onOk: () => accountForm.submit(),
    okText: "\u4FDD\u5B58",
    cancelText: "\u53D6\u6D88",
    destroyOnHidden: true
  }, /*#__PURE__*/React.createElement(Form, {
    form: accountForm,
    layout: "vertical",
    onFinish: saveAccount
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u8D26\u53F7\u59D3\u540D",
    name: "name",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入账号姓名'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u8D26\u53F7\u59D3\u540D"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u624B\u673A\u53F7",
    name: "phone",
    rules: [{
      required: true,
      message: '请输入手机号'
    }, {
      pattern: /^1\d{10}$/,
      message: '请输入 11 位有效手机号'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7",
    maxLength: 11
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u6240\u5C5E\u89D2\u8272",
    name: "role",
    rules: [{
      required: true,
      message: '请选择所属角色'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    placeholder: "\u8BF7\u9009\u62E9\u89D2\u8272",
    options: roles.map(r => ({
      value: r.name,
      label: r.name
    }))
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u8D26\u53F7\u72B6\u6001",
    name: "status",
    rules: [{
      required: true,
      message: '请选择账号状态'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    options: [{
      value: 'active',
      label: '启用'
    }, {
      value: 'inactive',
      label: '停用'
    }]
  })))), /*#__PURE__*/React.createElement(Modal, {
    title: settingEdit?.type === 'role' ? '编辑角色' : '添加角色',
    open: modal === 'role',
    onCancel: () => setModal(null),
    onOk: () => roleForm.submit(),
    okText: "\u4FDD\u5B58",
    cancelText: "\u53D6\u6D88",
    destroyOnHidden: true
  }, /*#__PURE__*/React.createElement(Form, {
    form: roleForm,
    layout: "vertical",
    onFinish: saveRole
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u89D2\u8272\u540D\u79F0",
    name: "name",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入角色名称'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u8BF7\u8F93\u5165\u89D2\u8272\u540D\u79F0"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u89D2\u8272\u8BF4\u660E",
    name: "description",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入角色说明'
    }]
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    placeholder: "\u8BF4\u660E\u89D2\u8272\u804C\u8D23",
    autoSize: {
      minRows: 3,
      maxRows: 5
    }
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u914D\u7F6E\u6743\u9650",
    name: "permissions",
    rules: [{
      required: true,
      message: '请选择至少一项权限'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    mode: "multiple",
    placeholder: "\u9009\u62E9\u6743\u9650",
    options: permissions.filter(p => p.enabled).map(p => ({
      value: p.key,
      label: p.module + ' · ' + p.name
    }))
  })))), /*#__PURE__*/React.createElement(Modal, {
    title: settingEdit?.type === 'permission' ? '编辑权限' : '添加权限',
    open: modal === 'permission',
    onCancel: () => setModal(null),
    onOk: () => permissionForm.submit(),
    okText: "\u4FDD\u5B58",
    cancelText: "\u53D6\u6D88",
    destroyOnHidden: true
  }, /*#__PURE__*/React.createElement(Form, {
    form: permissionForm,
    layout: "vertical",
    onFinish: savePermission
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u6240\u5C5E\u6A21\u5757",
    name: "module",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入所属模块'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u4F8B\u5982\uFF1A\u91C7\u96C6\u9879\u76EE"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u6743\u9650\u540D\u79F0",
    name: "name",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入权限名称'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u4F8B\u5982\uFF1A\u9879\u76EE\u7F16\u8F91"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u6743\u9650\u6807\u8BC6",
    name: "code",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入权限标识'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u4F8B\u5982\uFF1Aproject:write"
  })))), /*#__PURE__*/React.createElement(Modal, {
    title: taskEditing ? "\u7F16\u8F91\u91C7\u96C6\u4EFB\u52A1" : "\u65B0\u5EFA\u91C7\u96C6\u4EFB\u52A1",
    open: modal === 'task',
    onCancel: () => setModal(null),
    onOk: () => taskForm.submit(),
    okText: taskEditing ? "\u4FDD\u5B58" : "\u521B\u5EFA\u4EFB\u52A1",
    cancelText: "\u53D6\u6D88"
  }, /*#__PURE__*/React.createElement(Form, {
    form: taskForm,
    layout: "vertical",
    initialValues: {
      collector: '张三',
      target: 1000
    },
    onFinish: makeTask
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u4EFB\u52A1\u540D\u79F0",
    name: "name",
    rules: [{
      required: true,
      whitespace: true,
      message: '请输入任务名称'
    }]
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u4F8B\u5982\uFF1A\u9996\u8F6E HCP \u62DC\u8BBF\u5BF9\u8BDD\u91C7\u96C6"
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u91C7\u96C6\u7528 E \u4EBA",
    name: "collector",
    rules: [{
      required: true,
      message: '请选择采集用 E 人'
    }]
  }, /*#__PURE__*/React.createElement(Select, {
    className: "person-select",
    optionLabelProp: "label",
    options: [{
      value: '张三',
      label: /*#__PURE__*/React.createElement(PersonOption, {
        name: "\u5F20\u4E09",
        sub: "\u533B\u836F\u4EE3\u8868"
      })
    }, {
      value: '小贝',
      label: /*#__PURE__*/React.createElement(PersonOption, {
        name: "\u5C0F\u8D1D",
        sub: "\u6570\u636E\u4E13\u5458"
      })
    }]
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: "\u9884\u8BA1\u6570\u636E\u91CF",
    name: "target",
    rules: [{
      required: true,
      message: '请输入预计数据量'
    }]
  }, /*#__PURE__*/React.createElement(InputNumber, {
    min: 1,
    max: 10000000,
    precision: 0,
    style: {
      width: '100%'
    }
  })))), /*#__PURE__*/React.createElement(Modal, {
    title: "\u5206\u4EAB\u91C7\u96C6\u63A5\u53E3",
    open: modal === 'share',
    onCancel: () => setModal(null),
    footer: /*#__PURE__*/React.createElement(Button, {
      onClick: () => setModal(null)
    }, "\u5173\u95ED")
  }, /*#__PURE__*/React.createElement(Alert, {
    type: "info",
    showIcon: true,
    message: "\u5F53\u524D\u4E3A\u672C\u5730\u539F\u578B\uFF0C\u5C1A\u65E0\u53EF\u8DE8\u8BBE\u5907\u8BBF\u95EE\u7684\u63A5\u53E3\u94FE\u63A5\u3002"
  }), /*#__PURE__*/React.createElement("div", {
    className: "qr-panel"
  }, /*#__PURE__*/React.createElement(QRCode, {
    value: `YUBEI-DEMO:${task.key}`,
    status: "expired",
    statusRender: () => /*#__PURE__*/React.createElement("span", {
      style: {
        background: 'white',
        padding: 8
      }
    }, "\u793A\u4F8B\u4E8C\u7EF4\u7801")
  }), /*#__PURE__*/React.createElement("span", {
    className: "subtitle"
  }, "\u63A5\u5165\u7EBF\u4E0A\u91C7\u96C6\u670D\u52A1\u540E\u53EF\u751F\u6210\u9080\u8BF7\u94FE\u63A5\u3002"))), /*#__PURE__*/React.createElement(Drawer, {
    title: taskDrawer ? `${taskDrawer.name} · 任务详情` : '任务详情',
    width: 480,
    open: !!taskDrawer,
    onClose: () => setTaskDrawer(null),
    extra: (taskDrawer?.state === 'draft' || taskDrawer?.state === 'ready') && /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
      onClick: () => editTask(taskDrawer)
    }, "\u7F16\u8F91"), /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      onClick: () => {
        updateTaskState(taskDrawer.key, 'active');
        setTaskDrawer({
          ...taskDrawer,
          state: 'active'
        });
        message.success('任务已发布至采集管理端');
      }
    }, "\u53D1\u5E03"))
  }, taskDrawer && /*#__PURE__*/React.createElement(Descriptions, {
    column: 1,
    bordered: true,
    size: "small",
    items: [{
      key: 'name',
      label: '任务名称',
      children: taskDrawer.name
    }, {
      key: 'collector',
      label: '采集用 E 人',
      children: taskDrawer.collector || '张三'
    }, {
      key: 'target',
      label: '预计数据量',
      children: `${taskDrawer.target} 条`
    }, {
      key: 'current',
      label: '已收到数据',
      children: `${taskDrawer.current} 条`
    }, {
      key: 'status',
      label: '任务状态',
      children: /*#__PURE__*/React.createElement(Status, {
        state: taskDrawer.state
      })
    }, {
      key: 'endpoint',
      label: '发布端',
      children: taskDrawer.state === 'draft' ? '待发布' : '采集管理端'
    }]
  })), /*#__PURE__*/React.createElement(Drawer, {
    title: doctorDrawer ? `${doctorDrawer.name}的已提交数据` : '已提交数据',
    width: 620,
    zIndex: 1000,
    open: !!doctorDrawer,
    onClose: () => {
      setDoctorSession(null);
      setDoctorDrawer(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-wrap task-flow-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "数据示例（覆盖全部数据状态）"), /*#__PURE__*/React.createElement(Table, {
    columns: recordColumns.filter(column => ['对话轮次', '数据状态', '时间', '操作'].includes(column.title)),
    dataSource: Object.entries(conversationStatus.collector).map(([stage], index) => ({
      key: `status-example-${stage}`,
      name: doctorDrawer?.name || '医生',
      turns: [20, 18, 16, 21, 22, 19][index],
      stage,
      time: `2026.09.${String(17 - index).padStart(2, '0')} ${index ? '10:20' : '11:25'}`
    })),
    pagination: false,
    locale: {
      emptyText: '暂无该医生已提交的数据'
    }
  }))), /*#__PURE__*/React.createElement(Drawer, {
    title: `${doctorSession?.doctor || '医生'}的对话详情`,
    width: 640,
    zIndex: 1100,
    open: !!doctorSession,
    onClose: () => setDoctorSession(null),
    extra: /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
      onClick: () => markSessionValidity(false)
    }, "\u65E0\u6548"), /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      onClick: () => markSessionValidity(true)
    }, "\u6709\u6548"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "conversation"
  }, initialConversation.map((text, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `message-row ${i % 2 === 0 ? 'right' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-label"
  }, i % 2 === 0 ? '张三 · 医药代表' : `${doctorSession?.doctor || '医生'} · 医生`), /*#__PURE__*/React.createElement("div", {
    className: "bubble"
  }, text))))), /*#__PURE__*/React.createElement(Drawer, {
    title: "\u6570\u636E\u8BE6\u60C5",
    width: 560,
    zIndex: 1200,
    open: !!record,
    destroyOnClose: true,
    onClose: () => setRecord(null),
    extra: record && (() => {
      const status = getConversationStatus(record, page === 'detail' ? 'demand' : 'collector');
      return status ? /*#__PURE__*/React.createElement(Tag, {
        color: status[1]
      }, status[0]) : null;
    })(),
    footer: record && (page === 'flow' && ['pending_cleaning', 'pending_initial_review'].includes(record.stage) || page === 'detail' && record.stage === 'initial_approved') && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10
      }
    }, page === 'flow' && record.stage === 'pending_cleaning' && /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      disabled: editing >= 0,
      onClick: () => updateRecordStage(record, 'pending_initial_review', '错别字清洗完成，进入待初审')
    }, "\u5B8C\u6210\u9519\u522B\u5B57\u6E05\u6D17"), page === 'flow' && record.stage === 'pending_initial_review' && /*#__PURE__*/React.createElement(Button, {
      danger: true,
      onClick: () => updateRecordStage(record, 'initial_rejected', '初审未通过，需要重新采集')
    }, "\u521D\u5BA1\u4E0D\u901A\u8FC7"), page === 'flow' && record.stage === 'pending_initial_review' && /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      onClick: () => updateRecordStage(record, 'initial_approved', '初审通过，已提交需求端终审')
    }, "\u521D\u5BA1\u901A\u8FC7"), page === 'detail' && record.stage === 'initial_approved' && /*#__PURE__*/React.createElement(Button, {
      danger: true,
      onClick: () => updateRecordStage(record, 'final_rejected', '终审未通过，需要重新采集')
    }, "\u7EC8\u5BA1\u4E0D\u901A\u8FC7"), page === 'detail' && record.stage === 'initial_approved' && /*#__PURE__*/React.createElement(Button, {
      type: "primary",
      onClick: () => updateRecordStage(record, 'final_approved', '终审通过，该对话已采用')
    }, "\u7EC8\u5BA1\u901A\u8FC7"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "conversation"
  }, conversation.map((entry, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `message-row ${entry.sender === 'rep' ? 'right' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-label"
  }, entry.sender === 'rep' ? '张三 · 医药代表' : `${record?.name || '医生'} · 医生`), /*#__PURE__*/React.createElement("div", {
    className: "bubble"
  }, editing === i && page === 'flow' && record?.stage === 'pending_cleaning' ? /*#__PURE__*/React.createElement(Input.TextArea, {
    value: editText,
    onChange: e => setEditText(e.target.value),
    autoSize: true
  }) : entry.text), page === 'flow' && record?.stage === 'pending_cleaning' && /*#__PURE__*/React.createElement("div", {
    className: "bubble-actions"
  }, editing === i ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    type: "link",
    size: "small",
    onClick: () => setEditing(-1)
  }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement(Button, {
    type: "link",
    size: "small",
    disabled: !editText.trim(),
    onClick: () => {
      setConversation(conversation.map((t, j) => j === i ? {
        ...t,
        text: editText
      } : t));
      setEditing(-1);
    }
  }, "\u4FDD\u5B58")) : /*#__PURE__*/React.createElement(Button, {
    type: "link",
    size: "small",
    onClick: () => {
      setEditing(i);
      setEditText(entry.text);
    }
  }, "\u4FEE\u6B63\u9519\u522B\u5B57")))))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(ConfigProvider, {
  theme: {
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 8,
      colorBgLayout: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: 14,
      controlHeight: 36
    },
    components: {
      Menu: {
        darkItemBg: '#101828',
        darkSubMenuItemBg: '#101828',
        darkItemColor: '#c4cedd',
        darkGroupTitleColor: '#667387',
        darkItemSelectedBg: '#21304a',
        darkItemSelectedColor: '#fff'
      },
      Table: {
        headerBg: '#f8fafc',
        borderColor: '#edf0f3'
      },
      Tabs: {
        horizontalItemGutter: 32
      }
    }
  }
}, /*#__PURE__*/React.createElement(AntApp, null, /*#__PURE__*/React.createElement(Workspace, null))));
