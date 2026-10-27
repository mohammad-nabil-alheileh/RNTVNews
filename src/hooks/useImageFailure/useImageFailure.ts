import { useCallback, useState } from 'react';
import { useConnection } from '../useConnection/useConnection';

export function useImageFailure(): [boolean, () => void] {
  const { recoveries } = useConnection();
  const [failedAt, setFailedAt] = useState<number | null>(null);

  const markFailed = useCallback(() => setFailedAt(recoveries), [recoveries]);

  return [failedAt === recoveries, markFailed];
}
