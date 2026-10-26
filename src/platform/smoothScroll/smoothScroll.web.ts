import {FlatList, ScrollView} from 'react-native';

const DURATION_MS = 180;

type ScrollProp = 'scrollLeft' | 'scrollTop';

const running = new WeakMap<HTMLElement, number>();

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function animate(node: HTMLElement, prop: ScrollProp, target: number) {
  const previous = running.get(node);
  if (previous !== undefined) {
    cancelAnimationFrame(previous);
  }

  const max =
    prop === 'scrollLeft'
      ? node.scrollWidth - node.clientWidth
      : node.scrollHeight - node.clientHeight;
  const end = Math.min(Math.max(0, target), Math.max(0, max));
  const start = node[prop];
  const distance = end - start;
  if (Math.abs(distance) < 1) {
    running.delete(node);
    return;
  }

  const startedAt = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / DURATION_MS);
    node[prop] = start + distance * easeOutCubic(progress);
    if (progress < 1) {
      running.set(node, requestAnimationFrame(step));
    } else {
      running.delete(node);
    }
  };
  running.set(node, requestAnimationFrame(step));
}

function domNode(ref: {getScrollableNode(): unknown} | null) {
  return (ref?.getScrollableNode() as HTMLElement | null | undefined) ?? null;
}

export function scrollListTo<T>(list: FlatList<T> | null, offset: number) {
  const node = domNode(list);
  if (node) {
    animate(node, 'scrollLeft', offset);
  }
}

export function scrollViewTo(view: ScrollView | null, y: number) {
  const node = domNode(view);
  if (node) {
    animate(node, 'scrollTop', y);
  }
}
