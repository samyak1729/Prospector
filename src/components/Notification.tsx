import React, { useEffect } from 'react';
import { CircleAlert, CircleCheck, Info, CircleX } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const iconMap = {
    success: <CircleCheck className="w-5 h-5 text-green-500" />,
    error: <CircleAlert className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColorMap = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColorMap = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800'
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-72">
      <div 
        className={`${bgColorMap[type]} p-4 rounded-lg shadow-md border flex items-start space-x-3 animate-fade-in`}
      >
        <div className="flex-shrink-0">
          {iconMap[type]}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${textColorMap[type]}`}>
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <CircleX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
