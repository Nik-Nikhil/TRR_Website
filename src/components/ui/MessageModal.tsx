import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, MessageSquare } from 'lucide-react';
import messagingService from '../../services/messagingService';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminName: string;
  adminDisplayName: string;
}

export default function MessageModal({ isOpen, onClose, adminName, adminDisplayName }: MessageModalProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [playerNickname, setPlayerNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerNickname.trim() || !subject.trim() || !content.trim()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await messagingService.sendMessage({
        fromPlayer: playerNickname.toLowerCase().replace(/\s+/g, ''),
        fromPlayerNickname: playerNickname.trim(),
        toAdmin: adminName.toLowerCase(),
        subject: subject.trim(),
        content: content.trim(),
        priority
      });

      if (success) {
        setSubmitStatus('success');
        // Reset form
        setSubject('');
        setContent('');
        setPlayerNickname('');
        setPriority('medium');
        
        // Close modal after a brief delay
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 1500);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitStatus('idle');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-black/90 border border-purple-500/40 rounded-2xl p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Message Admin</h3>
                  <p className="text-sm text-purple-300">{adminDisplayName}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success/Error Status */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-green-900/40 border border-green-500/50 rounded-lg flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">Message sent successfully!</span>
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-300">Please fill in all fields</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Player Nickname */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Your Nickname *
                </label>
                <input
                  type="text"
                  value={playerNickname}
                  onChange={(e) => setPlayerNickname(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your player nickname"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={isSubmitting}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Brief description of your message"
                  required
                  disabled={isSubmitting}
                  maxLength={100}
                />
                <p className="text-xs text-gray-400 mt-1">{subject.length}/100 characters</p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Describe your issue, question, or feedback in detail..."
                  required
                  disabled={isSubmitting}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">{content.length}/500 characters</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !playerNickname.trim() || !subject.trim() || !content.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <p className="text-xs text-purple-300">
                Your message will be sent directly to {adminDisplayName}'s dashboard. 
                Please be respectful and provide clear details about your inquiry.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}