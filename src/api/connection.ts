import { onNetworkRestored } from '../platform/connectivity/connectivity';
import { ConnectionState } from '../types/connection';

const PROBE_URL = 'https://dev.to/api/articles?per_page=1';
const PROBE_INTERVAL_MS = 5000;
const PROBE_TIMEOUT_MS = 5000;

let state: ConnectionState = { online: true, recoveries: 0 };
let probeTimer: ReturnType<typeof setTimeout> | undefined;
let probing = false;
let started = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(listener => listener());
}

function scheduleProbe() {
  clearTimeout(probeTimer);
  probeTimer = setTimeout(probe, PROBE_INTERVAL_MS);
}

async function probe() {
  if (probing || state.online) {
    return;
  }
  probing = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    await fetch(PROBE_URL, { signal: controller.signal });
    reportOnline();
  } catch {
    scheduleProbe();
  } finally {
    clearTimeout(timeout);
    probing = false;
  }
}

export function reportOffline(): void {
  if (!state.online) {
    return;
  }
  state = { ...state, online: false };
  emit();
  scheduleProbe();
}

export function reportOnline(): void {
  if (state.online) {
    return;
  }
  clearTimeout(probeTimer);
  state = { online: true, recoveries: state.recoveries + 1 };
  emit();
}

export function getConnection(): ConnectionState {
  return state;
}

export function subscribeConnection(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function startConnectionWatch(): void {
  if (started) {
    return;
  }
  started = true;
  onNetworkRestored(() => {
    clearTimeout(probeTimer);
    probe();
  });
}
