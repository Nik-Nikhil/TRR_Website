import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, UserX, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import profileUpdateService, { type ProfileUpdateRequest } from '../../services/profileUpdateService';
import { AuthService } from '../../services/auth';
import { useModal } from '../../hooks/useModal';

export const ProfileUpdateRequests = () => {
  const { confirm, alert, ModalComponent } = useModal();
  const [requests, setRequests] = useState<ProfileUpdateRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const allRequests = profileUpdateService.getAllRequests();
    setRequests(allRequests);
  };

  const handleApprove = async (request: ProfileUpdateRequest) => {
    const confirmed = await confirm(
      `Approve profile update for ${request.playerNickname}?\n\nThis will apply the following changes:\n${request.changes.map(c => `• ${c.field}: "${c.oldValue}" → "${c.newValue}"`).join('\n')}`,
      'Approve Update'
    );

    if (!confirmed) return;

    const admin = AuthService.getCurrentAdminSession();
    const success = profileUpdateService.approveRequest(request.id, admin?.username || 'admin');

    if (success) {
      await alert('Profile update approved and applied!', 'Success', 'success');
      loadRequests();
    } else {
      await alert('Failed to approve request', 'Error', 'warning');
    }
  };

  const handleReject = async (request: ProfileUpdateRequest) => {
    const confirmed = await confirm(
      `Reject profile update for ${request.playerNickname}?\n\nThe changes will not be applied.`,
      'Reject Update'
    );

    if (!confirmed) return;

    const admin = AuthService.getCurrentAdminSession();
    const success = profileUpdateService.rejectRequest(request.id, admin?.username || 'admin');

    if (success) {
      await alert('Profile update rejected', 'Rejected', 'info');
      loadRequests();
    } else {
      await alert('Failed to reject request', 'Error', 'warning');
    }
  };

  const handleDelete = async (request: ProfileUpdateRequest) => {
    const confirmed = await confirm(
      `Delete this request from ${request.playerNickname}?`,
      'Delete Request'
    );

    if (!confirmed) return;

    const success = profileUpdateService.deleteRequest(request.id);

    if (success) {
      await alert('Request deleted', 'Deleted', 'success');
      loadRequests();
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <ModalComponent />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-black/40 text-gray-400 hover:bg-black/60'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && profileUpdateService.getPendingCount() > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {profileUpdateService.getPendingCount()}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-gray-500/40 text-center">
          <UserCheck className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No {filter !== 'all' ? filter : ''} requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{request.playerNickname}</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(request.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span className="text-sm font-semibold">{request.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Changes */}
              <div className="bg-black/40 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm font-semibold mb-2">Requested Changes:</p>
                <div className="space-y-2">
                  {request.changes.map((change, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-purple-400 font-semibold min-w-[100px]">
                        {change.field}:
                      </span>
                      <span className="text-red-400 line-through">{change.oldValue || '(empty)'}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-green-400">{change.newValue || '(empty)'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Info */}
              {request.status !== 'pending' && request.reviewedBy && (
                <div className="bg-black/40 rounded-lg p-3 mb-4 text-sm">
                  <span className="text-gray-400">Reviewed by: </span>
                  <span className="text-white font-semibold">{request.reviewedBy}</span>
                  <span className="text-gray-500 ml-2">
                    on {request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(request)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 rounded-lg font-semibold transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg font-semibold transition-colors"
                    >
                      <UserX className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(request)}
                  className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 text-gray-300 rounded-lg font-semibold transition-colors"
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
