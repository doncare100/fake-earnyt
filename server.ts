import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface IPCheckResponse {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  isp: string;
  isVpn: boolean;
  isProxy: boolean;
  status: 'ALLOWED' | 'REGION_NOT_SUPPORTED' | 'VPN_NOT_SUPPORTED';
  checkedAt: string;
  simulated?: boolean;
}

const app = express();
app.use(express.json());
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// In-memory data store for live app session
let mockUsers = [
  {
    id: 'usr-101',
    name: 'Alex Morgan',
    email: 'alex.morgan@us-earner.com',
    password: 'password123',
    points: 1250,
    earnedTotalUsd: 18.50,
    country: 'United States',
    zipCode: '10001',
    joinedAt: '2026-06-15',
    completedVideoIds: ['vid-comp-1'],
    completedDealIds: [],
    dailyStreak: 3,
    lastCheckIn: '2026-07-22',
    role: 'user'
  }
];

let mockIpLogs: {
  id: string;
  ip: string;
  userEmail: string;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  isVpn: boolean;
  status: 'ALLOWED' | 'BLOCKED_VPN' | 'BLOCKED_NON_USA';
  timestamp: string;
}[] = [
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
  }
];

let mockWithdrawals: any[] = [];

// Helper to determine IP address & Geolocation
async function resolveIPInfo(req: express.Request): Promise<IPCheckResponse> {
  const checkedAt = new Date().toISOString();

  // Extract raw client IP address from headers
  const forwarded = req.headers['x-forwarded-for'];
  let rawIp = typeof forwarded === 'string' 
    ? forwarded.split(',')[0].trim() 
    : (req.socket.remoteAddress || '127.0.0.1');

  if (rawIp === '::1' || rawIp === '127.0.0.1' || rawIp.startsWith('10.') || rawIp.startsWith('172.16.') || rawIp.startsWith('192.168.')) {
    // Return empty ip indicator so client-side direct geolocation can kick in if server is local container
    return {
      ip: '127.0.0.1',
      country: 'United States',
      countryCode: 'US',
      city: 'Local',
      region: 'Local',
      isp: 'Local Connection',
      isVpn: false,
      isProxy: false,
      status: 'ALLOWED',
      checkedAt
    };
  }

  try {
    // Attempt real IP lookup via ip-api
    const response = await fetch(`http://ip-api.com/json/${rawIp}?fields=status,message,country,countryCode,regionName,city,isp,org,mobile,proxy,hosting,query`);
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        const countryCode = data.countryCode || 'US';
        const isVpn = Boolean(data.proxy || data.hosting);
        
        let status: 'ALLOWED' | 'REGION_NOT_SUPPORTED' | 'VPN_NOT_SUPPORTED' = 'ALLOWED';
        if (countryCode !== 'US') {
          status = 'REGION_NOT_SUPPORTED';
        } else if (isVpn) {
          status = 'VPN_NOT_SUPPORTED';
        }

        return {
          ip: data.query || rawIp,
          country: data.country || 'United States',
          countryCode,
          city: data.city || 'Unknown',
          region: data.regionName || 'Unknown',
          isp: data.isp || data.org || 'Internet Provider',
          isVpn,
          isProxy: Boolean(data.proxy),
          status,
          checkedAt
        };
      }
    }
  } catch (err) {
    console.warn("IP API lookup warning:", err);
  }

  return {
    ip: rawIp,
    country: 'United States',
    countryCode: 'US',
    city: 'Unknown',
    region: 'Unknown',
    isp: 'ISP',
    isVpn: false,
    isProxy: false,
    status: 'ALLOWED',
    checkedAt
  };
}

// ---------------- API ENDPOINTS ----------------

// Real-time IP Tracking endpoint
app.get("/api/ip-check", async (req, res) => {
  const ipInfo = await resolveIPInfo(req);

  // Log entry for admin dashboard if valid public IP
  if (ipInfo.ip && ipInfo.ip !== '127.0.0.1') {
    const userEmail = (req.query.userEmail as string) || 'guest@earnyt.com';
    const newLog = {
      id: 'log-' + Date.now(),
      ip: ipInfo.ip,
      userEmail,
      country: ipInfo.country,
      countryCode: ipInfo.countryCode,
      city: ipInfo.city,
      isp: ipInfo.isp,
      isVpn: ipInfo.isVpn,
      status: ipInfo.status === 'ALLOWED' 
        ? 'ALLOWED' as const
        : ipInfo.status === 'VPN_NOT_SUPPORTED'
        ? 'BLOCKED_VPN' as const
        : 'BLOCKED_NON_USA' as const,
      timestamp: new Date().toLocaleString()
    };

    mockIpLogs.unshift(newLog);
    if (mockIpLogs.length > 50) mockIpLogs.pop();
  }

  res.json(ipInfo);
});

// Endpoint for client side to report real IP log
app.post("/api/ip-check/log", (req, res) => {
  const ipInfo = req.body;
  if (ipInfo && ipInfo.ip) {
    const newLog = {
      id: 'log-' + Date.now(),
      ip: ipInfo.ip,
      userEmail: 'guest@earnyt.com',
      country: ipInfo.country,
      countryCode: ipInfo.countryCode,
      city: ipInfo.city,
      isp: ipInfo.isp,
      isVpn: ipInfo.isVpn,
      status: ipInfo.status === 'ALLOWED' 
        ? 'ALLOWED' as const
        : ipInfo.status === 'VPN_NOT_SUPPORTED'
        ? 'BLOCKED_VPN' as const
        : 'BLOCKED_NON_USA' as const,
      timestamp: new Date().toLocaleString()
    };
    mockIpLogs.unshift(newLog);
    if (mockIpLogs.length > 50) mockIpLogs.pop();
  }
  res.json({ success: true });
});

// Register User
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, zipCode } = req.body;
  if (!name || !email || !password || !zipCode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existing = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    email,
    password,
    points: 0,
    earnedTotalUsd: 0,
    country: 'United States',
    zipCode,
    joinedAt: new Date().toISOString().split('T')[0],
    completedVideoIds: [],
    completedDealIds: [],
    dailyStreak: 1,
    lastCheckIn: new Date().toISOString().split('T')[0],
    role: 'user' as const
  };

  mockUsers.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword, message: "Account created successfully!" });
});

// Login User
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email.toLowerCase() === email?.toLowerCase() && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// Admin logs endpoint
app.get("/api/admin/ip-logs", (req, res) => {
  res.json(mockIpLogs);
});

// Admin users list endpoint
app.get("/api/admin/users", (req, res) => {
  const safeUsers = mockUsers.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

// Complete Video
app.post("/api/videos/complete", (req, res) => {
  const { userId, videoId, points } = req.body;
  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.completedVideoIds.includes(videoId)) {
    user.completedVideoIds.push(videoId);
    user.points += points;
    user.earnedTotalUsd += (points / 1000);
  }

  const { password, ...safeUser } = user;
  res.json({ user: safeUser, pointsAdded: points });
});

// Withdraw endpoint
app.post("/api/withdraw", (req, res) => {
  const { userId, method, accountDetail, amountUsd, pointsSpent } = req.body;
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.points < pointsSpent) {
    return res.status(400).json({ error: "Insufficient points balance" });
  }

  user.points -= pointsSpent;

  const withdrawal = {
    id: 'wd-' + Date.now(),
    userId: user.id,
    userName: user.name,
    method,
    accountDetail,
    amountUsd,
    pointsSpent,
    status: 'Pending',
    requestedAt: new Date().toISOString()
  };

  mockWithdrawals.unshift(withdrawal);
  const { password, ...safeUser } = user;
  res.json({ user: safeUser, withdrawal, message: "Withdrawal request submitted!" });
});

// ---------------- VITE MIDDLEWARE ----------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
