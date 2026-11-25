const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
let slots = [], cursor = 0, tree, failDownload = false, downloads = 0;
const ctx = {
  React: {createElement: (type, props, ...children) => ({type, props: {...props, children}}),
    useState: initial => {const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => {slots[i] = value;}];},
    useRef: initial => {const i = cursor++; return slots[i] ||= {current: initial};}},
  antd: {Button: 'Button', Modal: 'Modal', Upload: {Dragger: 'Dragger'}, Alert: 'Alert'}, window: {},
  JSZip: class {file() {} async generateAsync() {if (failDownload) throw Error('Failed'); return {}; }},
  URL: {createObjectURL: () => 'blob:test', revokeObjectURL() {}},
  document: {createElement: () => ({click() {downloads++;}})}, setTimeout() {},
};
vm.createContext(ctx); vm.runInContext(fs.readFileSync('assets/hcp-import.js', 'utf8'), ctx);
const render = () => {cursor = 0; tree = ctx.window.HcpBatchImport({hcps: [], onImport() {}, message: {error() {}}});};
const modal = () => tree.props.children.find(node => node.type === 'Modal');
const seed = failed => {slots = [true, [], '', '', false, {success: 0, failed, total: failed.length}, false, false]; render();};
(async () => {
  seed([{line: 2, name: '测试', phone: '123', error: '手机号格式错误'}]);
  assert.equal(modal().props.footer.props.children[0], '下载错误文件');
  for (const key of ['closable', 'maskClosable', 'keyboard']) assert.equal(modal().props[key], false);
  modal().props.onCancel(); render(); assert.equal(modal().props.open, true);
  failDownload = true; await modal().props.footer.props.onClick(); render(); assert.equal(modal().props.closable, false);
  failDownload = false; await modal().props.footer.props.onClick(); render();
  assert.equal(downloads, 1); assert.equal(modal().props.closable, true);
  assert.equal(modal().props.footer.props.children[0], '完成');
  modal().props.footer.props.onClick(); render(); assert.equal(modal().props.open, false);
  seed([]); assert.equal(modal().props.closable, true); assert.equal(modal().props.footer.props.children[0], '完成');
  console.log('PASS: footer download, close/mask/Esc lock, failed download stays locked, download unlocks, success-only can close.');
})().catch(error => {console.error(error); process.exitCode = 1;});
