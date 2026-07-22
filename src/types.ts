export interface IPInfo {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  isp: string;
  org?: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  isDatacenter: boolean;
  simulated?: boolean;
  status: 'ALLOWED' | 'REGION_NOT_SUPPORTED' | 'VPN_NOT_SUPPORTED';
  checkedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  earnedTotalUsd: number;
  country: string;
  zipCode: string;
  joinedAt: string;
  completedVideoIds: string[];
  completedDealIds: string[];
  dailyStreak: number;
  lastCheckIn: string | null;
  role: 'user' | 'admin';
}

export interface Video {
  id: string;
  title: string;
  category: string;
  rewardPoints: number;
  durationSeconds: number;
  thumbnailUrl: string;
  videoUrl: string;
  viewsCount: number;
  description: string;
  uploader: string;
}

export interface Deal {
  id: string;
  title: string;
  category: string;
  rewardPoints: number;
  iconName: string;
  description: string;
  actionUrl: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedMinutes: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  method: 'PayPal' | 'Cash App' | 'Venmo' | 'Bitcoin' | 'Amazon Gift Card';
  accountDetail: string;
  amountUsd: number;
  pointsSpent: number;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  requestedAt: string;
}

export interface IPLog {
  id: string;
  ip: string;
  userEmail: string;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  isVpn: boolean;
  status: 'ALLOWED' | 'BLOCKED_NON_USA' | 'BLOCKED_VPN';
  timestamp: string;
}

export type TabType = 'VIDEOS' | 'EARNINGS' | 'DEALS' | 'ADMIN';
