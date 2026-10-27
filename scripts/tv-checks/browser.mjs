/* eslint-env node */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const KEY_CODES = {
  ArrowUp: 38,
  ArrowDown: 40,
  ArrowLeft: 37,
  ArrowRight: 39,
  Enter: 13,
  Escape: 27,
};

export const wait = ms => new Promise(done => setTimeout(done, ms));

export function appUrl() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  const page = resolve('dist/index.html');
  if (!existsSync(page)) {
    console.error('dist/index.html not found. Run: npm run build:web');
    process.exit(1);
  }
  return pathToFileURL(page).href;
}

export async function openApp({ language = 'en', width = 1920, height = 1080 } = {}) {
  const port = 9400 + Math.floor(Math.random() * 400);
  const profile = mkdtempSync(join(tmpdir(), 'tv-checks-'));
  const chrome = spawn(
    process.env.CHROME ?? 'google-chrome',
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--window-size=${width},${height}`,
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--allow-file-access-from-files',
      '--js-flags=--expose-gc',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  let target;
  for (let i = 0; i < 40 && !target; i++) {
    await wait(500);
    try {
      target = await (
        await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })
      ).json();
    } catch {}
  }
  if (!target) {
    chrome.kill();
    throw new Error('Chrome did not start');
  }

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(done => socket.addEventListener('open', done));
  let nextId = 0;
  const pending = new Map();
  const eventListeners = new Set();
  socket.addEventListener('message', message => {
    const data = JSON.parse(message.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data.result ?? {});
      pending.delete(data.id);
    } else if (data.method) {
      eventListeners.forEach(listener => listener(data));
    }
  });
  const send = (method, params = {}) =>
    new Promise(done => {
      nextId += 1;
      pending.set(nextId, done);
      socket.send(JSON.stringify({ id: nextId, method, params }));
    });
  const evaluate = async expression =>
    (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }))
      .result?.value;

  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const url = appUrl();
  await send('Page.navigate', { url });
  await wait(1500);
  await evaluate(`localStorage.clear();
    localStorage.setItem('session', JSON.stringify({ signedInAt: new Date().toISOString() }));
    localStorage.setItem('settings', JSON.stringify({ language: '${language}', textSize: 'medium' }));`);
  await send('Page.navigate', { url });
  await wait(8000);

  const press = async (key, { hold = false } = {}) => {
    const code = KEY_CODES[key];
    const enter = key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {};
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key,
      code: key,
      windowsVirtualKeyCode: code,
      autoRepeat: hold,
      ...enter,
    });
    if (!hold) {
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode: code });
    }
  };
  const release = key =>
    send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key,
      code: key,
      windowsVirtualKeyCode: KEY_CODES[key],
    });

  const focus = () =>
    evaluate(`(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;
      const label = (element.getAttribute('aria-label') || element.textContent || '').trim();
      return label.replace(/\\s+/g, ' ').slice(0, 80);
    })()`);

  const close = () => {
    socket.close();
    chrome.kill();
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {}
  };

  return {
    send,
    evaluate,
    press,
    release,
    focus,
    close,
    onEvent: listener => eventListeners.add(listener),
  };
}

export function physicalKey(step, language) {
  const rtl = language === 'ar';
  const map = {
    U: 'ArrowUp',
    D: 'ArrowDown',
    S: rtl ? 'ArrowRight' : 'ArrowLeft',
    E: rtl ? 'ArrowLeft' : 'ArrowRight',
    OK: 'Enter',
    BK: 'Escape',
  };
  return map[step];
}
