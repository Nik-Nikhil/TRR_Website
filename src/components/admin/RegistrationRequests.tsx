import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, CheckCircle, XCircle, Clock, 
  AlertTriangle, Image as ImageIcon} from 'lucide-react';
import registrationRequestService from '../../services/registrationRequestService';
import type { RegistrationRequest } from '../../services/registrationRequestService';

interface RegistrationRequestsProps {
  adminUsername: string;
}

export function RegistrationRequests({ adminUsername }: RegistrationRequestsProps) {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'denied' | 'all'>('pending');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();

    // Subscribe to real-time updates
    const channel = registrationRequestService.subscribeToRequests(() => {
      loadRequests();
    });

    return () => {
      import('../../lib/supabase').then(({ supabase }) => {
        supabase.removeChannel(channel);
      });
    };
  }, [filter]);

  const loadRequests = async () => {
    setLoading(true);
    const data = filter === 'all' 
      ? await registrationRequestService.getAllRequests()
      : await registrationRequestService.getAllRequests(filter);
    setRequests(data);
    setLoading(false);
  };

  const handleApprove = async (request: RegistrationRequest) => {
    if (!confirm(`Approve registration for ${request.player_nickname}?`)) return;

    setProcessingId(request.id);
    const result = await registrationRequestService.approveRequest(request.id, adminUsername);
    
    if (result.success) {
      alert(`Registration approved for ${request.player_nickname}. Player added to auction pool.`);
      loadRequests();
    } else {
      alert(`Failed to approve: ${result.error}`);
    }
    setProcessingId(null);
  };

  const handleDeny = async () => {
    if (!selectedRequest || !denyReason.trim()) {
      alert('Please provide a reason for denial');
      return;
    }

    setProcessingId(selectedRequest.id);
    const result = await registrationRequestService.denyRequest(
      selectedRequest.id,
      adminUsername,
      denyReason
    );
    
    if (result.success) {
      alert(`Registration denied for ${selectedRequest.player_nickname}`);
      setShowDenyModal(false);
      setDenyReason('');
      setSelectedRequest(null);
      loadRequests();
    } else {
      alert(`Failed to deny: ${result.error}`);
    }
    setProcessingId(null);
  };

  const openDenyModal = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setShowDenyModal(true);
  };

  const getRoleName = (roleId: string) => {
    const roleMap: Record<string, string> = {
      'carry': 'Carry (Pos 1)',
      'mid': 'Mid (Pos 2)',
      'offlane': 'Offlane (Pos 3)',
      'support': 'Soft Support (Pos 4)',
      'hard-support': 'Hard Support (Pos 5)'
    };
    return roleMap[roleId] || roleId;
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-blue-500/40">
      {/* Header */}
      <div className="p-6 border-b border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <UserPlus className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Registration Requests</h3>
              <p className="text-sm text-gray-400">Review and approve player registrations</p>
            </div>
          </div>
          {pendingCount > 0 && (
            <span className="px-3 py-1 bg-orange-600 text-white text-sm rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {(['pending', 'approved', 'denied', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-600 text-white text-xs rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50 animate-spin" />
            <p>Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No {filter !== 'all' ? filter : ''} registration requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  request.status === 'pending'
                    ? 'bg-orange-900/20 border-orange-500/30'
                    : request.status === 'approved'
                    ? 'bg-green-900/20 border-green-500/30'
                    : 'bg-red-900/20 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{request.player_nickname}</h4>
                      <p className="text-sm text-gray-400">In-game: {request.in_game_name}</p>
                      <p className="text-xs text-gray-500">
                        Submitted {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    request.status === 'pending'
                      ? 'bg-orange-600 text-white'
                      : request.status === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>

                {/* Request Details */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-xs text-gray-400">Player Type</p>
                    <p className={`text-sm font-semibold ${
                      request.player_type === 'core' ? 'text-orange-400' : 'text-cyan-400'
                    }`}>
                      {request.player_type === 'core' ? 'Core Player' : 'Support Player'}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-xs text-gray-400">Discord</p>
                    <p className="text-sm text-white">{request.discord_username || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-xs text-gray-400">MMR</p>
                    <p className="text-sm text-white">{request.current_mmr || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-xs text-gray-400">Ping Range</p>
                    <p className="text-sm text-white">{request.ping_range || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <p className="text-xs text-gray-400">Captain</p>
                    <p className="text-sm text-white">
                      {request.is_captain_available ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {/* Roles */}
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2">Preferred Roles (in order):</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(request.selected_roles) && request.selected_roles.map((role, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs rounded"
                      >
                        {index + 1}. {getRoleName(role)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* MMR Proof */}
                {request.mmr_changed && request.mmr_proof_url && (
                  <div className="mb-3 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-300">MMR changed - proof uploaded</span>
                      <a
                        href={request.mmr_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        View Proof
                      </a>
                    </div>
                  </div>
                )}

                {/* Denial Info */}
                {request.status === 'denied' && request.denial_reason && (
                  <div className="mb-3 p-3 bg-red-900/20 border border-red-500/30 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-red-300 font-medium">Denial Reason:</p>
                        <p className="text-sm text-red-200">{request.denial_reason}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Denied by {request.denied_by} on {new Date(request.denied_at!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval Info */}
                {request.status === 'approved' && (
                  <div className="mb-3 p-2 bg-green-900/20 border border-green-500/30 rounded">
                    <p className="text-xs text-green-300">
                      Approved by {request.approved_by} on {new Date(request.approved_at!).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(request)}
                      disabled={processingId === request.id}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{processingId === request.id ? 'Processing...' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => openDenyModal(request)}
                      disabled={processingId === request.id}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Deny</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Deny Modal */}
      <AnimatePresence>
        {showDenyModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowDenyModal(false);
              setDenyReason('');
              setSelectedRequest(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-xl p-6 max-w-md w-full border border-red-500/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <XCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Deny Registration</h3>
              </div>

              <p className="text-gray-300 mb-4">
                Denying registration for <span className="font-semibold text-white">{selectedRequest.player_nickname}</span>
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason for Denial <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Explain why this registration is being denied..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeny}
                  disabled={!denyReason.trim() || processingId === selectedRequest.id}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {processingId === selectedRequest.id ? 'Processing...' : 'Confirm Denial'}
                </button>
                <button
                  onClick={() => {
                    setShowDenyModal(false);
                    setDenyReason('');
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
