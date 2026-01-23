export interface Admin {
  id: string;
  username: string;
  displayName: string;
  role: 'Founder' | 'Admin' | 'Mini Admin';
  avatarUrl: string;
  bio: string;
  joinDate: string;
  responsibilities: string[];
  specializations: string[];
  contactInfo: {
    discord?: string;
    steam?: string;
    email?: string;
  };
  stats: {
    playersManaged: number;
    issuesResolved: number;
    tournamentsOrganized: number;
  };
  permissions: {
    manageUsers: boolean;
    manageTournaments: boolean;
    manageContent: boolean;
    viewAnalytics: boolean;
    systemAdmin: boolean;
  };
}

export const admins: Admin[] = [
  {
    id: 'reyuk',
    username: 'reyuk',
    displayName: 'Reyuk',
    role: 'Founder',
    avatarUrl: '/avatars/admins/reyuk.jpg',
    bio: 'Founder and lead organizer of The Roshan Rumble. Passionate about creating competitive Dota 2 experiences.',
    joinDate: '2023-01-01',
    responsibilities: ['Overall Tournament Management', 'Strategic Planning', 'Community Leadership'],
    specializations: ['Tournament Organization', 'Community Management', 'Strategic Planning'],
    contactInfo: {
      discord: 'reyuk#1234',
      steam: 'https://steamcommunity.com/id/reyuk'
    },
    stats: {
      playersManaged: 150,
      issuesResolved: 89,
      tournamentsOrganized: 5
    },
    permissions: {
      manageUsers: true,
      manageTournaments: true,
      manageContent: true,
      viewAnalytics: true,
      systemAdmin: true
    }
  },
  {
    id: 'r3ciprocal',
    username: 'r3ciprocal',
    displayName: 'r3ciprocal',
    role: 'Admin',
    avatarUrl: '/avatars/admins/r3ciprocal.jpg',
    bio: 'Senior administrator focused on player management and dispute resolution.',
    joinDate: '2023-02-15',
    responsibilities: ['Player Management', 'Dispute Resolution', 'Match Coordination'],
    specializations: ['Player Relations', 'Conflict Resolution', 'Match Management'],
    contactInfo: {
      discord: 'r3ciprocal#5678',
      steam: 'https://steamcommunity.com/id/r3ciprocal'
    },
    stats: {
      playersManaged: 120,
      issuesResolved: 67,
      tournamentsOrganized: 3
    },
    permissions: {
      manageUsers: true,
      manageTournaments: true,
      manageContent: true,
      viewAnalytics: true,
      systemAdmin: false
    }
  },
  {
    id: 'frost',
    username: 'frost',
    displayName: 'Frost',
    role: 'Admin',
    avatarUrl: '/avatars/admins/frost.jpg',
    bio: 'Technical administrator handling system maintenance and data management.',
    joinDate: '2023-03-01',
    responsibilities: ['System Maintenance', 'Data Management', 'Technical Support'],
    specializations: ['System Administration', 'Database Management', 'Technical Support'],
    contactInfo: {
      discord: 'frost#9012',
      steam: 'https://steamcommunity.com/id/frost'
    },
    stats: {
      playersManaged: 95,
      issuesResolved: 78,
      tournamentsOrganized: 2
    },
    permissions: {
      manageUsers: true,
      manageTournaments: false,
      manageContent: true,
      viewAnalytics: true,
      systemAdmin: true
    }
  },
  {
    id: 'machine',
    username: 'machine',
    displayName: 'Machine',
    role: 'Admin',
    avatarUrl: '/avatars/admins/machine.jpg',
    bio: 'Content moderator and community engagement specialist.',
    joinDate: '2023-04-10',
    responsibilities: ['Content Moderation', 'Community Engagement', 'Social Media'],
    specializations: ['Content Management', 'Community Engagement', 'Social Media'],
    contactInfo: {
      discord: 'machine#3456',
      steam: 'https://steamcommunity.com/id/machine'
    },
    stats: {
      playersManaged: 85,
      issuesResolved: 45,
      tournamentsOrganized: 1
    },
    permissions: {
      manageUsers: true,
      manageTournaments: false,
      manageContent: true,
      viewAnalytics: false,
      systemAdmin: false
    }
  },
  {
    id: 'godspeed',
    username: 'godspeed',
    displayName: 'Godspeed',
    role: 'Admin',
    avatarUrl: '/avatars/admins/godspeed.jpg',
    bio: 'Match coordinator and scheduling specialist.',
    joinDate: '2023-05-20',
    responsibilities: ['Match Scheduling', 'Team Coordination', 'Results Management'],
    specializations: ['Match Coordination', 'Scheduling', 'Team Management'],
    contactInfo: {
      discord: 'godspeed#7890',
      steam: 'https://steamcommunity.com/id/godspeed'
    },
    stats: {
      playersManaged: 110,
      issuesResolved: 52,
      tournamentsOrganized: 2
    },
    permissions: {
      manageUsers: true,
      manageTournaments: true,
      manageContent: false,
      viewAnalytics: true,
      systemAdmin: false
    }
  },
  {
    id: 'slowfast',
    username: 'slowfast',
    displayName: 'SlowFast',
    role: 'Admin',
    avatarUrl: '/avatars/admins/slowfast.jpg',
    bio: 'Test administrator for system validation and quality assurance.',
    joinDate: '2024-01-17',
    responsibilities: ['System Testing', 'Quality Assurance', 'Feature Validation'],
    specializations: ['Testing', 'QA', 'System Validation'],
    contactInfo: {
      discord: 'slowfast#1111',
      steam: 'https://steamcommunity.com/id/slowfast'
    },
    stats: {
      playersManaged: 25,
      issuesResolved: 15,
      tournamentsOrganized: 0
    },
    permissions: {
      manageUsers: true,
      manageTournaments: true,
      manageContent: true,
      viewAnalytics: true,
      systemAdmin: false
    }
  },
  {
    id: 'banner',
    username: 'banner',
    displayName: 'Banner',
    role: 'Mini Admin',
    avatarUrl: '/avatars/admins/banner.jpg',
    bio: 'Assistant moderator helping with daily operations.',
    joinDate: '2023-06-15',
    responsibilities: ['Player Support', 'Basic Moderation', 'Event Assistance'],
    specializations: ['Player Support', 'Event Management'],
    contactInfo: {
      discord: 'banner#2222'
    },
    stats: {
      playersManaged: 45,
      issuesResolved: 23,
      tournamentsOrganized: 0
    },
    permissions: {
      manageUsers: false,
      manageTournaments: false,
      manageContent: false,
      viewAnalytics: false,
      systemAdmin: false
    }
  },
  {
    id: 'insanekid',
    username: 'insanekid',
    displayName: 'InsaneKid',
    role: 'Mini Admin',
    avatarUrl: '/avatars/admins/insanekid.jpg',
    bio: 'Community helper focused on new player onboarding.',
    joinDate: '2023-07-01',
    responsibilities: ['New Player Support', 'Registration Help', 'Basic Queries'],
    specializations: ['Player Onboarding', 'Registration Support'],
    contactInfo: {
      discord: 'insanekid#3333'
    },
    stats: {
      playersManaged: 35,
      issuesResolved: 18,
      tournamentsOrganized: 0
    },
    permissions: {
      manageUsers: false,
      manageTournaments: false,
      manageContent: false,
      viewAnalytics: false,
      systemAdmin: false
    }
  }
];

export function getAdminById(id: string): Admin | undefined {
  return admins.find(admin => admin.id === id);
}

export function getAdminByUsername(username: string): Admin | undefined {
  return admins.find(admin => admin.username === username);
}

export function getAdminsByRole(role: Admin['role']): Admin[] {
  return admins.filter(admin => admin.role === role);
}