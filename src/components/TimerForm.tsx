import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TimerFormData } from '../types/timer';

interface TimerFormProps {
  onSubmit: (data: TimerFormData) => Promise<void>;
}

const colors = [
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Orange', value: 'orange' },
  { name: 'Red', value: 'red' },
  { name: 'Pink', value: 'pink' },
];

const presets = [
  { label: '1 min', hours: 0, minutes: 1, seconds: 0 },
  { label: '5 min', hours: 0, minutes: 5, seconds: 0 },
  { label: '10 min', hours: 0, minutes: 10, seconds: 0 },
  { label: '15 min', hours: 0, minutes: 15, seconds: 0 },
  { label: '30 min', hours: 0, minutes: 30, seconds: 0 },
  { label: '1 hour', hours: 1, minutes: 0, seconds: 0 },
];

export const TimerForm = ({ onSubmit }: TimerFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [color, setColor] = useState('blue');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (hours === 0 && minutes === 0 && seconds === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title, hours, minutes, seconds, color });
      setTitle('');
      setHours(0);
      setMinutes(5);
      setSeconds(0);
      setColor('blue');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create timer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setHours(preset.hours);
    setMinutes(preset.minutes);
    setSeconds(preset.seconds);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        aria-label="Create new timer"
      >
        <Plus size={24} />
        Create New Timer
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Timer</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close form"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="timer-title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Timer Name
          </label>
          <input
            id="timer-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Coffee Break, Study Session"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className="py-2 px-3 bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="hours"
                className="block text-xs text-gray-500 mb-1"
              >
                Hours
              </label>
              <input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-center text-lg font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                aria-label="Hours"
              />
            </div>
            <div>
              <label
                htmlFor="minutes"
                className="block text-xs text-gray-500 mb-1"
              >
                Minutes
              </label>
              <input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-center text-lg font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                aria-label="Minutes"
              />
            </div>
            <div>
              <label
                htmlFor="seconds"
                className="block text-xs text-gray-500 mb-1"
              >
                Seconds
              </label>
              <input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-center text-lg font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                aria-label="Seconds"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color Theme
          </label>
          <div className="flex gap-3">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  color === c.value ? 'border-gray-900 scale-110' : 'border-gray-200'
                } ${
                  c.value === 'blue'
                    ? 'bg-blue-500'
                    : c.value === 'green'
                    ? 'bg-green-500'
                    : c.value === 'orange'
                    ? 'bg-orange-500'
                    : c.value === 'red'
                    ? 'bg-red-500'
                    : 'bg-pink-500'
                }`}
                aria-label={`Select ${c.name} color`}
                aria-pressed={color === c.value}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || (hours === 0 && minutes === 0 && seconds === 0)}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Timer'}
        </button>
      </form>
    </div>
  );
};
