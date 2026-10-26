import { Platform } from 'react-native';

// Native (Android TV) version. The web build uses deviceInfo.web.ts instead.
export type DeviceInfo = {
  platform: string;
  model: string;
  osVersion: string;
};

export function getDeviceInfo(): DeviceInfo {
  const c = Platform.constants as { Model?: string; Release?: string };
  return {
    platform: Platform.isTV ? 'Android TV' : 'Android',
    model: c.Model ?? 'unknown',
    osVersion: c.Release ?? String(Platform.Version),
  };
}
