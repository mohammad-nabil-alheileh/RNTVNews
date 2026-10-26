import type { DeviceInfo } from './deviceInfo';

// Web (LG webOS) version. Webpack picks this file over deviceInfo.ts.
export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  const isWebOS = /Web0S|webOS/i.test(ua);
  const chrome = ua.match(/Chrome\/(\d+)/)?.[1];
  return {
    platform: isWebOS ? 'LG webOS' : 'Browser',
    // Real model and webOS version come from LG's system APIs later.
    model: isWebOS ? 'LG TV' : 'desktop',
    osVersion: chrome ? `Chromium ${chrome}` : 'unknown',
  };
}
