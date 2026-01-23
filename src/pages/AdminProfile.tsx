import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, Shield, Calendar, MessageCircle, ExternalLink, Mail, 
  Users, CheckCircle, Trophy, Settings, Activity,
  Clock, AlertCircle, ThumbsUp, ThumbsDown, Eye
} from 'lucide-react';
import { getAdminById, type Admin } from '../data/admins';
import { getPendingApprovals, type PendingApproval } from '../data/pendingApprovals';
import AuthService from '../services/auth';

const AdminProfile: React.FC = () => {
  const { adminId } = useParams<{ adminId: string }>();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'activity'>('overview');

  const currentUser = AuthService.getCurrentUser();
  const isCurrentUser = currentUser?.username === adminId;
  const canViewDetails = currentUser?.type === 'admin' || isCurrentUser;

  useEffect(() => {
    if (adminId) {
      const foundAdmin = getAdminById(adminId);
      setAdmin(foundAdmin || null);
      
      // Load pending approvals
      const approvals = getPendingApprovals();
      setPendingApprovals(approvals);
    }
  }, [adminId]);

  const handleApproval = (approvalId: string, action: 'approve' | 'reject', notes?: string) => {
    // In a real implementation, this would call an API
    console.log(`${action} approval ${approvalId} with notes: ${notes}`);
    
    // Update local state for demo
    setPendingApprovals(prev => 
      prev.map(approval => 
        approval.id === approvalId 
          ? { 
              ...approval, 
              status: action === 'approve' ? 'approved' : 'rejected',
              reviewedBy: currentUser?.username || 'unknown',
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes
            }
          : approval
      )
    );
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Admin not found</div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Founder': return 'from-yellow-400 to-orange-500';
      case 'Admin': return 'from-blue-400 to-purple-500';
      case 'Mini Admin': return 'from-green-400 to-teal-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getApprovalTypeIcon = (type: string) => {
    switch (type) {
      case 'avatar': return <User className="w-4 h-4" />;
      case 'profile_update': return <Settings className="w-4 h-4" />;
      case 'registration': return <Users className="w-4 h-4" />;
      case 'name_change': return <MessageCircle className="w-4 h-4" />;
      case 'role_change': return <Shield className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-600">
                <img
                  src={admin.avatarUrl}
                  alt={`${admin.displayName}'s avatar`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/avatars/default.jpg';
                  }}
                />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${getRoleColor(admin.role)} flex items-center justify-center`}>
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold">{admin.displayName}</h1>
              <p className={`text-lg font-semibold bg-gradient-to-r ${getRoleColor(admin.role)} bg-clip-text text-transparent`}>
                {admin.role}
              </p>
              <p className="text-gray-400">@{admin.username}</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-2xl">{admin.bio}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
            { id: 'approvals', label: 'Pending Approvals', icon: <Clock className="w-4 h-4" /> },
            { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'approvals' && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Statistics
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{admin.stats.playersManaged}</div>
                    <div className="text-sm text-gray-400">Players Managed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{admin.stats.issuesResolved}</div>
                    <div className="text-sm text-gray-400">Issues Resolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{admin.stats.tournamentsOrganized}</div>
                    <div className="text-sm text-gray-400">Tournaments</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
                <div className="space-y-2">
                  {admin.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{responsibility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {admin.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {admin.contactInfo.discord && (
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm">{admin.contactInfo.discord}</span>
                    </div>
                  )}
                  {admin.contactInfo.steam && (
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                      <a 
                        href={admin.contactInfo.steam}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        Steam Profile
                      </a>
                    </div>
                  )}
                  {admin.contactInfo.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-red-400" />
                      <span className="text-sm">{admin.contactInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Admin Since</h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(admin.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              {canViewDetails && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Permissions</h2>
                  <div className="space-y-2">
                    {Object.entries(admin.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-400' : 'bg-red-400'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'approvals' && canViewDetails && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Pending Approvals ({pendingApprovals.length})</h2>
              
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getApprovalTypeIcon(approval.type)}
                          <div>
                            <h3 className="font-semibold">{approval.playerNickname}</h3>
                            <p className="text-sm text-gray-400 capitalize">
                              {approval.type.replace('_', ' ')} Request
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(approval.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Approval Details */}
                      <div className="mb-4 p-3 bg-gray-600 rounded">
                        {approval.type === 'avatar' && (
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-sm text-gray-300 mb-1">Current Avatar:</p>
                              <img 
                                src={approval.data.oldAvatarUrl} 
                                alt="Current" 
                                className="w-16 h-16 rounded-full"
                              />
                            </div>
                            <div>→</div>
                            <div>
                              <p className="text-sm text-gray-300 mb-1">New Avatar:</p>
                              <img 
                                src={approval.data.newAvatarUrl} 
                                alt="New" 
                                className="w-16 h-16 rounded-full"
                              />
                            </div>
                          </div>
                        )}

                        {approval.type === 'profile_update' && (
                          <div className="space-y-2">
                            {approval.data.changes?.map((change, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{change.field}:</span>
                                <span className="text-red-400 ml-2">{String(change.oldValue)}</span>
                                <span className="mx-2">→</span>
                                <span className="text-green-400">{String(change.newValue)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {approval.type === 'name_change' && (
                          <div className="text-sm">
                            <p><span className="font-medium">From:</span> {approval.data.nameChange?.oldNickname}</p>
                            <p><span className="font-medium">To:</span> {approval.data.nameChange?.newNickname}</p>
                            <p><span className="font-medium">Reason:</span> {approval.data.nameChange?.reason}</p>
                          </div>
                        )}

                        {approval.type === 'role_change' && (
                          <div className="text-sm space-y-2">
                            <div>
                              <span className="font-medium">Current Roles:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {approval.data.roleChange?.currentRoles.map((role, index) => (
                                  <span key={index} className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-xs">
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Requested Roles:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {approval.data.roleChange?.requestedRoles.map((role, index) => (
                                  <span key={index} className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs">
                                    #{index + 1} {role}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {approval.data.roleChange?.reason && (
                              <p><span className="font-medium">Reason:</span> {approval.data.roleChange.reason}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproval(approval.id, 'approve', 'Approved by admin')}
                          className="flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleApproval(approval.id, 'reject', 'Rejected by admin')}
                          className="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded transition-colors">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* Mock activity data */}
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm">Approved avatar change for player "Irene"</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm">Updated tournament schedule for Season 5</p>
                  <p className="text-xs text-gray-400">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm">Resolved dispute between Team Alpha and Team Beta</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;