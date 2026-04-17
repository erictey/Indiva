import { useEffect, useState } from 'react';

export function useCycleTimer(endDate?: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endDate) {
      return undefined;
    }

    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [endDate]);

  const targetTime = endDate ? new Date(endDate).getTime() : 0;
  const remainingMs = targetTime ? Math.max(0, targetTime - now) : 0;
  const totalMinutes = Math.floor(remainingMs / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return {
    remainingMs,
    days,
    hours,
    minutes,
    isExpired: remainingMs === 0 && Boolean(endDate),
  };
}
