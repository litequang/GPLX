import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as core from '../dist/core.js';
import { SIGN_STANDARD_2024, extractSignCode, applySign2024Updates, sign2024AuditSummary, sign2024AuditCsv } from '../scripts/signs-2024.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataset = JSON.parse(readFileSync(resolve(root, 'dist/data/dataset.json'), 'utf8'));
const signs = dataset.signs;
const baseline = JSON.parse(readFileSync(resolve(root, 'docs/SIGN_2024_BATCH1_BASELINE.json'), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
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
  assert.equal(signs.filter(s=>s.qcvn2024.verification === 'text-verified').length, 39);
  assert.equal(signs.filter(s=>s.qcvn2024.verification === 'pending').length, 301);
  assert.deepEqual(signs.filter(s=>s.qcvn2024.verification === 'needs-code-review').map(s=>s.id), []);
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
  assert.equal(get(54).code,'DP.127a');
  assert.equal(get(116).code,'DP.127a');
});
test('batch applies to pre-audit records, preserving all 332 IDs/assets and every field outside scope', () => {
  const originals = new Map(baseline.before.map(s => [s.id, s]));
  const input = signs.filter(s=>s.legacy).map(s => originals.get(s.id) || s);
  const snapshot = structuredClone(input);
  assert.deepEqual(applySign2024Updates(input), signs);
  assert.deepEqual(input, snapshot, 'updater must not mutate its input');
  // Simulate raw SQLite extraction (no normalized code/provenance fields).
  const raw = input.map(({id,category,name,detail,image,sourceUpdated})=>({id,category,name,detail,image,sourceUpdated}));
  assert.deepEqual(applySign2024Updates(raw), signs);
  const selected = new Set([...baseline.selectedIds,54,116]);
  assert.equal(baseline.selectedIds.length,20);
  assert.ok(baseline.before.filter(s=>baseline.selectedIds.includes(s.id)).every(s=>s.category===1 && s.qcvn2024.verification==='pending'));
  assert.equal(hash(signs.filter(s=>!selected.has(s.id))),baseline.untouchedSignsSha256);
  assert.equal(hash(dataset.questions),baseline.questionsSha256, 'all question text/options/answers/images must stay identical');
  assert.equal(hash(Object.fromEntries(Object.entries(dataset).filter(([key])=>!['source','signs'].includes(key)))),baseline.nonSignDataSha256);
  assert.equal(hash(Object.fromEntries(Object.entries(dataset.source).filter(([key])=>key!=='signAudit2024'))),baseline.sourceOutsideSignAuditSha256);
  assert.deepEqual(signs.filter(s=>s.legacy).map(s=>({id:s.id,image:s.image,
    sha256:createHash('sha256').update(readFileSync(resolve(root,'dist',s.image))).digest('hex'),sourceUpdated:s.sourceUpdated})),baseline.legacyAssets);
});
test('all 22 decisions cite official PDF pages, exact figures and asset hashes; CSV is synchronized', () => {
  const reviewed = signs.filter(s=>s.qcvn2024.audit);
  assert.deepEqual(reviewed.map(s=>s.id),[...baseline.selectedIds,54,116]);
  assert.equal(SIGN_STANDARD_2024.pdfSha256,'b6b99d0a0aeb13fe79072831857ece15bb254d8fb7817e80e4a2739a0d2145ce');
  for (const s of reviewed) {
    const a=s.qcvn2024.audit;
    assert.ok(a.pdfPages.length && a.pdfPages.every(p=>Number.isInteger(p)&&p>=80&&p<=93));
    assert.ok(a.pdfPages.includes(a.figurePage));
    assert.ok(a.figure && a.evidence && a.imageComparison && a.imageReviewReason);
    assert.equal(a.imageSha256,createHash('sha256').update(readFileSync(resolve(root,'dist',s.image))).digest('hex'));
    assert.equal(a.imageReview,'NEEDS_REVIEW');
    assert.equal(s.qcvn2024.imageVerification,'pending', 'visual symbol comparison must not certify technical artwork');
  }
  assert.equal(readFileSync(resolve(root,'docs/SIGN_2024_AUDIT.csv'),'utf8'),sign2024AuditCsv(signs));
  assert.equal(dataset.source.signAudit2024.imageVisuallyCompared,22);
  assert.equal(dataset.source.signAudit2024.imageVerificationPending,340);
});
test('critical exceptions and moped scope follow annex B; duplicate end-speed IDs remain separate', () => {
  const get=id=>signs.find(s=>s.id===id);
  assert.match(get(5).detail,/trừ các xe được ưu tiên/);
  assert.match(get(35).detail,/cả xe được ưu tiên cũng không được đi vào/);
  assert.match(get(46).detail,/không cấm xe buýt/);
  assert.match(get(46).detail,/số chỗ/);
  assert.match(get(45).detail,/xe máy chuyên dùng/);
  assert.doesNotMatch(get(45).detail,/thi công/);
  assert.match(get(53).detail,/cấm xe gắn máy/);
  assert.match(get(53).detail,/không có giá trị đối với xe đạp/);
  assert.doesNotMatch(get(53).detail,/xe máy/);
  assert.match(get(48).detail,/trừ loại ôtô sơ-mi-rơ-moóc/);
  assert.match(get(51).detail,/dắt xe đạp/);
  assert.match(get(52).detail,/không cấm người dắt/);
  for (const id of [54,116]) {
    assert.equal(get(id).code,'DP.127a');
    assert.equal(get(id).qcvn2024.clause,'B.27d');
    assert.equal(get(id).qcvn2024.audit.figurePage,92);
    assert.equal(get(id).qcvn2024.audit.decision,'REMAP_CODE');
  }
  assert.equal(get(54).image,get(116).image);
  assert.notEqual(get(54).legacy.sourceId,get(116).legacy.sourceId);
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
  ctx.testActions.handleAction('sign',{dataset:{id:'54'}});
  assert.match(elements['#modal-content'].innerHTML,/DP\.127a/);
  assert.match(elements['#modal-content'].innerHTML,/mục B\.27d, trang PDF 92, 93/);
  assert.match(elements['#modal-content'].innerHTML,/51-bgtvt-kem\.pdf#page=92/);
  assert.match(elements['#modal-content'].innerHTML,/thông số thiết kế hình vẫn cần kiểm duyệt/);
});
