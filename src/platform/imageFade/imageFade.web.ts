import { useState } from 'react';

const style = document.createElement('style');
style.textContent =
  '[data-image-fade]{transition:opacity .2s ease-out}' +
  '[data-image-fade=out]{opacity:0}';
document.head.appendChild(style);

export function useImageFade(): object {
  const [loaded, setLoaded] = useState(false);
  return {
    onLoad: () => setLoaded(true),
    dataSet: { imageFade: loaded ? 'in' : 'out' },
  };
}
