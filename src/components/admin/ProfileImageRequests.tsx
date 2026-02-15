import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react';
import profileImageService, { type ProfileImageUpdate } from '../../services/profileImageService';
import { useModal } from '../../hooks/useModal';

interface ProfileImageRequestsProps {
  adminUsername: string;
}

export const ProfileImageRequests = ({ adminUsername }: ProfileImageRequestsProps) => {
  const { confirm, alert, ModalComponent } = useModal();
  const [requests, setRequests] = useState<ProfileImageUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();

    // Subscribe to real-time updates
    const subscription = profileImageService.subscribeToImageUpdates(() => {
      loadRequests();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadRequests = async () => {
    const data = await profileImageService.getPendingRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleApprove = async (request: ProfileImageUpdate) => {
    const confirmed = await confirm(
      `Approve profile image update for ${request.user_id}?`,
      'Approve Request'
    );

    if (!confirmed) return;

    setProcessingId(request.id);
    const result = await profileImageService.approveRequest(request.id, adminUsername);

    if (result.success) {
      await alert('Request approved successfully! The user\'s avatar has been updated.', 'Success', 'success');
      loadRequests();
    } else {
      await alert(result.error || 'Failed to approve request', 'Error', 'warning');
    }

    setProcessingId(null);
  };

  const handleReject = async (request: ProfileImageUpdate) => {
    const confirmed = await confirm(
      `Reject profile image update for ${request.user_id}?\n\nPlease provide a reason:`,
      'Reject Request'
    );

    if (!confirmed) return;

    // In a real implementation, you'd have an input field for the reason
    const reason = 'Inappropriate image or does not meet guidelines';

    setProcessingId(request.id);
    const result = await profileImageService.rejectRequest(request.id, adminUsername, reason);

    if (result.success) {
      await alert('Request rejected', 'Rejected', 'warning');
      loadRequests();
    } else {
      await alert(result.error || 'Failed to reject request', 'Error', 'warning');
    }

    setProcessingId(null);
  };

  const handleDelete = async (request: ProfileImageUpdate) => {
    const confirmed = await confirm(
      `Delete this request permanently?`,
      'Delete Request'
    );

    if (!confirmed) return;

    setProcessingId(request.id);
    const result = await profileImageService.deleteRequest(request.id);

    if (result.success) {
      await alert('Request deleted', 'Deleted', 'success');
      loadRequests();
    } else {
      await alert(result.error || 'Failed to delete request', 'Error', 'warning');
    }

    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <ModalComponent />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Image Requests</h2>
        <p className="text-gray-400">Review and approve player profile image updates</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No pending requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
            >
              {/* User Info */}
              <div className="mb-4">
                <p className="text-white font-semibold">{request.user_id}</p>
                <p className="text-gray-400 text-sm capitalize">{request.user_type}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(request.requested_at).toLocaleString()}
                </p>
              </div>

              {/* Image Comparison */}
              <div className="mb-4">
                <div className="flex items-center justify-around gap-4">
                  {/* Current Image */}
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-2">Current</p>
                    <img
                      src={request.current_image_url || '/avatars/default.jpg'}
                      alt="Current"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                      onError={(e) => {
                        e.currentTarget.src = '/avatars/default.jpg';
                      }}
                    />
                  </div>

                  {/* Arrow */}
                  <div className="text-purple-400">→</div>

                  {/* New Image */}
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-2">New</p>
                    <img
                      src={request.new_image_url}
                      alt="New"
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                      onError={(e) => {
                        e.currentTarget.src = '/avatars/default.jpg';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Image Type Badge */}
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                  {request.image_type === 'upload' ? '📤 Upload' : '🔗 Link'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(request)}
                  disabled={processingId === request.id}
                  className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  {processingId === request.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleReject(request)}
                  disabled={processingId === request.id}
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(request)}
                  disabled={processingId === request.id}
                  className="py-2 px-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
