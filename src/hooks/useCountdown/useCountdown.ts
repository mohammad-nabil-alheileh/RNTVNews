import { useEffect, useState } from 'react';

export function useCountdown(endsAt: number): number {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}
