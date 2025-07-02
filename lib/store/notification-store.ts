import { create } from 'zustand';
import { toast } from 'sonner';

type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'default';

interface NotificationState {
  showNotification: (
    message: string,
    type?: NotificationType,
    description?: string,
    duration?: number
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useNotificationStore = create<NotificationState>((_set) => ({
  showNotification: (
    message,
    type = 'default',
    description,
    duration = 3000
  ) => {
    const options: Parameters<typeof toast.message>[1] = {
      duration,
      description,
    };
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      default:
        toast.message(message, options);
        break;
    }
  },
}));
