const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ctx={React:{createElement(){}},antd:{},window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('assets/hcp-import.js','utf8'),ctx);
const {parseCSV,validate}=ctx.window.HcpImportUtils;
const rows=parseCSV('\uFEFF医生姓名,手机号\r\n"张,医生",18800001234\r\n重复,18800001234\r\n错误,123\r\n');
assert.equal(rows[1][0],'张,医生');const result=validate(rows,[]);assert.equal(result.filter(r=>!r.error).length,1);assert.match(result[2].error,/11/);
assert.ok(validate(rows,[{rawPhone:'18800001234'}])[0].error);assert.throws(()=>parseCSV('"未闭合'));assert.throws(()=>validate([['错误表头']],[]));assert.throws(()=>validate([['医生姓名','手机号'],...Array.from({length:501},()=>['医生','18800001234'])],[]));
console.log('PASS: CSV quoting, BOM, phone validation, duplicates, headers, 500-row limit.');
