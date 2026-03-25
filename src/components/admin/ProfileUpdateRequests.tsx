import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, UserX, Clock, CheckCircle, XCircle, Trash2, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AuthService } from '../../services/auth';
import { useModal } from '../../hooks/useModal';

interface RoleRequest {
  id: string;
  player_id: string;
  player_nickname: string;
  current_roles: string[];
  requested_roles: string[];
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  requested_at: string;
  type: 'role';
}

export const ProfileUpdateRequests = () => {
  const { confirm, alert, ModalComponent } = useModal();
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('role_change_requests')
      .select('*')
      .order('requested_at', { ascending: false });

    if (!error && data) {
      setRequests(data.map(r => ({ ...r, type: 'role' as const })));
    }
    setLoading(false);
  };

  const handleApprove = async (req: RoleRequest) => {
    const confirmed = await confirm(
      `Approve role change for ${req.player_nickname}?\n\nNew roles: ${req.requested_roles.join(', ')}`,
      'Approve Role Change'
    );
    if (!confirmed) return;

    const admin = AuthService.getCurrentAdminSession();

    // Apply roles to players table
    const { error: applyErr } = await supabase
      .from('players')
      .update({
        roles: req.requested_roles.map((label, i) => ({ label, iconSrc: `/icons/pos_${i + 1}.png` })),
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.player_id);

    if (applyErr) {
      await alert('Failed to apply role changes: ' + applyErr.message, 'Error', 'warning');
      return;
    }

    const { error } = await supabase
      .from('role_change_requests')
      .update({ status: 'approved', reviewed_by: admin?.username || 'admin', reviewed_at: new Date().toISOString() })
      .eq('id', req.id);

    if (error) { await alert('Failed to update request', 'Error', 'warning'); return; }
    await alert('Role change approved and applied!', 'Success', 'success');
    loadRequests();
  };

  const handleReject = async (req: RoleRequest) => {
    const confirmed = await confirm(
      `Reject role change for ${req.player_nickname}?`,
      'Reject Role Change'
    );
    if (!confirmed) return;

    const admin = AuthService.getCurrentAdminSession();
    const { error } = await supabase
      .from('role_change_requests')
      .update({ status: 'rejected', reviewed_by: admin?.username || 'admin', reviewed_at: new Date().toISOString() })
      .eq('id', req.id);

    if (error) { await alert('Failed to reject request', 'Error', 'warning'); return; }
    await alert('Role change rejected', 'Rejected', 'info');
    loadRequests();
  };

  const handleDelete = async (req: RoleRequest) => {
    const confirmed = await confirm(`Delete this request from ${req.player_nickname}?`, 'Delete');
    if (!confirmed) return;

    await supabase.from('role_change_requests').delete().eq('id', req.id);
    loadRequests();
  };

  const filtered = requests.filter(r => filter === 'all' || r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const statusStyle = (s: string) => {
    if (s === 'pending') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
    if (s === 'approved') return 'text-green-400 bg-green-500/20 border-green-500/50';
    return 'text-red-400 bg-red-500/20 border-red-500/50';
  };

  return (
    <div className="space-y-6">
      <ModalComponent />

      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === f ? 'bg-purple-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-black/60'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-gray-500/40 text-center">
          <UserCheck className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No {filter !== 'all' ? filter : ''} requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 shadow-lg">

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <h3 className="text-white font-bold text-lg">{req.player_nickname}</h3>
                    <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">Role Change</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">
                    {new Date(req.requested_at).toLocaleString()}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${statusStyle(req.status)}`}>
                  {req.status === 'pending' ? <Clock className="w-4 h-4" /> : req.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span className="text-sm font-semibold">{req.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="bg-black/40 rounded-lg p-4 mb-4 space-y-2">
                <div className="text-sm">
                  <span className="text-gray-400 font-semibold">Current roles: </span>
                  <span className="text-red-300">{req.current_roles?.join(', ') || '—'}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400 font-semibold">Requested roles: </span>
                  <span className="text-green-300">{req.requested_roles?.join(', ') || '—'}</span>
                </div>
                {req.reason && (
                  <div className="text-sm">
                    <span className="text-gray-400 font-semibold">Reason: </span>
                    <span className="text-gray-200">{req.reason}</span>
                  </div>
                )}
              </div>

              {req.status !== 'pending' && req.reviewed_by && (
                <div className="bg-black/40 rounded-lg p-3 mb-4 text-sm">
                  <span className="text-gray-400">Reviewed by </span>
                  <span className="text-white font-semibold">{req.reviewed_by}</span>
                  {req.reviewed_at && <span className="text-gray-500 ml-2">on {new Date(req.reviewed_at).toLocaleString()}</span>}
                </div>
              )}

              <div className="flex gap-2">
                {req.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(req)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 rounded-lg font-semibold transition-colors">
                      <UserCheck className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleReject(req)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg font-semibold transition-colors">
                      <UserX className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(req)}
                  className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 text-gray-300 rounded-lg font-semibold transition-colors">
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
