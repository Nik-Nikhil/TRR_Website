export interface PendingApproval {
  id: string;
  type: 'avatar' | 'profile_update' | 'registration' | 'name_change' | 'role_change';
  playerId: string;
  playerNickname: string;
  submittedAt: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  data: {
    // For avatar approvals
    newAvatarUrl?: string;
    oldAvatarUrl?: string;
    
    // For profile updates
    changes?: {
      field: string;
      oldValue: any;
      newValue: any;
    }[];
    
    // For registrations
    registrationData?: {
      nickname: string;
      steamId: string;
      email?: string;
    };
    
    // For name changes
    nameChange?: {
      oldNickname: string;
      newNickname: string;
      reason: string;
    };

    // For role changes
    roleChange?: {
      currentRoles: string[];
      requestedRoles: string[];
      reason?: string;
    };
  };
}

// Mock pending approvals for demonstration
export const pendingApprovals: PendingApproval[] = [
  {
    id: 'approval_001',
    type: 'avatar',
    playerId: 'reyuk',
    playerNickname: 'Reyuk',
    submittedAt: '2024-01-17T10:30:00Z',
    submittedBy: 'reyuk',
    status: 'pending',
    data: {
      newAvatarUrl: '/avatars/pending/reyuk_new.jpg',
      oldAvatarUrl: '/avatars/ryuk.jpg'
    }
  },
  {
    id: 'approval_002',
    type: 'profile_update',
    playerId: 'rocker',
    playerNickname: 'RockeR',
    submittedAt: '2024-01-17T09:15:00Z',
    submittedBy: 'rocker',
    status: 'pending',
    data: {
      changes: [
        {
          field: 'currentMMR',
          oldValue: 6500,
          newValue: 6750
        },
        {
          field: 'currentMedalLabel',
          oldValue: 'Immortal',
          newValue: 'Immortal Rank 500'
        }
      ]
    }
  },
  {
    id: 'approval_003',
    type: 'registration',
    playerId: 'new_player_001',
    playerNickname: 'NewPlayer123',
    submittedAt: '2024-01-17T08:45:00Z',
    submittedBy: 'new_player_001',
    status: 'pending',
    data: {
      registrationData: {
        nickname: 'NewPlayer123',
        steamId: '76561198123456789',
        email: 'newplayer@example.com'
      }
    }
  },
  {
    id: 'approval_004',
    type: 'name_change',
    playerId: 'phola',
    playerNickname: 'Phola',
    submittedAt: '2024-01-17T07:20:00Z',
    submittedBy: 'phola',
    status: 'pending',
    data: {
      nameChange: {
        oldNickname: 'Phola',
        newNickname: 'PholaGaming',
        reason: 'Rebranding for streaming'
      }
    }
  },
  {
    id: 'approval_005',
    type: 'role_change',
    playerId: 'reyuk',
    playerNickname: 'Reyuk',
    submittedAt: '2024-01-17T11:00:00Z',
    submittedBy: 'reyuk',
    status: 'pending',
    data: {
      roleChange: {
        currentRoles: ['Soft Support', 'Hard Support'],
        requestedRoles: ['Mid', 'Offlane', 'Soft Support'],
        reason: 'Want to transition to core roles'
      }
    }
  },
  {
    id: 'approval_006',
    type: 'avatar',
    playerId: 'irene',
    playerNickname: 'Irene',
    submittedAt: '2024-01-16T16:30:00Z',
    submittedBy: 'irene',
    status: 'approved',
    reviewedBy: 'r3ciprocal',
    reviewedAt: '2024-01-16T18:45:00Z',
    reviewNotes: 'Avatar approved - appropriate content',
    data: {
      newAvatarUrl: '/avatars/Irene.jpg',
      oldAvatarUrl: '/avatars/default.jpg'
    }
  }
];

export function getPendingApprovals(): PendingApproval[] {
  return pendingApprovals.filter(approval => approval.status === 'pending');
}

export function getApprovalById(id: string): PendingApproval | undefined {
  return pendingApprovals.find(approval => approval.id === id);
}

export function getApprovalsByType(type: PendingApproval['type']): PendingApproval[] {
  return pendingApprovals.filter(approval => approval.type === type);
}

export function getApprovalsByPlayer(playerId: string): PendingApproval[] {
  return pendingApprovals.filter(approval => approval.playerId === playerId);
}