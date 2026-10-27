/* eslint-env node */
import { openApp, physicalKey, wait } from './browser.mjs';
import { SCENARIOS } from './scenarios.mjs';

const RECORD = Boolean(process.env.RECORD);
const LANGUAGES = (process.env.LANGUAGES ?? 'en,ar').split(',');
const ONLY = process.env.ONLY;
const STEP_WAIT_MS = 700;

function matches(expected, actual, memory) {
  if (expected === undefined) {
    return true;
  }
  if (expected === null) {
    return actual === null;
  }
  if (actual === null) {
    return false;
  }
  if (typeof expected === 'object' && expected.same) {
    return actual === memory[expected.same];
  }
  return new RegExp(expected).test(actual);
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
      const expected = step[language] ?? step.expect;
      if (step.remember) {
        memory[step.remember] = actual;
      }
      checks += 1;
      const ok = RECORD || matches(expected, actual, memory);
      if (!ok) {
        failed = true;
        failures += 1;
      }
      lines.push(
        `  ${ok ? 'ok  ' : 'FAIL'} ${step.key.padEnd(5)} -> ${actual ?? '(nothing focused)'}${
          ok || expected === undefined ? '' : `   expected: ${JSON.stringify(expected)}`
        }`,
      );
    }
    app.close();
    console.log(`${failed ? 'FAIL' : 'pass'}  ${scenario.name} [${language}]`);
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
