import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as core from '../dist/core.js';
import { SIGN_STANDARD_2024, extractSignCode, applySign2024Updates, sign2024AuditSummary } from '../scripts/signs-2024.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataset = JSON.parse(readFileSync(resolve(root, 'dist/data/dataset.json'), 'utf8'));
const signs = dataset.signs;
test('332 original sign IDs and source asset paths survive; 8 official codes are added with honest placeholders', () => {
  assert.equal(signs.length, 340);
  const legacy = signs.filter(s => s.legacy);
  assert.equal(legacy.length, 332);
  assert.equal(new Set(legacy.map(s => s.legacy.sourceId)).size, 332);
  assert.ok(legacy.every(s => s.id === s.legacy.sourceId && s.image && existsSync(resolve(root, 'dist', s.image))));
  const extra = signs.filter(s => !s.legacy);
  assert.equal(extra.length, 8);
  assert.deepEqual(extra.map(s => s.code), ['R.403g','R.403h','R.403k','R.404g','R.404h','R.404k','I.437','S.510b']);
  assert.ok(extra.every(s => s.image === null && s.qcvn2024.verification === 'text-verified' && s.qcvn2024.imageVerification === 'pending'));
});
test('reproducible sign source corrections and source audit summary match dataset', () => {
  assert.deepEqual(applySign2024Updates(signs.filter(s=>s.legacy)), signs);
  assert.deepEqual(sign2024AuditSummary(signs), dataset.source.signAudit2024);
  assert.equal(SIGN_STANDARD_2024.effectiveFrom, '2025-01-01');
  assert.equal(signs.filter(s=>s.qcvn2024.verification === 'text-verified').length, 17);
  assert.equal(signs.filter(s=>s.qcvn2024.verification === 'pending').length, 321);
  assert.deepEqual(signs.filter(s=>s.qcvn2024.verification === 'needs-code-review').map(s=>s.id), [54,116]);
  assert.ok(signs.every(s=>s.code && /^[BCDEF]$/.test(s.qcvn2024.annex)));
});
test('official corrections avoid source errors in critical 2024 signs', () => {
  const get = id=>signs.find(s=>s.id===id);
  assert.match(get(297).detail, /đỗ xe tải.*nhận và trả hàng/);
  assert.doesNotMatch(get(297).detail, /buýt/);
  assert.match(get(328).name, /khuyết tật/);
  assert.match(get(41).name, /ô tô quay đầu/);
  assert.match(get(95).name, /ô tô quay đầu/);
  assert.match(get(61).name, /xe vật nuôi kéo/);
  assert.equal(get(25).code,'S.510a');
  assert.equal(get(33).code,'S.G,12b');
  assert.match(get(171).name, /dành cho xe máy và xe đạp/);
  assert.doesNotMatch(get(171).name, /xe xe máy/);
  assert.equal(extractSignCode(get(43)), 'P.106b');
  assert.equal(get(54).qcvn2024.verification,'needs-code-review');
  assert.equal(get(116).qcvn2024.verification,'needs-code-review');
});
test('sign changes update offline SHA but retain the existing 600 exam questions', () => {
  const bytes=readFileSync(resolve(root,'dist/data/dataset.json'));
  const manifest=JSON.parse(readFileSync(resolve(root,'dist/data/offline.json')));
  assert.equal(manifest.revision,createHash('sha256').update(bytes).digest('hex').slice(0,12));
  assert.equal(dataset.questions.length,600);
  assert.ok(signs.filter(s=>s.image).every(s=>manifest.urls.includes(s.image)));
  assert.ok(signs.filter(s=>!s.image).every(s=>!manifest.urls.includes(String(s.image))));
});
test('actual signs UI allows code lookup and displays no broken image for unillustrated signs', async () => {
  const html=readFileSync(resolve(root,'dist/index.html'),'utf8');
  const app=readFileSync(resolve(root,'dist/app.js'),'utf8').replace(/^import .+;\n/gm,'');
  const chrome=readFileSync(resolve(root,'dist/chrome.js'),'utf8').replace('export function','function');
  const el=()=>({innerHTML:'',textContent:'',open:false,classList:{add(){},remove(){},toggle(){}},
    addEventListener(){},contains(){return false},showModal(){this.open=true},close(){this.open=false}});
  const elements=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>['#'+m[1],el()]));
  elements['.topbar']=el();
  const ctx={...core,document:{body:el(),activeElement:null,documentElement:{scrollHeight:2000},querySelector:s=>elements[s]||null,addEventListener(){}},
    navigator:{onLine:true},window:{scrollY:0,scrollTo(){},innerWidth:1200},innerHeight:844,
    addEventListener(){},matchMedia:()=>({matches:false,addEventListener(){}}),
    localStorage:{getItem:()=>null,setItem(){},removeItem(){}},sessionStorage:{getItem:()=>null,setItem(){},removeItem(){}},
    history:{replaceState(){}},location:{hash:'#signs'},fetch:async()=>({ok:true,json:async()=>dataset}),
    AbortController,setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},requestAnimationFrame(){}};
  await vm.runInNewContext('(async()=>{'+chrome+'\n'+app+'\nglobalThis.testActions = { handleAction, go, signFigure };})()',ctx);
  assert.match(elements['#main'].innerHTML,/R.403g/);
  assert.match(elements['#main'].innerHTML,/340 mục/);
  const newSign=signs.find(s=>s.code==='R.403g');
  assert.doesNotMatch(ctx.testActions.signFigure(newSign),/<img/);
  assert.match(ctx.testActions.signFigure(newSign),/Hình minh họa đang đối chiếu/);
  ctx.testActions.handleAction('sign',{dataset:{id:String(newSign.id)}});
  assert.match(elements['#modal-content'].innerHTML,/Phụ lục D, mục D.11/);
  assert.match(elements['#modal-content'].innerHTML,/Hình ảnh chưa được kiểm duyệt/);
});
