import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TimerCard } from './components/TimerCard';
import { TimerForm } from './components/TimerForm';
import { Stopwatch } from './components/Stopwatch';
import { useTimers } from './hooks/useTimers';
import { useNotification } from './hooks/useNotification';
import { TimerFormData } from './types/timer';
import { Clock, Zap } from 'lucide-react';

function App() {
  const [view, setView] = useState<'timers' | 'stopwatch'>('timers');

  const {
    timers,
    loading,
    error,
    createTimer,
    startTimer,
    pauseTimer,
    completeTimer,
    deleteTimer,
    resetTimer,
    playTimer,
  } = useTimers();

  const { permission, requestPermission, showNotification, stopAlarm } = useNotification();

  useEffect(() => {
    document.title = 'TimeTracker - Smart Countdown Timer';
  }, []);

  const handleCreateTimer = async (data: TimerFormData) => {
    await createTimer(data);
  };

  const handleStartTimer = async (id: string) => {
    await startTimer(id);
  };

  const handlePauseTimer = async (id: string) => {
    await pauseTimer(id);
  };

  const handleCompleteTimer = async (id: string) => {
    const timer = timers.find((t) => t.id === id);
    if (timer) {
      await completeTimer(id);
      const isData = await showNotification(`${timer.title} completed!`, {
        body: 'Your timer has finished.',
        tag: `timer-${id}`,
        requireInteraction: true,
      });
      playTimer(id, !!isData);
    }
  };

  const handleDeleteTimer = async (id: string) => {
    await deleteTimer(id);
  };

  const handleResetTimer = async (id: string) => {
    await resetTimer(id);
    await stopAlarm();
    playTimer(id, false);
  };

  const handleStopTimer = async (id: string) => {
    await stopAlarm();
    playTimer(id, false);
  };

      


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        notificationPermission={permission}
        onRequestNotification={requestPermission}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setView('timers')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'timers'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            <Clock size={20} />
            Timers
          </button>
          <button
            onClick={() => setView('stopwatch')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'stopwatch'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300'
            }`}
          >
            <Zap size={20} />
            Stopwatch
          </button>
        </div>

        {view === 'timers' ? (
          <>
            <div className="mb-8">
              <TimerForm onSubmit={handleCreateTimer} />
            </div>

        {error && (
          <div
            className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6"
            role="alert"
          >
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : timers.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-4">
              <Clock size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No timers yet
            </h2>
            <p className="text-gray-500">
              Create your first timer to get started!
            </p>
          </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {timers.map((timer) => (
                  <TimerCard
                    key={timer.id}
                    timer={timer}
                    onStart={handleStartTimer}
                    onPause={handlePauseTimer}
                    onReset={handleResetTimer}
                    onDelete={handleDeleteTimer}
                    onComplete={handleCompleteTimer}
                    onStopAlarm={handleStopTimer}
                    permission={permission}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-md mx-auto">
            <Stopwatch />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
