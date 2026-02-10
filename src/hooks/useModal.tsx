import { useState } from 'react';
import { CustomModal } from '../components/ui/CustomModal';

interface ModalConfig {
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'warning' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
}

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({
    title: '',
    message: '',
    type: 'alert'
  });
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const showModal = (modalConfig: ModalConfig): Promise<boolean> => {
    setConfig(modalConfig);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  };

  const confirm = (message: string, title: string = 'Confirm Action'): Promise<boolean> => {
    return showModal({
      title,
      message,
      type: 'confirm',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    });
  };

  const alert = (message: string, title: string = 'Notice', type: 'success' | 'warning' | 'info' | 'alert' = 'info'): Promise<boolean> => {
    return showModal({
      title,
      message,
      type,
      confirmText: 'OK'
    });
  };

  const ModalComponent = () => (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={config.type === 'confirm' ? handleConfirm : undefined}
      title={config.title}
      message={config.message}
      type={config.type}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
    />
  );

  return {
    confirm,
    alert,
    ModalComponent
  };
};
