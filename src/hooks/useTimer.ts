import { useState, useEffect, useRef, useCallback } from 'react';
import { ActiveTimer } from '../types/timer';
import { calculateRemainingTime } from '../utils/timeUtils';

export const useTimer = (
  timer: ActiveTimer | null,
  onComplete: () => void
) => {
  const [remainingTime, setRemainingTime] = useState<number>(
    timer?.remainingTime || 0
  );
  const intervalRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = window.setInterval(() => {
      if (timer?.end_time) {
        const remaining = calculateRemainingTime(timer.end_time);
        setRemainingTime(remaining);

        if (remaining <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onComplete();
        }
      }
    }, 100);
  }, [timer?.end_time, onComplete]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (timer?.is_active && timer?.end_time) {
      const remaining = calculateRemainingTime(timer.end_time);
      setRemainingTime(remaining);
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [timer?.is_active, timer?.end_time, startTimer, stopTimer]);

  return { remainingTime, startTimer, stopTimer };
};
