import { Timer, Bell, BellOff } from 'lucide-react';

interface HeaderProps {
  notificationPermission: NotificationPermission;
  onRequestNotification: () => void;
}

export const Header = ({
  notificationPermission,
  onRequestNotification,
}: HeaderProps) => {
  return (
    <header className="bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg">
              <Timer size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                TimeTracker
              </h1>
              <p className="text-sm text-gray-500">
                Smart countdown timer & alarm system
              </p>
            </div>
          </div>

          {notificationPermission !== 'granted' && (
            <button
              onClick={onRequestNotification}
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-lg font-medium transition-colors border-2 border-amber-300"
              aria-label="Enable notifications"
            >
              <BellOff size={20} />
              <span className="hidden sm:inline">Enable Notifications</span>
            </button>
          )}

          {notificationPermission === 'granted' && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <Bell size={20} />
              <span className="hidden sm:inline">Notifications Active</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
