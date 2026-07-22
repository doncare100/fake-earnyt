import { Video, Deal, User, IPLog } from './types';

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    title: 'TikTok comment section',
    category: 'Social Media',
    rewardPoints: 150,
    durationSeconds: 45,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    viewsCount: 14200,
    description: 'A hilarious breakdown of the most unexpected comments on viral TikTok posts.',
    uploader: 'TrendSpotted'
  },
  {
    id: 'vid-2',
    title: 'Top 10 Tech Gadgets You Need in 2026',
    category: 'Technology',
    rewardPoints: 220,
    durationSeconds: 60,
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1',
    viewsCount: 28900,
    description: 'Explore the latest productivity gadgets and futuristic tech accessories.',
    uploader: 'TechPulse'
  },
  {
    id: 'vid-3',
    title: 'How to Monetize Content on YouTube Shorts',
    category: 'Education',
    rewardPoints: 180,
    durationSeconds: 50,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1',
    viewsCount: 19500,
    description: 'Step-by-step strategy for growing a short-form video channel from scratch.',
    uploader: 'CreatorAcademy'
  },
  {
    id: 'vid-4',
    title: 'Secrets to Earning Side Income Online in USA',
    category: 'Finance',
    rewardPoints: 250,
    durationSeconds: 75,
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1',
    viewsCount: 35100,
    description: 'Verified methods for generating supplementary revenue using digital skills.',
    uploader: 'FinanceHacks'
  },
  {
    id: 'vid-5',
    title: 'AI Tools Every Digital Creator Should Use',
    category: 'AI & Software',
    rewardPoints: 300,
    durationSeconds: 90,
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1',
    viewsCount: 42000,
    description: 'Boost your video workflow using modern artificial intelligence assistants.',
    uploader: 'FutureTech'
  }
];

export const INITIAL_COMPLETED_VIDEOS: Video[] = [
  {
    id: 'vid-comp-1',
    title: 'Welcome to earnyt: Getting Started Guide',
    category: 'Onboarding',
    rewardPoints: 100,
    durationSeconds: 30,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1',
    viewsCount: 98000,
    description: 'Quick walkthrough on how to earn points and cash out rewards on earnyt.',
    uploader: 'earnyt Official'
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-1',
    title: 'Install & Play Coin Master - Reach Village Level 10',
    category: 'Gaming',
    rewardPoints: 2500,
    iconName: 'Gamepad2',
    description: 'Download Coin Master on Android or iOS, spin, raid, and build your village to Level 10 to receive 2,500 points ($2.50).',
    actionUrl: '#',
    difficulty: 'Easy',
    estimatedMinutes: 20
  },
  {
    id: 'deal-2',
    title: 'Complete US Consumer Sentiment Survey 2026',
    category: 'Surveys',
    rewardPoints: 1200,
    iconName: 'FileCheck',
    description: 'Share your shopping preferences in this 10-minute opinion research study for US residents.',
    actionUrl: '#',
    difficulty: 'Easy',
    estimatedMinutes: 10
  },
  {
    id: 'deal-3',
    title: 'Sign Up for Rakuten & Make a $10 Purchase',
    category: 'Cashback',
    rewardPoints: 5000,
    iconName: 'ShoppingBag',
    description: 'Create a free Rakuten account, make any purchase of $10 or more to get 5,000 earnyt points ($5.00) plus Rakuten cash back.',
    actionUrl: '#',
    difficulty: 'Medium',
    estimatedMinutes: 15
  },
  {
    id: 'deal-4',
    title: 'Try Cash App Card Activation',
    category: 'Finance',
    rewardPoints: 3500,
    iconName: 'CreditCard',
    description: 'Order your free Cash App card and complete first transaction to qualify for 3,500 points.',
    actionUrl: '#',
    difficulty: 'Medium',
    estimatedMinutes: 10
  }
];

export const DEMO_USER: User = {
  id: 'usr-101',
  name: 'Alex Morgan',
  email: 'alex.morgan@us-earner.com',
  points: 0,
  earnedTotalUsd: 0.00,
  country: 'United States',
  zipCode: '10001',
  joinedAt: '2026-06-15',
  completedVideoIds: ['vid-comp-1'],
  completedDealIds: [],
  dailyStreak: 3,
  lastCheckIn: '2026-07-22',
  role: 'user'
};

export const INITIAL_IP_LOGS: IPLog[] = [
  {
    id: 'log-1',
    ip: '172.56.21.84',
    userEmail: 'alex.morgan@us-earner.com',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    isp: 'Verizon Wireless',
    isVpn: false,
    status: 'ALLOWED',
    timestamp: '2026-07-22 08:55:12'
  },
  {
    id: 'log-2',
    ip: '185.220.101.5',
    userEmail: 'unknown_guest@vpn.net',
    country: 'United States',
    countryCode: 'US',
    city: 'Los Angeles',
    isp: 'NordVPN Datacenter',
    isVpn: true,
    status: 'BLOCKED_VPN',
    timestamp: '2026-07-22 08:50:04'
  },
  {
    id: 'log-3',
    ip: '102.89.23.14',
    userEmail: 'john.doe@ukmail.co.uk',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    isp: 'Vodafone UK',
    isVpn: false,
    status: 'BLOCKED_NON_USA',
    timestamp: '2026-07-22 08:42:30'
  }
];
