const WEBOS_BACK_KEY = 461;

const handlers: Array<() => boolean> = [];

function isBackKey(event: KeyboardEvent): boolean {
  return event.keyCode === WEBOS_BACK_KEY || event.key === 'Escape';
}

window.addEventListener('keydown', event => {
  if (!isBackKey(event)) {
    return;
  }
  event.preventDefault();
  if (event.repeat) {
    return;
  }
  for (let i = handlers.length - 1; i >= 0; i--) {
    if (handlers[i]()) {
      return;
    }
  }
});

export function onBack(handler: () => boolean): () => void {
  handlers.push(handler);
  return () => {
    const index = handlers.lastIndexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  };
}

export function exitApp(): void {
  window.close();
}
