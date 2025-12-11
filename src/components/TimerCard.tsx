import { Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import { Timer } from '../types/timer';
import { formatTime, getTimerProgress } from '../utils/timeUtils';
import { useTimer } from '../hooks/useTimer';

interface TimerCardProps {
  timer: Timer;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    button: 'bg-blue-600 hover:bg-blue-700',
    progress: 'bg-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    button: 'bg-green-600 hover:bg-green-700',
    progress: 'bg-green-600',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    button: 'bg-orange-600 hover:bg-orange-700',
    progress: 'bg-orange-600',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    button: 'bg-red-600 hover:bg-red-700',
    progress: 'bg-red-600',
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-900',
    button: 'bg-pink-600 hover:bg-pink-700',
    progress: 'bg-pink-600',
  },
};

export const TimerCard = ({
  timer,
  onStart,
  onPause,
  onReset,
  onDelete,
  onComplete,
}: TimerCardProps) => {
  const { remainingTime } = useTimer(
    timer.is_active && timer.end_time
      ? { ...timer, remainingTime: timer.duration }
      : null,
    () => onComplete(timer.id)
  );

  const colors = colorClasses[timer.color as keyof typeof colorClasses] || colorClasses.blue;
  const displayTime = timer.is_active ? remainingTime : timer.duration;
  const progress = timer.is_active
    ? getTimerProgress(timer.duration, remainingTime)
    : timer.completed_at
    ? 100
    : 0;

  return (
    <div
      className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
      role="article"
      aria-label={`Timer: ${timer.title}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-semibold ${colors.text}`}>
          {timer.title}
        </h3>
        <button
          onClick={() => onDelete(timer.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
          aria-label={`Delete ${timer.title} timer`}
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div
          className={`text-5xl font-mono font-bold ${colors.text} mb-4 text-center`}
          role="timer"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(displayTime)}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`${colors.progress} h-full rounded-full transition-all duration-300 ease-linear`}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Timer progress"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {!timer.is_active ? (
          <button
            onClick={() => onStart(timer.id)}
            className={`flex-1 ${colors.button} text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
            aria-label={`Start ${timer.title} timer`}
          >
            <Play size={20} />
            Start
          </button>
        ) : (
          <button
            onClick={() => onPause(timer.id)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            aria-label={`Pause ${timer.title} timer`}
          >
            <Pause size={20} />
            Pause
          </button>
        )}

        <button
          onClick={() => onReset(timer.id)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          disabled={!timer.is_active && !timer.completed_at}
          aria-label={`Reset ${timer.title} timer`}
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {!timer.is_active && timer.completed_at && (
        <div className="mt-3 text-sm text-green-600 font-medium text-center">
          Completed!
        </div>
      )}
    </div>
  );
};
