import { Play, Pause, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../utils/timeUtils';

export const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Stopwatch
      </h2>

      <div className="mb-8">
        <div
          className="text-6xl font-mono font-bold text-center text-gray-900 mb-4"
          role="timer"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(Math.floor(time / 10))}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-600 h-full rounded-full transition-all duration-100 ease-linear"
            role="progressbar"
            aria-valuenow={time % 100}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${(time % 1000) / 10}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            aria-label="Start stopwatch"
          >
            <Play size={20} />
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            aria-label="Pause stopwatch"
          >
            <Pause size={20} />
            Pause
          </button>
        )}

        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          disabled={time === 0 && !isRunning}
          aria-label="Reset stopwatch"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};
