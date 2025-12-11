import { useState, useEffect } from 'react';
import { Timer, TimerFormData } from '../types/timer';
import { parseTimeInput } from '../utils/timeUtils';

const LOCAL_STORAGE_KEY = 'timers_app';

export const useTimers = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load timers from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: Timer[] = JSON.parse(stored);
        setTimers(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save timers to localStorage whenever they change
  const saveTimers = (newTimers: Timer[]) => {
    setTimers(newTimers);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTimers));
    } catch (err) {
      console.error('Failed to save timers', err);
    }
  };

  const createTimer = (formData: TimerFormData) => {
    try {
      const duration = parseTimeInput(
        formData.hours,
        formData.minutes,
        formData.seconds
      );

      if (duration <= 0) throw new Error('Duration must be greater than 0');

      const newTimer: Timer = {
        id: crypto.randomUUID(), // generate unique id
        title: formData.title,
        duration,
        color: formData.color,
        is_active: false,
        end_time: undefined,
        completed_at: undefined,
        created_at: new Date().toISOString(),
      };

      const updatedTimers = [newTimer, ...timers];
      saveTimers(updatedTimers);
      return newTimer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create timer');
      throw err;
    }
  };

  const startTimer = (id: string) => {
    const timer = timers.find((t) => t.id === id);
    if (!timer) throw new Error('Timer not found');

    const endTime = new Date(Date.now() + timer.duration * 1000).toISOString();

    const updatedTimers = timers.map((t) =>
      t.id === id ? { ...t, is_active: true, end_time: endTime, completed_at: undefined } : t
    );

    saveTimers(updatedTimers);
  };

  const pauseTimer = (id: string) => {
    const updatedTimers = timers.map((t) =>
      t.id === id ? { ...t, is_active: false } : t
    );
    saveTimers(updatedTimers);
  };

  const completeTimer = (id: string) => {
    const now = new Date().toISOString();
    const updatedTimers = timers.map((t) =>
      t.id === id ? { ...t, is_active: false, completed_at: now } : t
    );
    saveTimers(updatedTimers);
  };

  const resetTimer = (id: string) => {
    const updatedTimers = timers.map((t) =>
      t.id === id
        ? { ...t, is_active: false, end_time: undefined, completed_at: undefined }
        : t
    );
    saveTimers(updatedTimers);
  };

  const deleteTimer = (id: string) => {
    const updatedTimers = timers.filter((t) => t.id !== id);
    saveTimers(updatedTimers);
  };

  const refetch = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: Timer[] = JSON.parse(stored);
        setTimers(parsed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timers');
    }
  };

  return {
    timers,
    loading,
    error,
    createTimer,
    startTimer,
    pauseTimer,
    completeTimer,
    deleteTimer,
    resetTimer,
    refetch,
  };
};
