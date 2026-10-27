/* eslint-env node */
import { openApp, physicalKey, wait } from './browser.mjs';

const MINUTES = Number(process.env.MINUTES ?? 30);
const LANGUAGE = process.env.LANGUAGE ?? 'en';
const SAMPLE_EVERY_MS = 60 * 1000;
const WARM_UP_SAMPLES = 3;
const MAX_HEAP_GROWTH = 0.15;
const MAX_HEAP_GROWTH_MB = 15;
const MAX_NODE_GROWTH = 0.2;
const KEY_GAP_MS = 250;
const TOP_STORY = LANGUAGE === 'ar' ? /^أبرز قصة: / : /^Top story: /;

const app = await openApp({ language: LANGUAGE });
const startedAt = Date.now();
const endsAt = startedAt + MINUTES * 60 * 1000;
const samples = [];
const errors = [];
let focusLost = 0;
let presses = 0;
let cycles = 0;

app.onEvent(event => {
  if (event.method === 'Runtime.exceptionThrown') {
    errors.push(
      event.params.exceptionDetails.exception?.description ??
        event.params.exceptionDetails.text,
    );
  }
});

const randomInt = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

async function key(step, delay = KEY_GAP_MS) {
  await app.press(physicalKey(step, LANGUAGE));
  presses += 1;
  await wait(delay);
  if ((await app.focus()) === null) {
    await wait(1500);
    if ((await app.focus()) === null) {
      focusLost += 1;
      console.log(`  focus lost after ${step} (cycle ${cycles})`);
    }
  }
}

async function hold(step, times) {
  const physical = physicalKey(step, LANGUAGE);
  for (let i = 0; i < times; i++) {
    await app.press(physical, { hold: true });
    presses += 1;
    await wait(60);
  }
  await app.release(physical);
  await wait(800);
}

async function goToTopOfHome() {
  for (let i = 0; i < 30; i++) {
    const label = (await app.focus()) ?? '';
    if (TOP_STORY.test(label)) {
      return;
    }
    await key('U', 150);
  }
}

async function browseHome() {
  for (let i = randomInt(1, 8); i > 0; i--) {
    await key('D');
  }
  if (Math.random() < 0.4) {
    await hold('E', randomInt(5, 20));
  } else {
    for (let i = randomInt(0, 6); i > 0; i--) {
      await key('E');
    }
  }
  await key('OK', 2500);
  for (let i = randomInt(2, 8); i > 0; i--) {
    await key('D', 300);
  }
  await key('BK', 1500);
}

async function visitCategories() {
  await goToTopOfHome();
  await key('U');
  await key('E');
  await key('OK', 2500);
  for (let i = randomInt(1, 6); i > 0; i--) {
    await key('E', 600);
  }
  await key('D', 1500);
  await key('E');
  await key('OK', 2500);
  await key('BK', 1500);
  await key('BK');
  await key('BK', 1500);
}

async function visitSearch() {
  await goToTopOfHome();
  await key('U');
  await key('E');
  await key('E');
  await key('OK', 1500);
  for (let i = randomInt(1, 4); i > 0; i--) {
    for (let j = randomInt(0, 5); j > 0; j--) {
      await key('E', 150);
    }
    await key('OK', 200);
  }
  await wait(4000);
  await key('BK', 1500);
}

async function sample() {
  await app.send('HeapProfiler.collectGarbage');
  await wait(300);
  const heap = await app.send('Runtime.getHeapUsage');
  const counters = await app.send('Memory.getDOMCounters');
  const entry = {
    minute: Math.round((Date.now() - startedAt) / 60000),
    heapMb: Math.round((heap.usedSize / 1048576) * 10) / 10,
    nodes: counters.nodes,
    listeners: counters.jsEventListeners,
  };
  samples.push(entry);
  console.log(
    `  minute ${String(entry.minute).padStart(3)}: heap ${entry.heapMb} MB, ${
      entry.nodes
    } nodes, ${
      entry.listeners
    } listeners, ${presses} key presses, ${cycles} cycles`,
  );
}

console.log(`Smoke test: ${MINUTES} min of browsing [${LANGUAGE}]`);
await sample();
let nextSample = Date.now() + SAMPLE_EVERY_MS;

while (Date.now() < endsAt) {
  cycles += 1;
  await goToTopOfHome();
  await browseHome();
  if (cycles % 3 === 0) {
    await visitCategories();
  }
  if (cycles % 5 === 0) {
    await visitSearch();
  }
  if (Date.now() >= nextSample) {
    await sample();
    nextSample = Date.now() + SAMPLE_EVERY_MS;
  }
}
await sample();
app.close();

const average = list =>
  list.reduce((sum, value) => sum + value, 0) / list.length;
const baseline = samples.slice(1, 1 + WARM_UP_SAMPLES);
const final = samples.slice(-WARM_UP_SAMPLES);
const baseHeap = average(baseline.map(s => s.heapMb));
const endHeap = average(final.map(s => s.heapMb));
const baseNodes = average(baseline.map(s => s.nodes));
const endNodes = average(final.map(s => s.nodes));
const heapGrowth = (endHeap - baseHeap) / baseHeap;
const nodeGrowth = (endNodes - baseNodes) / baseNodes;

const results = [
  [
    'Heap after warm-up vs end',
    `${baseHeap.toFixed(1)} -> ${endHeap.toFixed(1)} MB (${(
      heapGrowth * 100
    ).toFixed(1)}%)`,
    heapGrowth <= MAX_HEAP_GROWTH || endHeap - baseHeap <= MAX_HEAP_GROWTH_MB,
  ],
  [
    'Page elements after warm-up vs end',
    `${Math.round(baseNodes)} -> ${Math.round(endNodes)} (${(
      nodeGrowth * 100
    ).toFixed(1)}%)`,
    nodeGrowth <= MAX_NODE_GROWTH,
  ],
  ['Script errors', String(errors.length), errors.length === 0],
  ['Focus lost', String(focusLost), focusLost === 0],
];

console.log(`\n${cycles} cycles, ${presses} key presses in ${MINUTES} min`);
for (const [name, value, ok] of results) {
  console.log(`${ok ? 'pass' : 'FAIL'}  ${name}: ${value}`);
}
errors
  .slice(0, 5)
  .forEach(error => console.log(`  error: ${error.split('\n')[0]}`));
process.exit(results.every(([, , ok]) => ok) ? 0 : 1);
