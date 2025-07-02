import { create } from 'zustand';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmDialogStore {
  showConfirm: (
    title: string,
    message: string,
    onConfirmCallback: () => void,
    onCancelCallback?: () => void
  ) => void;
  hideConfirm: () => void;
}

export const useConfirmStore = create<ConfirmDialogState & ConfirmDialogStore>(
  (set) => ({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},

    showConfirm: (title, message, onConfirmCallback, onCancelCallback) => {
      set({
        isOpen: true,
        title,
        message,
        onConfirm: onConfirmCallback,
        onCancel: onCancelCallback || (() => {}),
      });
    },

    hideConfirm: () => {
      set({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {},
      });
    },
  })
);
