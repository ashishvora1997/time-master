export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(hours.toString().padStart(2, '0'));
  parts.push(minutes.toString().padStart(2, '0'));
  parts.push(secs.toString().padStart(2, '0'));

  return parts.join(':');
};

export const calculateRemainingTime = (endTime: string): number => {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const remaining = Math.max(0, Math.ceil((end - now) / 1000));
  return remaining;
};

export const getTimerProgress = (duration: number, remaining: number): number => {
  return ((duration - remaining) / duration) * 100;
};

export const parseTimeInput = (hours: number, minutes: number, seconds: number): number => {
  return hours * 3600 + minutes * 60 + seconds;
};
