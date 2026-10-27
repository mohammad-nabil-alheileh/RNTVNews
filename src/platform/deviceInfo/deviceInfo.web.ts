import { DeviceInfo } from '../../types/device';

interface WebOsDeviceInfo {
  modelName?: string;
  platformVersion?: string;
  sdkVersion?: string;
}

function webOsInfo(): WebOsDeviceInfo | null {
  const palm = (window as unknown as { PalmSystem?: { deviceInfo?: string } })
    .PalmSystem;
  if (!palm?.deviceInfo) {
    return null;
  }
  try {
    return JSON.parse(palm.deviceInfo) as WebOsDeviceInfo;
  } catch {
    return null;
  }
}

export function getDeviceInfo(): DeviceInfo {
  const tv = webOsInfo();
  if (tv) {
    return {
      model: tv.modelName ?? 'LG TV',
      os: 'webOS',
      osVersion: tv.platformVersion ?? tv.sdkVersion ?? 'unknown',
    };
  }
  const agent = navigator.userAgent;
  const isWebOs = /Web0S|webOS/i.test(agent);
  const chromium = agent.match(/Chrome\/([\d.]+)/)?.[1];
  return {
    model: isWebOs ? 'LG TV' : 'Web browser',
    os: isWebOs ? 'webOS' : navigator.platform || 'Web',
    osVersion: chromium ? `Chromium ${chromium}` : 'unknown',
  };
}
