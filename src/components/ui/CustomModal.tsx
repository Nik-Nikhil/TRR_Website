import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'warning' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
}

export const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'alert',
  confirmText = 'OK',
  cancelText = 'Cancel'
}: CustomModalProps) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-12 h-12 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-400" />;
      case 'info':
        return <Info className="w-12 h-12 text-blue-400" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-red-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'warning':
        return {
          border: 'border-yellow-500/30',
          gradient: 'from-yellow-900/40 to-orange-900/40',
          button: 'from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500'
        };
      case 'success':
        return {
          border: 'border-green-500/30',
          gradient: 'from-green-900/40 to-emerald-900/40',
          button: 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
        };
      case 'info':
        return {
          border: 'border-blue-500/30',
          gradient: 'from-blue-900/40 to-cyan-900/40',
          button: 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
        };
      default:
        return {
          border: 'border-red-500/30',
          gradient: 'from-red-900/40 to-rose-900/40',
          button: 'from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500'
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`bg-gradient-to-br ${colors.gradient} backdrop-blur-xl border ${colors.border} rounded-2xl shadow-2xl max-w-md w-full overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  {getIcon()}
                  <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 bg-black/20 border-t border-white/10">
                {type === 'confirm' && (
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-3 bg-gradient-to-r ${colors.button} text-white font-semibold rounded-xl transition-all duration-300 shadow-lg`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
