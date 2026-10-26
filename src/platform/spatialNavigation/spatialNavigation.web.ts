import {FocusDirection} from '../../types/focus';

const KEY_DIRECTIONS: Record<string, FocusDirection> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

const KEY_CODE_DIRECTIONS: Record<number, FocusDirection> = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

const FOCUSABLE =
  '[tabindex="0"], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]';
const GROUP = '[data-focus-group]';
const OPEN_DIALOG = '[role="dialog"][aria-modal="true"]';
const REPEAT_INTERVAL_MS = 120;
const HISTORY_SIZE = 50;
const MIN_SHIFT = 0.25;
const SCROLL_FALLBACK_DELAY_MS = 250;

const lastFocusedInGroup = new WeakMap<Element, HTMLElement>();
const focusHistory: HTMLElement[] = [];
let lastMoveAt = 0;
let started = false;

function isVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function scopeRoot(): ParentNode {
  const dialogs = document.querySelectorAll(OPEN_DIALOG);
  return dialogs.length > 0 ? dialogs[dialogs.length - 1] : document;
}

function focusablesIn(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    isVisible,
  );
}

function groupsOf(element: Element): HTMLElement[] {
  const groups: HTMLElement[] = [];
  let group = element.closest<HTMLElement>(GROUP);
  while (group) {
    groups.push(group);
    group = group.parentElement?.closest<HTMLElement>(GROUP) ?? null;
  }
  return groups;
}

function traps(group: HTMLElement, direction: FocusDirection): boolean {
  return (group.dataset.focusTrap ?? '').split(' ').includes(direction);
}

function gap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  if (bEnd < aStart) {
    return aStart - bEnd;
  }
  if (bStart > aEnd) {
    return bStart - aEnd;
  }
  return 0;
}

function score(
  from: DOMRect,
  to: DOMRect,
  direction: FocusDirection,
): number | null {
  const fromX = from.left + from.width / 2;
  const fromY = from.top + from.height / 2;
  const toX = to.left + to.width / 2;
  const toY = to.top + to.height / 2;

  const minShiftX = Math.min(from.width, to.width) * MIN_SHIFT;
  const minShiftY = Math.min(from.height, to.height) * MIN_SHIFT;

  let primary: number;
  let cross: number;
  let alignment: number;

  switch (direction) {
    case 'right':
      if (toX - fromX < minShiftX) {
        return null;
      }
      primary = Math.max(0, to.left - from.right);
      cross = gap(from.top, from.bottom, to.top, to.bottom);
      alignment = Math.abs(toY - fromY);
      break;
    case 'left':
      if (fromX - toX < minShiftX) {
        return null;
      }
      primary = Math.max(0, from.left - to.right);
      cross = gap(from.top, from.bottom, to.top, to.bottom);
      alignment = Math.abs(toY - fromY);
      break;
    case 'down':
      if (toY - fromY < minShiftY) {
        return null;
      }
      primary = Math.max(0, to.top - from.bottom);
      cross = gap(from.left, from.right, to.left, to.right);
      alignment = Math.abs(toX - fromX);
      break;
    case 'up':
      if (fromY - toY < minShiftY) {
        return null;
      }
      primary = Math.max(0, from.top - to.bottom);
      cross = gap(from.left, from.right, to.left, to.right);
      alignment = Math.abs(toX - fromX);
      break;
  }

  return primary + cross * 2 + alignment * 0.01;
}

function rememberedTarget(
  target: HTMLElement,
  current: HTMLElement,
): HTMLElement {
  const entered = groupsOf(target).filter(
    group =>
      !group.contains(current) && group.dataset.focusRemember === 'true',
  );
  const outermost = entered[entered.length - 1];
  if (!outermost) {
    return target;
  }
  const remembered = lastFocusedInGroup.get(outermost);
  if (remembered && outermost.contains(remembered) && isVisible(remembered)) {
    return remembered;
  }
  return focusablesIn(outermost)[0] ?? target;
}

function isOnScreen(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

function focus(element: HTMLElement) {
  element.focus({preventScroll: true});
  setTimeout(() => {
    if (document.activeElement === element && !isOnScreen(element)) {
      element.scrollIntoView({block: 'nearest', inline: 'nearest'});
    }
  }, SCROLL_FALLBACK_DELAY_MS);
}

function move(direction: FocusDirection) {
  const root = scopeRoot();
  const current = document.activeElement as HTMLElement | null;

  if (!current || current === document.body || !root.contains(current)) {
    const target = restoreTarget(root);
    if (target) {
      focus(target);
    }
    return;
  }

  let candidates = focusablesIn(root).filter(element => element !== current);
  for (const group of groupsOf(current)) {
    if (traps(group, direction)) {
      candidates = candidates.filter(element => group.contains(element));
      break;
    }
  }

  const from = current.getBoundingClientRect();
  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const candidate of candidates) {
    const value = score(from, candidate.getBoundingClientRect(), direction);
    if (value !== null && value < bestScore) {
      best = candidate;
      bestScore = value;
    }
  }

  if (best) {
    focus(rememberedTarget(best, current));
  }
}

function directionOf(event: KeyboardEvent): FocusDirection | undefined {
  return KEY_DIRECTIONS[event.key] ?? KEY_CODE_DIRECTIONS[event.keyCode];
}

function onKeyDown(event: KeyboardEvent) {
  const direction = directionOf(event);
  if (!direction) {
    return;
  }
  event.preventDefault();

  const now = Date.now();
  if (event.repeat && now - lastMoveAt < REPEAT_INTERVAL_MS) {
    return;
  }
  lastMoveAt = now;
  move(direction);
}

function rememberInHistory(element: HTMLElement) {
  const existing = focusHistory.indexOf(element);
  if (existing !== -1) {
    focusHistory.splice(existing, 1);
  }
  focusHistory.push(element);
  for (let i = focusHistory.length - 1; i >= 0; i--) {
    if (!focusHistory[i].isConnected) {
      focusHistory.splice(i, 1);
    }
  }
  if (focusHistory.length > HISTORY_SIZE) {
    focusHistory.shift();
  }
}

function restoreTarget(root: ParentNode): HTMLElement | undefined {
  for (let i = focusHistory.length - 1; i >= 0; i--) {
    const element = focusHistory[i];
    if (element.isConnected && root.contains(element) && isVisible(element)) {
      return element;
    }
  }
  return focusablesIn(root)[0];
}

function onFocusIn(event: FocusEvent) {
  const target = event.target as HTMLElement;
  for (const group of groupsOf(target)) {
    lastFocusedInGroup.set(group, target);
  }
  rememberInHistory(target);
}

function recoverLostFocus() {
  const root = scopeRoot();
  const active = document.activeElement as HTMLElement | null;
  const lost =
    !active ||
    active === document.body ||
    !active.isConnected ||
    !root.contains(active) ||
    !isVisible(active);
  if (lost) {
    const target = restoreTarget(root);
    if (target) {
      focus(target);
    }
  }
}

export function startSpatialNavigation(): void {
  if (started) {
    return;
  }
  started = true;

  window.addEventListener('keydown', onKeyDown);
  document.addEventListener('focusin', onFocusIn);

  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) {
      return;
    }
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      recoverLostFocus();
    });
  }).observe(document.body, {childList: true, subtree: true});
}
