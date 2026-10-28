import { Pulse } from '../../types/pulse';

const style = document.createElement('style');
style.textContent =
  '@keyframes app-pulse{from{opacity:1}to{opacity:.55}}' +
  '[data-pulse]{animation:app-pulse .9s ease-in-out infinite alternate}';
document.head.appendChild(style);

const pulse: Pulse = {
  style: undefined,
  props: { dataSet: { pulse: 'true' } },
};

export function usePulse(): Pulse {
  return pulse;
}
