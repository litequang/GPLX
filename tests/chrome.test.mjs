import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../dist/chrome.js', import.meta.url), 'utf8').replace('export function', 'function');
function harness({ mobile = true, standalone = false, ios = false, android = false, earlyPrompt = null, earlyInstalled = false } = {}) {
  const events = {}, documentEvents = {}, classes = new Set(), frames = [], modals = [], toasts = [];
  const element = () => ({ inert: false, hidden: false, disabled: false, handlers: {}, contains(node) { return node === this; }, addEventListener(type, fn) { this.handlers[type] = fn; } });
  const header = element(), nav = element(), sidebar = element(), button = element();
  const body = { classList: { toggle(name, on) { if (on) classes.add(name); else classes.delete(name); } } };
  let modal = false;
  const document = { body, documentElement: { scrollHeight: 3000 }, activeElement: null,
    querySelector(selector) { return ({ '.topbar': header, '#bottom-nav': nav, '#sidebar': sidebar, '#install-button': button, 'dialog[open]': modal })[selector]; },
    addEventListener(type, fn) { documentEvents[type] = fn; } };
  const media = { '(display-mode: standalone)': { matches: standalone, addEventListener() {} }, '(max-width: 700px)': { matches: mobile, addEventListener() {} } };
  const window = { scrollY: 0, addEventListener(type, fn) { events[type] = fn; } };
  const capture = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8').match(/<script id="pwa-install-capture">([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(capture, { window });
  if (earlyPrompt) events.beforeinstallprompt(earlyPrompt);
  if (earlyInstalled) events.appinstalled();
  vm.runInNewContext(source + '\nglobalThis.api = initChrome({ showModal, modalHeading, toast });', {
    window, document, innerHeight: 800, navigator: { userAgent: ios ? 'iPhone' : android ? 'Android Chrome' : 'Chrome', platform: '', maxTouchPoints: 0 },
    matchMedia: query => media[query], addEventListener: (type, fn) => { events[type] = fn; },
    requestAnimationFrame: fn => { frames.push(fn); return 1; }, showModal: s => modals.push(s), modalHeading: s => s, toast: s => toasts.push(s),
  });
  return { header, nav, sidebar, button, modals, toasts, events, documentEvents, document,
    hidden: () => classes.has('chrome-hidden'), modal: value => { modal = value; },
    scroll(y) { window.scrollY = y; events.scroll(); while (frames.length) frames.shift()(); },
    install: () => button.handlers.click(),
  };
}
test('chrome hides/reveals together, ignores jitter and clamps overscroll', () => {
  const h = harness();
  h.scroll(150); assert(h.hidden()); assert(h.header.inert && h.nav.inert);
  h.scroll(146); assert(h.hidden()); h.scroll(135); assert(!h.hidden());
  h.scroll(200); assert(h.hidden()); h.scroll(3000); h.scroll(2600); assert(h.hidden());
  h.scroll(2180); assert(!h.hidden()); h.scroll(-50); assert(!h.hidden()); assert(h.sidebar.inert);
});
test('modal and keyboard focus keep chrome visible; pointer focus does not pin it', () => {
  const h = harness({ mobile: false });
  h.modal(true); h.scroll(300); assert(!h.hidden());
  h.modal(false); h.scroll(400); assert(h.hidden());
  h.documentEvents.keydown({ key: 'Tab' }); assert(!h.hidden());
  h.document.activeElement = h.header; h.scroll(500); assert(!h.hidden());
  h.documentEvents.pointerdown(); h.scroll(600); assert(h.hidden());
});
test('PWA fallback explains iOS installation; standalone hides install control', async () => {
  const h = harness({ ios: true }); await h.install(); assert.match(h.modals[0], /Safari.*Chia sẻ.*Thêm vào Màn hình chính/);
  assert(harness({ standalone: true }).button.hidden);
});
test('PWA prompt is consumed once, reentry blocked and dismissal remains retryable', async () => {
  const h = harness(); let calls = 0, prevented = false, resolve;
  h.events.beforeinstallprompt({ preventDefault() { prevented = true; }, prompt: async () => { calls++; }, userChoice: new Promise(r => { resolve = r; }) });
  const pending = h.install(); await h.install(); assert.equal(calls, 1); assert(prevented); assert(h.button.disabled);
  resolve({ outcome: 'dismissed' }); await pending; assert(!h.button.hidden && !h.button.disabled);
  await h.install(); assert.equal(h.modals.length, 1);
  h.events.appinstalled(); assert(h.button.hidden);
});
test('failed PWA prompt restores the button and offers fallback on next click', async () => {
  const h = harness(); h.events.beforeinstallprompt({ preventDefault() {}, prompt: async () => { throw new Error('blocked'); } });
  await h.install(); assert(!h.button.disabled); assert.match(h.toasts[0], /Chưa mở được/);
  await h.install(); assert.equal(h.modals.length, 1);
});

test('early Android install event survives module loading and opens native prompt on first tap', async () => {
  let calls = 0, prevented = false;
  const h = harness({ android: true, earlyPrompt: {
    preventDefault() { prevented = true; },
    prompt() { calls++; return Promise.resolve(); }, userChoice: Promise.resolve({ outcome: 'accepted' }),
  } });
  assert(prevented); assert.equal(h.button.textContent, 'Cài ngay');
  const task = h.install();
  assert.equal(calls, 1, 'prompt invoked synchronously inside the user click, before any await');
  assert.equal(h.modals.length, 0);
  await task; assert(h.button.hidden);
});
test('Android pending eligibility uses a short status, then switches to native install without a guide', async () => {
  const h = harness({ android: true });
  await h.install(); assert.equal(h.modals.length, 0); assert.match(h.toasts[0], /Chưa có xác nhận/);
  h.events.beforeinstallprompt({ preventDefault() {}, prompt: async () => {}, userChoice: Promise.resolve({ outcome: 'dismissed' }) });
  assert.equal(h.button.textContent, 'Cài ngay');
  await h.install(); assert(!h.button.hidden && !h.button.disabled); assert.equal(h.modals.length, 0);
});
test('installation completed before UI initialization keeps install button hidden', () => {
  assert(harness({ android: true, earlyInstalled: true }).button.hidden);
});
