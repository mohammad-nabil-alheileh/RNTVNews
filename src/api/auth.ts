import { SignInCode } from '../types/auth';
import { randomCode } from '../utils/randomCode/randomCode';
import { clearSession, setSession } from './sessionStore';

const RELAY_URL = 'https://ntfy.sh';
const TOPIC_PREFIX = 'tvnews-';
const APPROVED = 'approved';
const CODE_LIFETIME_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 10000;

export const POLL_INTERVAL_MS = 5000;

function topicOf(code: string): string {
  return TOPIC_PREFIX + code;
}

export function createSignInCode(): SignInCode {
  const code = randomCode(8);
  return {
    code,
    approveUrl: `${RELAY_URL}/${topicOf(code)}/publish?message=${APPROVED}`,
    expiresAt: Date.now() + CODE_LIFETIME_MS,
  };
}

export function shortAddress(code: string): string {
  return `ntfy.sh/${topicOf(code)}/publish`;
}

export async function isApproved(code: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(
      `${RELAY_URL}/${topicOf(code)}/json?poll=1&since=all`,
      { signal: controller.signal },
    );
    if (!response.ok) {
      throw new Error(`ntfy.sh responded ${response.status}`);
    }
    const text = await response.text();
    return text
      .split('\n')
      .filter(Boolean)
      .some(line => {
        try {
          const event = JSON.parse(line);
          return event.event === 'message';
        } catch {
          return false;
        }
      });
  } finally {
    clearTimeout(timer);
  }
}

export function completeSignIn(): void {
  setSession({ signedInAt: new Date().toISOString() });
}

export function signOut(): void {
  clearSession();
}
