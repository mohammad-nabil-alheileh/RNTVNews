import { Platform } from 'react-native';
import { DeviceInfo } from '../../types/device';

interface AndroidConstants {
  Manufacturer: string;
  Model: string;
  Release: string;
}

export function getDeviceInfo(): DeviceInfo {
  const constants = Platform.constants as unknown as AndroidConstants;
  return {
    model: `${constants.Manufacturer} ${constants.Model}`,
    os: 'Android',
    osVersion: constants.Release,
  };
}
