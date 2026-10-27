/* eslint-env node */
import { openApp, physicalKey, wait } from './browser.mjs';
import { SCENARIOS } from './scenarios.mjs';

const RECORD = Boolean(process.env.RECORD);
const LANGUAGES = (process.env.LANGUAGES ?? 'en,ar').split(',');
const ONLY = process.env.ONLY;
const STEP_WAIT_MS = 700;

const SAME_PREFIX = 30;

function matches(step, language, actual, memory) {
  const expected = step.expect;
  if (expected === undefined) {
    return true;
  }
  if (actual === null) {
    return false;
  }
  if (expected.same) {
    return actual === memory[expected.same];
  }
  if (expected.like) {
    const before = memory[expected.like] ?? '';
    return actual.slice(0, SAME_PREFIX) === before.slice(0, SAME_PREFIX);
  }
  if (!new RegExp(expected[language]).test(actual)) {
    return false;
  }
  if (step.differs && actual === memory[step.differs]) {
    return false;
  }
  if (step.not?.some(pattern => new RegExp(pattern[language]).test(actual))) {
    return false;
  }
  return true;
}

function describeExpected(step, language) {
  const expected = step.expect;
  if (expected?.same) {
    return `same item as "${expected.same}"`;
  }
  if (expected?.like) {
    return `same story as "${expected.like}"`;
  }
  return expected?.[language];
}

let failures = 0;
let checks = 0;

for (const language of LANGUAGES) {
  for (const scenario of SCENARIOS) {
    if (ONLY && scenario.name !== ONLY) {
      continue;
    }
    const app = await openApp({ language });
    const memory = {};
    const lines = [];
    let failed = false;
    const steps = [{ key: 'start', expect: scenario.start }, ...scenario.steps];

    for (const step of steps) {
      if (step.key !== 'start') {
        await app.press(physicalKey(step.key, language));
      }
      await wait(step.wait ?? STEP_WAIT_MS);
      const actual = await app.focus();
      checks += 1;
      const ok = RECORD || matches(step, language, actual, memory);
      if (step.remember) {
        memory[step.remember] = actual;
      }
      if (!ok) {
        failed = true;
        failures += 1;
      }
      lines.push(
        `  ${ok ? 'ok  ' : 'FAIL'} ${step.key.padEnd(5)} -> ${
          actual ?? '(nothing focused)'
        }${ok ? '' : `   expected: ${describeExpected(step, language)}`}`,
      );
    }
    app.close();
    console.log(
      `${failed ? 'FAIL' : 'pass'}  ${scenario.name} [${language}]: ${
        scenario.about
      }`,
    );
    if (failed || RECORD || process.env.VERBOSE) {
      console.log(lines.join('\n'));
    }
  }
}

console.log(
  RECORD
    ? `\nRecorded ${checks} steps.`
    : `\n${checks - failures}/${checks} focus checks passed.`,
);
process.exit(failures > 0 && !RECORD ? 1 : 0);
