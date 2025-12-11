import { useEffect, useState, useRef } from 'react';
import AutoSound from './ALRMClok_Electronic alarm buzzer 1 (ID 0035)_BSB.wav'

export const useNotification = () => {
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  // const alarmSound = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS48+ejUxELTqvl77RiGwU7k9n0zoEqBSh+zPLaizsKFGO48OihUhEKTKXh8blgGgU9ldv0z4UrBSd7yvLbjDsLFWO38uqhVBEKTqvl77RkGQY7k9r0z4QrBCh8y/LbjjsKFWS48Oqj";

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options,
      });

      // const audio = new Audio('');
      // audio.loop = true;
      // audio.play().catch(() => {});

      if (!alarmRef.current) {
        alarmRef.current = new Audio(AutoSound);
        alarmRef.current.loop = true; // Loop the alarm
      }
      alarmRef.current.play();

      return notification;
    }
    return null;
  };

  const stopAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.pause();   // Stop playback
      alarmRef.current.currentTime = 0; // Reset to start
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    stopAlarm,
  };
};
