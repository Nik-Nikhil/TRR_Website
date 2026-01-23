// src/components/ui/Toast.tsx
import { motion } from "framer-motion";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";
import { useEffect } from "react";

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles = {
  success: {
    bg: "bg-gradient-to-r from-emerald-500/90 to-green-600/90",
    border: "border-emerald-400/50",
    icon: CheckCircle,
    iconColor: "text-emerald-100"
  },
  error: {
    bg: "bg-gradient-to-r from-red-500/90 to-red-600/90",
    border: "border-red-400/50",
    icon: AlertCircle,
    iconColor: "text-red-100"
  },
  warning: {
    bg: "bg-gradient-to-r from-amber-500/90 to-orange-600/90",
    border: "border-amber-400/50",
    icon: AlertCircle,
    iconColor: "text-amber-100"
  },
  info: {
    bg: "bg-gradient-to-r from-blue-500/90 to-cyan-600/90",
    border: "border-blue-400/50",
    icon: Info,
    iconColor: "text-blue-100"
  }
};

export default function Toast({ id, type, title, message, duration = 4000, onClose }: ToastProps) {
  const style = toastStyles[type];
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        relative flex items-start gap-3 p-4 rounded-xl border-2 backdrop-blur-xl shadow-2xl
        ${style.bg} ${style.border}
        min-w-[320px] max-w-[400px]
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${style.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white mb-1">
          {title}
        </h4>
        {message && (
          <p className="text-xs text-white/90 leading-relaxed">
            {message}
          </p>
        )}
      </div>

      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors duration-200"
      >
        <X className="w-4 h-4 text-white/80 hover:text-white" />
      </motion.button>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
      />
    </motion.div>
  );
}