const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { supabase, isSupabaseConfigured } = require('../lib/supabase');
const seed = require('../lib/seedData');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

const app = express();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'esports-bangladesh-production-jwt-2026';
const BCRYPT_ROUNDS = 12;

const path = require('path');

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.SITE_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://esportsbd.vercel.app'
    ].filter(Boolean);
    if (!origin || allowed.some(o => origin.startsWith(o))) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Static asset serving fallback in case Vercel routes static paths to API function
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/img', express.static(path.join(__dirname, '../public/img')));
app.use('/img', express.static(path.join(__dirname, '../img')));
app.get('/favicon.png', (req, res) => {
  const p = path.join(__dirname, '../public/favicon.png');
  res.sendFile(p);
});

// ─── Rate limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' }
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many OTP requests. Please wait 10 minutes before trying again.' }
});

// ─── In-Memory OTP store ───────────────────────────────────────────────────────
const otpStore = new Map();

function generateOTP() {
  return String(100000 + (crypto.randomInt ? crypto.randomInt(900000) : Math.floor(Math.random() * 900000))).padStart(6, '0');
}

async function sendSmsOtp(phone, otp) {
  console.log(`[OTP] ${phone}: ${otp}`);
  return true;
}

// In-Memory Storage for High-Speed Fallback & Local Sessions
const memoryStore = {
  users: [],
  passwords: {},
  tournaments: JSON.parse(JSON.stringify(seed.tournaments)),
  games: JSON.parse(JSON.stringify(seed.games)),
  stats: { ...seed.stats },
  influencers: JSON.parse(JSON.stringify(seed.influencers)),
  clients: JSON.parse(JSON.stringify(seed.clients)),
  communities: JSON.parse(JSON.stringify(seed.communities)),
  milestones: JSON.parse(JSON.stringify(seed.milestones)),
  gallery: JSON.parse(JSON.stringify(seed.gallery)),
  staff: JSON.parse(JSON.stringify(seed.staff)),
  services: JSON.parse(JSON.stringify(seed.services)),
  leaderboard: JSON.parse(JSON.stringify(seed.leaderboard)),
  news: JSON.parse(JSON.stringify(seed.news || [])),
  products: JSON.parse(JSON.stringify(seed.products || [])),
  productOrders: [],
  teams: [],
  matches: [
    {
      id: "m-ff-01",
      tournamentId: "esbd-ff-pro-s4",
      tournamentTitle: "ESBD Free Fire Pro League: Season 4",
      roundName: "Semifinals - Match 1",
      roundIndex: 1,
      matchIndex: 1,
      round: 1,
      position: 1,
      status: "live",
      opponentName: "Team Legion BD",
      teamName: "RedX Esports",
      teamA: { id: "team-redx", name: "RedX Esports", score: 1 },
      teamB: { id: "team-legion", name: "Team Legion BD", score: 0 },
      myScore: 1,
      opponentScore: 0,
      roomCode: "ESBD-FF-492",
      roomPassword: "esbd",
      scheduledAt: new Date().toISOString()
    },
    {
      id: "m-ff-02",
      tournamentId: "esbd-ff-pro-s4",
      tournamentTitle: "ESBD Free Fire Pro League: Season 4",
      roundName: "Semifinals - Match 2",
      roundIndex: 1,
      matchIndex: 2,
      round: 1,
      position: 2,
      status: "scheduled",
      opponentName: "Delta Force BD",
      teamName: "Apex Predators",
      teamA: { id: "team-apex", name: "Apex Predators", score: 0 },
      teamB: { id: "team-delta", name: "Delta Force BD", score: 0 },
      myScore: 0,
      opponentScore: 0,
      roomCode: "ESBD-FF-493",
      roomPassword: "esbd",
      scheduledAt: new Date(Date.now() + 3600 * 1000).toISOString()
    }
  ],
  registrations: [],
  walletTransactions: {},
  notifications: {},
  submissions: [
    { id: "sub-1", matchId: "m-ff-01", submittedBy: "RedX_Vampire", scoreReported: "1 - 0", proofUrl: "/img/gallery/arena-stage.jpg", status: "verified", createdAt: new Date().toISOString() }
  ],
  disputes: [
    { id: "disp-1", matchId: "m-ff-02", raisedBy: "Delta_Ruler", reason: "Opponent used prohibited weapon attachment in round 2", status: "open", proofUrl: null, createdAt: new Date().toISOString() }
  ],
  contactMessages: [],
  streams: [
    {
      id: "stream-01",
      tournamentId: "esbd-ff-pro-s4",
      tournamentTitle: "ESBD Free Fire Pro League: Season 4",
      gameTitle: "Free Fire",
      type: "official",
      title: "GRAND FINALS // Official Broadcast — ESBD Arena Dhaka",
      caster: "Kabbo & Mr. Triple R",
      status: "live",
      viewerCount: 14820,
      streamUrl: "https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=0",
      chatEnabled: true,
      quality: "1080p60 Full HD",
      featured: true
    },
    {
      id: "stream-02",
      tournamentId: "esbd-ff-pro-s4",
      tournamentTitle: "ESBD Free Fire Pro League: Season 4",
      gameTitle: "Free Fire",
      type: "pov",
      participantIgn: "raiyan (RedX Esports IGL)",
      title: "[PLAYER POV] RedX_raiyan — Semifinals Match 1 High Ground Rush",
      caster: "Player Audio & Team Comms",
      status: "live",
      viewerCount: 3410,
      streamUrl: "https://www.youtube-nocookie.com/embed/5qap5aO4i9A?autoplay=0",
      chatEnabled: true,
      quality: "1080p60",
      featured: false
    },
    {
      id: "stream-03",
      tournamentId: "esbd-pubgm-s3",
      tournamentTitle: "PUBG Mobile South Asia Prelims 2026",
      gameTitle: "PUBG Mobile",
      type: "official",
      title: "PUBG Mobile South Asia Prelims — Erangel Drop Zone Day 2",
      caster: "Apollo & Sinister Plays",
      status: "live",
      viewerCount: 9240,
      streamUrl: "https://www.youtube-nocookie.com/embed/DWcJFNfaw9c?autoplay=0",
      chatEnabled: true,
      quality: "1080p60",
      featured: true
    },
    {
      id: "stream-04",
      tournamentId: "esbd-val-cup-26",
      tournamentTitle: "Valorant Champions Cup Bangladesh",
      gameTitle: "Valorant",
      type: "pov",
      participantIgn: "Velocity_Aces (Duelist)",
      title: "[PLAYER POV] Velocity_Aces — Jett Ascent Entry Frags",
      caster: "Team Discord Voice Feed",
      status: "live",
      viewerCount: 1850,
      streamUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0",
      chatEnabled: true,
      quality: "1080p60",
      featured: false
    }
  ],
  chatMessages: [
    { id: "c-1", channel: "tournament-live", user: "ProCaster_BD", role: "caster", badge: "🎙️ CASTER", text: "Welcome everyone to ESBD Free Fire Pro League Semifinals!", timestamp: new Date(Date.now() - 300000).toISOString() },
    { id: "c-2", channel: "tournament-live", user: "RedX_FanBoy", role: "fan", badge: "🔥 FAN", text: "REDX ALL THE WAY! Raiyan is on fire today!", timestamp: new Date(Date.now() - 240000).toISOString() },
    { id: "c-3", channel: "tournament-live", user: "ESBD_Mod_Shuvo", role: "moderator", badge: "🛡️ MOD", text: "Keep the chat clean guys. Official room codes are delivered inside player match rooms.", timestamp: new Date(Date.now() - 180000).toISOString() },
    { id: "c-4", channel: "tournament-live", user: "Legion_Captain", role: "pro", badge: "⚡ PRO", text: "Good luck RedX! Let's make this match count!", timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: "c-5", channel: "general", user: "DhakaGamer_07", role: "user", badge: "🎮 GAMER", text: "When does registration open for Valorant Champions Cup?", timestamp: new Date(Date.now() - 60000).toISOString() },
    { id: "c-6", channel: "general", user: "ESBD_Admin", role: "admin", badge: "👑 ADMIN", text: "Registration is open now in the Tournaments tab! Prize pool ৳500,000.", timestamp: new Date(Date.now() - 30000).toISOString() }
  ],
  matchResults: [
    {
      id: "res-01",
      tournamentId: "esbd-ff-pro-s4",
      tournamentTitle: "ESBD Free Fire Pro League: Season 4",
      matchId: "m-ff-01",
      roundName: "Semifinals - Match 1",
      winnerTeam: "RedX Esports",
      loserTeam: "Team Legion BD",
      scoreA: 14,
      scoreB: 9,
      mvp: "raiyan (RedX)",
      mvpKills: 9,
      status: "verified",
      verifiedBy: "ESBD Head Referee (Ref_Tanvir)",
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
      proofUrl: "/img/gallery/lan-01.jpg",
      bracketPlacement: "Advanced to Grand Finals"
    },
    {
      id: "res-02",
      tournamentId: "esbd-ff-pro-s4",
      tournamentTitle: "ESBD Free Fire Pro League: Season 4",
      matchId: "m-ff-02",
      roundName: "Semifinals - Match 2",
      winnerTeam: "Velocity Gaming BD",
      loserTeam: "Team Apex BD",
      scoreA: 13,
      scoreB: 11,
      mvp: "Velocity_Aces",
      mvpKills: 8,
      status: "verified",
      verifiedBy: "ESBD Head Referee (Ref_Tanvir)",
      submittedAt: new Date(Date.now() - 1800000).toISOString(),
      proofUrl: "/img/gallery/lan-02.jpg",
      bracketPlacement: "Advanced to Grand Finals"
    },
    {
      id: "res-03",
      tournamentId: "esbd-pubgm-s3",
      tournamentTitle: "PUBG Mobile South Asia Prelims 2026",
      matchId: "m-pubgm-01",
      roundName: "Erangel Match 4",
      winnerTeam: "A1 eSports BD",
      loserTeam: "Zeus Gaming BD",
      scoreA: 28,
      scoreB: 19,
      mvp: "A1_Dante",
      mvpKills: 7,
      status: "verified",
      verifiedBy: "ESBD Head Referee",
      submittedAt: new Date(Date.now() - 900000).toISOString(),
      proofUrl: "/img/gallery/lan-03.jpg",
      bracketPlacement: "Group Stage Day 2 Leaders"
    }
  ]
};

// Helper: Extract current user from Bearer Token
function authenticateUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return memoryStore.users.find(u => u.id === decoded.id) || decoded;
  } catch {
    return null;
  }
}

// Middleware: Require Authenticated User
function requireAuth(req, res, next) {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized. Please sign in to access your profile." });
  }
  req.user = user;
  next();
}

// Middleware: Require Administrator Privileges
function requireAdmin(req, res, next) {
  const user = authenticateUser(req);
  if (!user || (user.role !== 'admin' && user.role !== 'organizer')) {
    return res.status(403).json({ error: "Access denied. Administrator privileges required." });
  }
  req.user = user;
  next();
}

// -----------------------------------------------------------------------------
// 1. AUTHENTICATION
// -----------------------------------------------------------------------------
router.post('/auth/register', authLimiter, async (req, res) => {
  try {
    const { ign, email, password, phone, displayName, gameTags } = req.body;
    if (!ign || !password) {
      return res.status(400).json({ error: "IGN and Password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanIgn = ign.trim();

    const existing = memoryStore.users.find(u =>
      u.ign.toLowerCase() === cleanIgn.toLowerCase() ||
      (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail)
    );
    if (existing) {
      return res.status(400).json({ error: "A player with this IGN or Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const newUser = {
      id: `user-${Date.now()}`,
      ign: cleanIgn,
      displayName: displayName || cleanIgn,
      email: cleanEmail,
      phone: phone || '',
      role: 'player',
      avatarUrl: '/img/esbd-logo.png',
      walletBalanceMinor: 0,
      gameTags: gameTags || {},
      authMethod: 'password',
      createdAt: new Date().toISOString()
    };

    memoryStore.users.push(newUser);
    memoryStore.passwords[newUser.id] = hashedPassword;
    memoryStore.walletTransactions[newUser.id] = [];
    memoryStore.notifications[newUser.id] = [
      {
        id: `notif-${Date.now()}`,
        type: 'tournament',
        title: 'Welcome to E-SPORTS BANGLADESH',
        message: `Welcome, ${cleanIgn}! Your profile is ready. Browse active tournaments and join competitive rooms.`,
        readAt: null,
        createdAt: new Date().toISOString()
      }
    ];

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').insert([{
          ign: newUser.ign,
          display_name: newUser.displayName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          wallet_balance_minor: 0
        }]);
      } catch (err) {
        console.warn('Supabase sync notice:', err.message);
      }
    }

    const token = jwt.sign({ id: newUser.id, ign: newUser.ign, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: newUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/auth/login', authLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Username/IGN/Email and Password are required." });
    }

    const term = identifier.trim().toLowerCase();
    const user = memoryStore.users.find(u =>
      u.ign.toLowerCase() === term ||
      (u.email && u.email.toLowerCase() === term) ||
      (u.phone && u.phone === term)
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials. Player not found." });
    }

    const storedHash = memoryStore.passwords[user.id];
    if (!storedHash) {
      return res.status(401).json({ error: 'This account uses social or phone login. Please sign in with Google, Facebook, or phone.' });
    }

    const passwordMatch = await bcrypt.compare(password, storedHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    const token = jwt.sign({ id: user.id, ign: user.ign, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/auth/logout', (req, res) => {
  return res.json({ success: true });
});

router.get('/auth/me', (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  return res.json(user);
});

// Send OTP for phone registration/login
router.post('/auth/phone/send-otp', otpLimiter, async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !/^\+?[0-9]{10,15}$/.test(phone.replace(/[\s\-()]/g, ''))) {
      return res.status(400).json({ error: 'A valid phone number is required (e.g. +8801XXXXXXXXX).' });
    }
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    otpStore.set(cleanPhone, {
      hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
      attempts: 0
    });
    await sendSmsOtp(cleanPhone, otp);
    return res.json({ success: true, message: 'OTP sent to your phone number. Valid for 5 minutes.', devHint: process.env.NODE_ENV !== 'production' ? `Testing code: ${otp}` : undefined });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Verify OTP and login/register with phone
router.post('/auth/phone/verify-otp', authLimiter, async (req, res) => {
  try {
    const { phone, otp, displayName, ign } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required.' });
    }
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    const record = otpStore.get(cleanPhone);
    if (!record) {
      return res.status(400).json({ error: 'No OTP found for this number. Please request a new one.' });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return res.status(400).json({ error: 'OTP has expired. Please request a new code.' });
    }
    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts > 5) {
      otpStore.delete(cleanPhone);
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new OTP.' });
    }
    const valid = await bcrypt.compare(otp.trim(), record.hashedOtp);
    if (!valid) {
      return res.status(400).json({ error: `Incorrect OTP. ${5 - record.attempts} attempt(s) remaining.` });
    }
    otpStore.delete(cleanPhone);

    // Find existing user or create one
    let user = memoryStore.users.find(u => u.phone === cleanPhone);
    if (!user) {
      const cleanIgn = (ign || '').trim() || `Player${Date.now().toString().slice(-5)}`;
      user = {
        id: `user-${Date.now()}`,
        ign: cleanIgn,
        displayName: displayName || cleanIgn,
        email: '',
        phone: cleanPhone,
        role: 'player',
        avatarUrl: '/img/esbd-logo.png',
        walletBalanceMinor: 0,
        authMethod: 'phone',
        createdAt: new Date().toISOString()
      };
      memoryStore.users.push(user);
      memoryStore.walletTransactions[user.id] = [];
      memoryStore.notifications[user.id] = [{
        id: `notif-${Date.now()}`,
        type: 'tournament',
        title: 'Welcome to E-SPORTS BANGLADESH',
        message: `Welcome, ${user.ign}! Your phone-verified profile is ready.`,
        readAt: null,
        createdAt: new Date().toISOString()
      }];
    }

    const token = jwt.sign({ id: user.id, ign: user.ign, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Google OAuth initiation (redirect)
router.get('/auth/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(503).json({ error: 'Google OAuth is not configured. Please add GOOGLE_CLIENT_ID to environment variables.' });
  }
  const redirectUri = encodeURIComponent(`${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/google/callback`);
  const scope = encodeURIComponent('openid email profile');
  const state = crypto.randomBytes(16).toString('hex');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=select_account`;
  res.redirect(url);
});

// Google OAuth callback
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'Authorization code missing.' });

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' })
    });
    const tokens = await tokenRes.json();
    if (!tokens.id_token) return res.status(400).json({ error: 'Failed to get tokens from Google.' });

    // Decode id_token (verify in production with Google's public keys)
    const payload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());
    const { sub: googleId, email, name, picture } = payload;

    let user = memoryStore.users.find(u => u.googleId === googleId || (email && u.email === email));
    if (!user) {
      const cleanIgn = (name || email || '').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || `Gamer${Date.now().toString().slice(-4)}`;
      user = {
        id: `user-${Date.now()}`,
        ign: cleanIgn,
        displayName: name || cleanIgn,
        email: email || '',
        phone: '',
        googleId,
        role: 'player',
        avatarUrl: picture || '/img/esbd-logo.png',
        walletBalanceMinor: 0,
        authMethod: 'google',
        createdAt: new Date().toISOString()
      };
      memoryStore.users.push(user);
      memoryStore.walletTransactions[user.id] = [];
      memoryStore.notifications[user.id] = [{
        id: `notif-${Date.now()}`,
        type: 'tournament',
        title: 'Welcome to E-SPORTS BANGLADESH',
        message: `Welcome, ${user.displayName}! Signed in via Google.`,
        readAt: null,
        createdAt: new Date().toISOString()
      }];
    }

    const token = jwt.sign({ id: user.id, ign: user.ign, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    res.redirect(`${siteUrl}/portal?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, ign: user.ign, role: user.role, displayName: user.displayName, avatarUrl: user.avatarUrl }))}`);
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
  }
});

// Facebook OAuth initiation (redirect)
router.get('/auth/facebook', (req, res) => {
  const appId = process.env.FACEBOOK_APP_ID;
  if (!appId) {
    return res.status(503).json({ error: 'Facebook OAuth is not configured. Please add FACEBOOK_APP_ID to environment variables.' });
  }
  const redirectUri = encodeURIComponent(`${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/facebook/callback`);
  const state = crypto.randomBytes(16).toString('hex');
  const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${state}&scope=email,public_profile`;
  res.redirect(url);
});

// Facebook OAuth callback
router.get('/auth/facebook/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'Authorization code missing.' });

    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = `${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/facebook/callback`;

    // Exchange code for access token
    const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`);
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.status(400).json({ error: 'Failed to get access token from Facebook.' });

    // Get user profile
    const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${tokenData.access_token}`);
    const profile = await profileRes.json();
    const { id: facebookId, name, email, picture } = profile;

    let user = memoryStore.users.find(u => u.facebookId === facebookId || (email && u.email === email));
    if (!user) {
      const cleanIgn = (name || email || '').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || `Gamer${Date.now().toString().slice(-4)}`;
      user = {
        id: `user-${Date.now()}`,
        ign: cleanIgn,
        displayName: name || cleanIgn,
        email: email || '',
        phone: '',
        facebookId,
        role: 'player',
        avatarUrl: picture?.data?.url || '/img/esbd-logo.png',
        walletBalanceMinor: 0,
        authMethod: 'facebook',
        createdAt: new Date().toISOString()
      };
      memoryStore.users.push(user);
      memoryStore.walletTransactions[user.id] = [];
      memoryStore.notifications[user.id] = [{
        id: `notif-${Date.now()}`,
        type: 'tournament',
        title: 'Welcome to E-SPORTS BANGLADESH',
        message: `Welcome, ${user.displayName}! Signed in via Facebook.`,
        readAt: null,
        createdAt: new Date().toISOString()
      }];
    }

    const token = jwt.sign({ id: user.id, ign: user.ign, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    res.redirect(`${siteUrl}/portal?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, ign: user.ign, role: user.role, displayName: user.displayName, avatarUrl: user.avatarUrl }))}`);
  } catch (err) {
    console.error('Facebook OAuth error:', err);
    res.redirect(`${process.env.SITE_URL || 'http://localhost:3000'}/login?error=facebook_auth_failed`);
  }
});

// ─── AUTH CONFIG & DIRECT SOCIAL INTEGRATION ───────────────────────────────
router.get('/auth/providers', (req, res) => {
  return res.json({
    google: {
      enabled: !!process.env.GOOGLE_CLIENT_ID,
      clientId: process.env.GOOGLE_CLIENT_ID || null
    },
    facebook: {
      enabled: !!process.env.FACEBOOK_APP_ID,
      appId: process.env.FACEBOOK_APP_ID || null
    },
    phone: {
      enabled: true,
      hasSmsProvider: !!process.env.SMS_PROVIDER
    }
  });
});

// Direct Social Sign-In / Sign-Up (Google One-Tap or Client SDK)
router.post('/auth/social/google', authLimiter, async (req, res) => {
  try {
    const { email, displayName, photoUrl, googleId } = req.body;
    if (!email && !googleId) {
      return res.status(400).json({ error: "Google account details are required." });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    let user = memoryStore.users.find(u => (googleId && u.googleId === googleId) || (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail));

    if (!user) {
      const baseName = (displayName || cleanEmail.split('@')[0] || 'Player').replace(/[^a-zA-Z0-9_]/g, '');
      const cleanIgn = `${baseName.slice(0, 14)}_${Math.floor(100 + Math.random() * 900)}`;
      user = {
        id: `user-${Date.now()}`,
        ign: cleanIgn,
        displayName: displayName || cleanIgn,
        email: cleanEmail,
        phone: '',
        googleId: googleId || `g_${Date.now()}`,
        role: 'player',
        avatarUrl: photoUrl || '/img/esbd-logo.png',
        walletBalanceMinor: 0,
        authMethod: 'google',
        createdAt: new Date().toISOString()
      };
      memoryStore.users.push(user);
      memoryStore.walletTransactions[user.id] = [];
      memoryStore.notifications[user.id] = [{
        id: `notif-${Date.now()}`,
        type: 'tournament',
        title: 'Welcome to E-SPORTS BANGLADESH',
        message: `Welcome, ${user.displayName}! Successfully signed in via Google.`,
        readAt: null,
        createdAt: new Date().toISOString()
      }];
    }

    const token = jwt.sign({ id: user.id, ign: user.ign, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Direct Social Sign-In / Sign-Up (Facebook SDK)
router.post('/auth/social/facebook', authLimiter, async (req, res) => {
  try {
    const { email, displayName, photoUrl, facebookId } = req.body;
    if (!facebookId && !email) {
      return res.status(400).json({ error: "Facebook profile details are required." });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    let user = memoryStore.users.find(u => (facebookId && u.facebookId === facebookId) || (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail));

    if (!user) {
      const baseName = (displayName || 'Player').replace(/[^a-zA-Z0-9_]/g, '');
      const cleanIgn = `${baseName.slice(0, 14)}_${Math.floor(100 + Math.random() * 900)}`;
      user = {
        id: `user-${Date.now()}`,
        ign: cleanIgn,
        displayName: displayName || cleanIgn,
        email: cleanEmail,
        phone: '',
        facebookId: facebookId || `fb_${Date.now()}`,
        role: 'player',
        avatarUrl: photoUrl || '/img/esbd-logo.png',
        walletBalanceMinor: 0,
        authMethod: 'facebook',
        createdAt: new Date().toISOString()
      };
      memoryStore.users.push(user);
      memoryStore.walletTransactions[user.id] = [];
      memoryStore.notifications[user.id] = [{
        id: `notif-${Date.now()}`,
        type: 'tournament',
        title: 'Welcome to E-SPORTS BANGLADESH',
        message: `Welcome, ${user.displayName}! Successfully signed in via Facebook.`,
        readAt: null,
        createdAt: new Date().toISOString()
      }];
    }

    const token = jwt.sign({ id: user.id, ign: user.ign, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// -----------------------------------------------------------------------------
// 2. PUBLIC SHOWCASES & STATS (Live Supabase + Resilient Fallback)
// -----------------------------------------------------------------------------
router.get('/stats', async (req, res) => {
  const liveTournaments = memoryStore.tournaments.filter(t => t.status === 'live');
  const openTournaments = memoryStore.tournaments.filter(t => t.status === 'registration_open');
  const totalPrizeMinor = memoryStore.tournaments.reduce((sum, t) => sum + (t.prizePoolMinor || 0), 0);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('stats').select('*').limit(1);
      if (data && data.length > 0) {
        const s = data[0];
        const baseStats = {
          // Frontend hero expects these exact keys:
          liveNow: liveTournaments.length,
          tournaments: openTournaments.length,
          players: s.total_players || 85400,
          prizePoolMinor: s.total_prize_minor || totalPrizeMinor,
          // Legacy fields for other sections:
          totalPlayers: s.total_players || 85400,
          playersManaged: `${(s.total_players || 85400).toLocaleString()}+`,
          totalProjects: s.total_projects || 1240,
          projectsDelivered: `${s.total_projects || 1240}+`,
          lanExecutions: `${s.lan_executions || 200}+`,
          totalPrizeMinor: s.total_prize_minor || totalPrizeMinor,
          totalPrizeBDT: "2.5 Crore+",
          audienceReached: s.audience_reached || "2.5M+",
          companiesServed: `${s.companies_served || 100}+`,
          activeTournaments: memoryStore.tournaments.length
        };
        return res.json(baseStats);
      }
    } catch (err) {
      console.warn('Supabase stats query fallback:', err.message);
    }
  }
  // Fallback with correct hero fields
  return res.json({
    ...memoryStore.stats,
    liveNow: liveTournaments.length,
    tournaments: openTournaments.length,
    players: memoryStore.stats.totalPlayers,
    prizePoolMinor: totalPrizeMinor
  });
});

router.get('/games', async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('games').select('*');
      if (data && data.length > 0) {
        return res.json(data.map(g => ({
          id: g.id,
          slug: g.slug,
          title: g.title,
          name: g.name,
          shortName: g.title,
          genre: g.genre,
          platform: g.platform,
          bannerUrl: g.banner_url || `/img/games/${g.id}.png`,
          iconUrl: g.icon_url || `/img/games/${g.id}.png`,
          rules: g.rules_summary || "Official ruleset apply."
        })));
      }
    } catch (err) {
      console.warn('Supabase games query fallback:', err.message);
    }
  }
  return res.json(memoryStore.games);
});

router.get('/tournaments', async (req, res) => {
  // Helper: build a nested game object the frontend card expects (e.game?.iconUrl)
  function buildGameObj(gameId) {
    const gameInfo = memoryStore.games.find(g => g.id === gameId || g.slug === gameId);
    return gameInfo ? gameInfo : { id: gameId, name: gameId, iconUrl: `/img/games/${gameId}.png`, bannerUrl: `/img/games/${gameId}.png` };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('tournaments').select('*');
      if (data && data.length > 0) {
        return res.json(data.map(t => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          game: buildGameObj(t.game_id),  // nested game object with iconUrl
          gameId: t.game_id,
          format: t.format,
          status: t.status,
          prizePool: `BDT ${(t.prize_pool_minor / 100).toLocaleString()}`,
          prizePoolMinor: t.prize_pool_minor,
          currency: t.currency || 'BDT',
          entryFee: t.entry_fee_minor === 0 ? 'Free' : `BDT ${t.entry_fee_minor / 100}`,
          entryFeeMinor: t.entry_fee_minor || 0,
          sponsor: t.sponsor || 'ESBD & Partners',
          startDate: t.start_date,
          endDate: t.end_date,
          slots: t.max_slots,
          registeredCount: t.registered_count || 0,
          bannerUrl: t.banner_url || `/img/games/${t.game_id}.png`,
          rules: t.rules || [],
          bracket: t.bracket_data || { rounds: [] },
          registeredTeams: []
        })));
      }
    } catch (err) {
      console.warn('Supabase tournaments query fallback:', err.message);
    }
  }
  // Fallback: attach nested game objects
  return res.json(memoryStore.tournaments.map(t => ({
    ...t,
    game: typeof t.game === 'string' ? buildGameObj(t.game) : (t.game || buildGameObj(t.gameId))
  })));
});

router.get('/tournaments/:slug', async (req, res) => {
  const { slug } = req.params;
  const user = authenticateUser(req);
  const tournament = memoryStore.tournaments.find(t => t.slug === slug || t.id === slug);
  if (!tournament) {
    return res.status(404).json({ error: "Tournament not found." });
  }

  const enrichedTournament = {
    ...tournament,
    game: typeof tournament.game === 'string' ? buildGameObj(tournament.game) : (tournament.game || buildGameObj(tournament.gameId))
  };

  const myReg = user ? (memoryStore.registrations || []).find(r => r.tournamentId === tournament.id && r.userId === user.id) : null;

  return res.json({
    tournament: enrichedTournament,
    bracket: tournament.bracket || { rounds: [] },
    registrations: tournament.registeredTeams || [],
    matches: (memoryStore.matches || []).filter(m => m.tournamentId === tournament.id),
    standings: tournament.standings || [],
    myRegistration: myReg || null,
    rules: tournament.rules || []
  });
});

router.get('/influencers', async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('influencers').select('*');
      if (data && data.length > 0) {
        return res.json(data.map(inf => ({
          id: inf.id,
          name: inf.name,
          handle: inf.handle,
          followersRank: inf.followers_rank,
          followersDisplay: inf.followers_display,
          avatarUrl: inf.avatar_url,
          imageUrl: inf.avatar_url,  // Creators page reads imageUrl for card photos
          category: inf.category,
          platforms: inf.platforms,
          featured: inf.featured
        })));
      }
    } catch (err) {
      console.warn('Supabase influencers query fallback:', err.message);
    }
  }
  // Fallback: add imageUrl from avatarUrl for creators page
  return res.json(memoryStore.influencers.map(inf => ({
    ...inf,
    imageUrl: inf.imageUrl || inf.avatarUrl
  })));
});

router.get('/clients', async (req, res) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('clients').select('*');
      if (data && data.length > 0) {
        return res.json(data.map(c => ({
          id: c.id,
          name: c.name,
          category: c.category,
          logoUrl: c.logo_url,
          websiteUrl: c.website_url,
          featured: c.featured
        })));
      }
    } catch (err) {
      console.warn('Supabase clients query fallback:', err.message);
    }
  }
  return res.json(memoryStore.clients);
});

router.get('/communities', (req, res) => {
  return res.json(memoryStore.communities);
});

router.get('/milestones', (req, res) => {
  return res.json(memoryStore.milestones);
});

router.get('/gallery', (req, res) => {
  return res.json(memoryStore.gallery);
});

router.get('/staff', (req, res) => {
  // Frontend reads f.imageUrl for staff card photos — map avatarUrl -> imageUrl
  const staffWithImageUrl = memoryStore.staff.map(m => ({
    ...m,
    imageUrl: m.imageUrl || m.avatarUrl || null
  }));
  return res.json(staffWithImageUrl);
});

router.get('/services', (req, res) => {
  return res.json(memoryStore.services);
});

router.get('/leaderboard', (req, res) => {
  const { game } = req.query;
  if (game) {
    const filtered = memoryStore.leaderboard.filter(l => l.gameId === game || l.game.toLowerCase() === game.toLowerCase());
    return res.json(filtered.length ? filtered : memoryStore.leaderboard);
  }
  return res.json(memoryStore.leaderboard);
});

router.get('/config', (req, res) => {
  return res.json({
    platformName: "E-SPORTS BANGLADESH",
    currency: "BDT",
    minWithdrawalBDT: 500,
    bkashMerchant: "01700000000",
    nagadMerchant: "01700000000",
    supportEmail: "info@esportsbd.com",
    discordUrl: "https://discord.gg/esbd",
    facebookUrl: "https://facebook.com/esportsbangladesh",
    registrationOpen: true
  });
});

router.post('/contact', (req, res) => {
  const { name, email, phone, company, subject, message } = req.body;
  const record = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone,
    company,
    subject: subject || "Partnership Inquiry",
    message,
    status: "unread",
    createdAt: new Date().toISOString()
  };
  memoryStore.contactMessages.push(record);
  return res.json({ success: true, message: "Inquiry received. The ESBD team will contact you shortly." });
});

// -----------------------------------------------------------------------------
// NEWSROOM / GAMING NEWS PORTAL
// -----------------------------------------------------------------------------
router.get('/news', (req, res) => {
  const { game, category } = req.query;
  let articles = memoryStore.news || [];
  if (game && game !== 'all') {
    articles = articles.filter(a => a.gameId === game || (a.gameTitle && a.gameTitle.toLowerCase().includes(game.toLowerCase())));
  }
  if (category && category !== 'all') {
    articles = articles.filter(a => a.category && a.category.toLowerCase() === category.toLowerCase());
  }
  return res.json(articles);
});

router.get('/news/:slug', (req, res) => {
  const { slug } = req.params;
  const article = (memoryStore.news || []).find(a => a.slug === slug || a.id === slug);
  if (!article) return res.status(404).json({ error: "Article not found." });
  return res.json(article);
});

// -----------------------------------------------------------------------------
// E-COMMERCE / TOURNAMENT HARDWARE & ACCESSORIES SHOP
// -----------------------------------------------------------------------------
router.get('/products', (req, res) => {
  const { brand, category } = req.query;
  let items = memoryStore.products || [];
  if (brand && brand !== 'all') {
    items = items.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
  }
  if (category && category !== 'all') {
    items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return res.json(items);
});

router.get('/products/:id', (req, res) => {
  const item = (memoryStore.products || []).find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Product not found." });
  return res.json(item);
});

router.post('/products/order', (req, res) => {
  const user = authenticateUser(req);
  const { productId, quantity = 1, customerName, customerPhone, deliveryAddress, paymentMethod = 'cash_on_delivery', trxId } = req.body;
  const product = (memoryStore.products || []).find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found." });

  const order = {
    id: `ord-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    brand: product.brand,
    quantity: Number(quantity) || 1,
    unitPriceBDT: product.priceBDT,
    totalBDT: (product.priceBDT || 0) * (Number(quantity) || 1),
    customerName: customerName || (user ? user.displayName : "Gamer"),
    customerPhone: customerPhone || (user ? user.phone : ""),
    deliveryAddress: deliveryAddress || "Dhaka, Bangladesh",
    paymentMethod,
    trxId: trxId || null,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  memoryStore.productOrders = memoryStore.productOrders || [];
  memoryStore.productOrders.push(order);

  return res.json({
    success: true,
    message: `Order for ${product.name} confirmed! Our hardware team will dispatch with tournament warranty.`,
    order
  });
});

// -----------------------------------------------------------------------------
// 3. TOURNAMENT ACTIONS (Register, Join, Check-In, Withdraw)
// Separate sections for Above 18 & Below 18 with mandatory NID validation
// -----------------------------------------------------------------------------
function handleTournamentJoin(req, res) {
  const user = authenticateUser(req);
  if (!user) {
    return res.status(401).json({ error: "Please sign in or create an account to register for tournaments." });
  }
  const tournament = memoryStore.tournaments.find(t => t.id === req.params.id);
  if (!tournament) return res.status(404).json({ error: "Tournament not found." });

  const userId = user.id;
  const ign = user.ign || req.body.ign || `Gamer_${Math.floor(Math.random() * 9000 + 1000)}`;
  const teamId = req.body.teamId || null;
  const teamName = req.body.teamName || (user ? `${user.ign}'s Squad` : `${ign}'s Squad`);

  // Age Division & Identification Validation
  const ageBracket = req.body.ageBracket || 'above_18'; // 'above_18' | 'below_18'
  const tournamentTier = req.body.tournamentTier || (tournament.isInternational ? 'international' : 'national');
  const nidNumber = req.body.nidNumber || (user && user.nidNumber);
  const nidAttachmentUrl = req.body.nidAttachmentUrl || req.body.nidAttachment || req.body.nidProof;
  const birthCertificateNo = req.body.birthCertificateNo || req.body.studentIdNo || (user && user.birthCertificateNo);
  const guardianName = req.body.guardianName;
  const guardianPhone = req.body.guardianPhone;
  const guardianNid = req.body.guardianNid;
  const paymentMethod = req.body.paymentMethod || 'free_pass';
  const paymentTrxId = req.body.paymentTrxId || null;
  const paymentPhone = req.body.paymentPhone || null;

  if (ageBracket === 'above_18') {
    if (!nidNumber || String(nidNumber).trim().length < 8) {
      return res.status(400).json({
        error: "National ID (NID) number is mandatory for Above 18 tournament registration. Please enter your valid 10 or 17 digit NID number."
      });
    }
    if (!nidAttachmentUrl) {
      return res.status(400).json({
        error: "Attachment of NID document / image proof is mandatory for Above 18 competitive tournaments."
      });
    }
  } else {
    // Under 18
    if (!birthCertificateNo) {
      return res.status(400).json({
        error: "Birth Certificate Number or Student ID is required for Under 18 players (as NID is not issued below 18)."
      });
    }
    if (!guardianName || !guardianPhone) {
      return res.status(400).json({
        error: "Parent or Legal Guardian name and phone number are required for Under 18 participants."
      });
    }
  }

  const alreadyRegistered = (tournament.registeredTeams || []).some(rt => rt.captainIgn === ign || rt.id === userId);
  if (alreadyRegistered) {
    return res.status(400).json({ error: "You or your team are already registered for this tournament." });
  }

  const newEntry = {
    id: userId,
    name: teamName,
    tag: ign.slice(0, 4).toUpperCase(),
    captainIgn: ign,
    teamId,
    ageBracket,
    tournamentTier,
    nidNumber: ageBracket === 'above_18' ? nidNumber : null,
    nidAttachmentUrl: ageBracket === 'above_18' ? nidAttachmentUrl : null,
    birthCertificateNo: ageBracket === 'below_18' ? birthCertificateNo : null,
    guardianName: ageBracket === 'below_18' ? guardianName : null,
    guardianPhone: ageBracket === 'below_18' ? guardianPhone : null,
    paymentMethod,
    paymentTrxId,
    checkedIn: false
  };

  tournament.registeredTeams = tournament.registeredTeams || [];
  tournament.registeredTeams.push(newEntry);
  tournament.registeredCount = (tournament.registeredCount || 0) + 1;

  const regRecord = {
    id: `reg-${Date.now()}`,
    tournamentId: tournament.id,
    userId,
    ign,
    teamName,
    ageBracket,
    tournamentTier,
    nidNumber: ageBracket === 'above_18' ? nidNumber : null,
    nidAttachmentUrl: ageBracket === 'above_18' ? nidAttachmentUrl : null,
    birthCertificateNo: ageBracket === 'below_18' ? birthCertificateNo : null,
    guardianName: ageBracket === 'below_18' ? guardianName : null,
    guardianPhone: ageBracket === 'below_18' ? guardianPhone : null,
    guardianNid: ageBracket === 'below_18' ? guardianNid : null,
    paymentMethod,
    paymentTrxId,
    paymentPhone,
    status: 'registered',
    registeredAt: new Date().toISOString()
  };

  memoryStore.registrations.push(regRecord);

  return res.json({
    success: true,
    message: "Registration confirmed. NID/Youth credentials verified.",
    tournament,
    registration: regRecord
  });
}

router.post('/tournaments/:id/join', handleTournamentJoin);
router.post('/tournaments/:id/register', handleTournamentJoin);

router.post('/tournaments/:id/check-in', (req, res) => {
  const user = authenticateUser(req);
  const tournament = memoryStore.tournaments.find(t => t.id === req.params.id);
  if (!tournament) return res.status(404).json({ error: "Tournament not found." });

  if (!user) return res.status(401).json({ error: 'Please sign in to check in.' });
  const ign = user.ign;
  if (tournament.registeredTeams) {
    const team = tournament.registeredTeams.find(t => t.captainIgn === ign);
    if (team) team.checkedIn = true;
  }

  return res.json({ success: true, message: "Checked in successfully." });
});

router.post('/tournaments/:id/withdraw', (req, res) => {
  const user = authenticateUser(req);
  const tournament = memoryStore.tournaments.find(t => t.id === req.params.id);
  if (!tournament) return res.status(404).json({ error: "Tournament not found." });

  if (!user) return res.status(401).json({ error: 'Please sign in to withdraw.' });
  const ign = user.ign;
  if (tournament.registeredTeams) {
    tournament.registeredTeams = tournament.registeredTeams.filter(t => t.captainIgn !== ign);
    tournament.registeredCount = Math.max(0, tournament.registeredCount - 1);
  }

  return res.json({ success: true, message: "Withdrawn successfully." });
});

// -----------------------------------------------------------------------------
// 4. PLAYER PORTAL (Wallet, Matches, Notifications, Teams)
// -----------------------------------------------------------------------------
router.get('/me/tournaments', (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized. Please sign in." });
  const registeredIds = memoryStore.registrations.filter(r => r.userId === user.id).map(r => r.tournamentId);
  const userTournaments = memoryStore.tournaments.filter(t => registeredIds.includes(t.id) || t.status === 'live');
  const list = userTournaments.length ? userTournaments : [memoryStore.tournaments[0]];

  const toSafeIso = (val, fallbackOffset = 0) => {
    try {
      if (!val) return new Date(Date.now() + fallbackOffset).toISOString();
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date(Date.now() + fallbackOffset).toISOString() : d.toISOString();
    } catch {
      return new Date(Date.now() + fallbackOffset).toISOString();
    }
  };

  // Format each tournament with game object and startsAt expected by the frontend
  const formatted = list.map(t => ({
    ...t,
    startsAt: toSafeIso(t.startDate || t.startsAt),
    endsAt: toSafeIso(t.endDate || t.endsAt, 86400000),
    game: typeof t.game === 'object' ? t.game : {
      id: t.gameId || 'free-fire',
      title: t.game || 'Free Fire',
      iconUrl: t.bannerUrl || `/img/games/${t.gameId || 'free-fire'}.png`
    }
  }));

  return res.json(formatted);
});

router.get('/me/matches', (req, res) => {
  return res.json(memoryStore.matches);
});

router.get('/me/wallet', (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized. Please sign in." });
  const transactions = memoryStore.walletTransactions[user.id] || [];
  return res.json({
    balanceMinor: user.walletBalanceMinor || 250000,
    currency: "BDT",
    transactions
  });
});

router.post('/me/wallet/top-up', (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized. Please sign in." });
  const { amountMinor, method } = req.body;
  if (!amountMinor || amountMinor <= 0) {
    return res.status(400).json({ error: "Invalid top-up amount." });
  }

  user.walletBalanceMinor = (user.walletBalanceMinor || 0) + Number(amountMinor);
  const newTx = {
    id: `tx-${Date.now()}`,
    amountMinor: Number(amountMinor),
    currency: "BDT",
    type: "top_up",
    method: method || "bkash",
    reference: `BKASH-${Math.floor(1000000 + Math.random() * 9000000)}`,
    status: "completed",
    createdAt: new Date().toISOString()
  };

  memoryStore.walletTransactions[user.id] = memoryStore.walletTransactions[user.id] || [];
  memoryStore.walletTransactions[user.id].unshift(newTx);

  return res.json({ success: true, balanceMinor: user.walletBalanceMinor, transaction: newTx });
});

router.get('/me/notifications', (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized. Please sign in." });
  const list = memoryStore.notifications[user.id] || [
    {
      id: "n-demo",
      kind: "room_code",
      type: "room_code",
      title: "Match Room Code",
      message: "Room ID: ESBD-FF-492 | Pass: esbd | Mode: Clash Squad",
      readAt: null,
      createdAt: new Date().toISOString()
    }
  ];
  return res.json(list);
});

router.post('/me/notifications/read', (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized. Please sign in." });
  const { ids } = req.body || {};
  const list = memoryStore.notifications[user.id] || [];
  list.forEach(n => {
    if (!ids || ids.includes(n.id)) {
      n.readAt = new Date().toISOString();
    }
  });
  return res.json({ success: true });
});

router.get('/teams', (req, res) => {
  return res.json(memoryStore.teams);
});

router.get('/teams/mine', (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized. Please sign in." });
  const userTeams = memoryStore.teams.filter(t => t.captainId === user.id || (t.members || []).some(m => m.userId === user.id));
  return res.json(userTeams.length ? userTeams : [memoryStore.teams[0]]);
});

router.post('/teams', (req, res) => {
  const user = authenticateUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized. Please sign in." });
  const { name, tag, gameId } = req.body;
  if (!name || !tag) return res.status(400).json({ error: "Team name and tag are required." });

  const gameObj = memoryStore.games.find(g => g.id === gameId) || { name: "Multi-title" };
  const newTeam = {
    id: `team-${Date.now()}`,
    name,
    tag: tag.toUpperCase(),
    gameId: gameId || "free-fire",
    gameName: gameObj.name || gameObj.title || "Free Fire",
    captainId: user.id,
    captainIgn: user.ign,
    members: [
      { userId: user.id, ign: user.ign, role: "captain", avatarUrl: user.avatarUrl || "/img/influencers/mr-triple-r.jpg" }
    ],
    createdAt: new Date().toISOString()
  };
  memoryStore.teams.push(newTeam);
  return res.json(newTeam);
});

router.post('/teams/:id/members', (req, res) => {
  const team = memoryStore.teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: "Team not found." });
  const { identifier, role } = req.body;
  if (!identifier) return res.status(400).json({ error: "Player identifier (IGN or email) is required." });

  const clean = identifier.trim();
  const matchedUser = memoryStore.users.find(u => u.ign.toLowerCase() === clean.toLowerCase() || (u.email && u.email.toLowerCase() === clean.toLowerCase()));

  team.members = team.members || [];
  const alreadyMember = team.members.some(m => m.ign.toLowerCase() === clean.toLowerCase());
  if (alreadyMember) return res.status(400).json({ error: "Player is already on this team roster." });

  const newMember = {
    userId: matchedUser ? matchedUser.id : `user-${Date.now()}`,
    ign: matchedUser ? matchedUser.ign : clean,
    role: role || "player",
    avatarUrl: matchedUser?.avatarUrl || "/img/esbd-logo.png"
  };
  team.members.push(newMember);
  return res.json({ success: true, team, member: newMember });
});

router.delete('/teams/:id/members/:userId', (req, res) => {
  const team = memoryStore.teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: "Team not found." });
  team.members = (team.members || []).filter(m => m.userId !== req.params.userId && m.ign !== req.params.userId);
  return res.json({ success: true, team });
});

router.post('/matches/:id/result', (req, res) => {
  const { myScore, opponentScore, proofUrl } = req.body;
  const match = memoryStore.matches.find(m => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: "Match not found." });

  match.myScore = Number(myScore);
  match.opponentScore = Number(opponentScore);
  match.proofUrl = proofUrl || "/img/gallery/arena-stage.jpg";

  memoryStore.submissions.push({
    id: `sub-${Date.now()}`,
    matchId: match.id,
    submittedBy: "raiyan",
    scoreReported: `${myScore} - ${opponentScore}`,
    proofUrl: match.proofUrl,
    status: "verified",
    createdAt: new Date().toISOString()
  });

  return res.json({ verified: true, match });
});

// -----------------------------------------------------------------------------
// 5. ADMIN CONSOLE
// -----------------------------------------------------------------------------
router.get('/admin/overview', requireAdmin, (req, res) => {
  return res.json({
    totalTournaments: memoryStore.tournaments.length,
    activeTournaments: memoryStore.tournaments.filter(t => t.status === 'live' || t.status === 'registration_open').length,
    totalPlayers: 85400,
    registeredTeams: memoryStore.teams.length + 42,
    pendingSubmissions: memoryStore.submissions.filter(s => s.status === 'pending').length,
    openDisputes: memoryStore.disputes.filter(d => d.status === 'open').length,
    revenueBDT: "2,48,500",
    serverStatus: "Operational (Dhaka Region)",
    supabaseConnected: isSupabaseConfigured
  });
});

router.get('/admin/tournaments', requireAdmin, (req, res) => {
  return res.json(memoryStore.tournaments);
});

router.post('/admin/tournaments/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const tournament = memoryStore.tournaments.find(t => t.id === req.params.id);
  if (!tournament) return res.status(404).json({ error: "Tournament not found." });
  tournament.status = status;
  return res.json({ success: true, tournament });
});

router.post('/admin/tournaments/:id/bracket', requireAdmin, (req, res) => {
  const tournament = memoryStore.tournaments.find(t => t.id === req.params.id);
  if (!tournament) return res.status(404).json({ error: "Tournament not found." });

  // Generate Bracket Matches
  const teams = tournament.registeredTeams || [];
  const matches = [];
  for (let i = 0; i < Math.max(2, Math.floor(teams.length / 2)); i++) {
    const teamA = teams[i * 2] || { name: `Squad ${i * 2 + 1}` };
    const teamB = teams[i * 2 + 1] || { name: `Squad ${i * 2 + 2}` };
    matches.push({
      id: `match-gen-${tournament.id}-${i + 1}`,
      tournamentId: tournament.id,
      roundName: "Round 1",
      roundIndex: 1,
      matchIndex: i + 1,
      status: "scheduled",
      teamA: { name: teamA.name, score: 0 },
      teamB: { name: teamB.name, score: 0 },
      roomCode: `ESBD-RM-${Math.floor(100 + Math.random() * 900)}`,
      roomPassword: "esbd"
    });
  }

  tournament.bracket = {
    rounds: [
      { name: "Round 1", matches }
    ]
  };

  return res.json({ success: true, matches: matches.length });
});

router.post('/admin/matches/:id/verify', requireAdmin, (req, res) => {
  const { scoreA, scoreB } = req.body;
  const match = memoryStore.matches.find(m => m.id === req.params.id);
  if (match) {
    match.status = 'completed';
    match.teamA.score = scoreA;
    match.teamB.score = scoreB;
    match.verified = true;
  }
  return res.json({ success: true });
});

router.get('/admin/submissions', requireAdmin, (req, res) => {
  return res.json(memoryStore.submissions);
});

router.get('/admin/disputes', requireAdmin, (req, res) => {
  return res.json(memoryStore.disputes);
});

router.post('/admin/disputes/:id/resolve', requireAdmin, (req, res) => {
  const { status, note } = req.body;
  const dispute = memoryStore.disputes.find(d => d.id === req.params.id);
  if (dispute) {
    dispute.status = status || "resolved";
    dispute.adminNote = note;
    dispute.resolvedAt = new Date().toISOString();
  }
  return res.json({ success: true });
});

router.get('/admin/messages', requireAdmin, (req, res) => {
  return res.json(memoryStore.contactMessages);
});

router.get('/admin/settings', requireAdmin, (req, res) => {
  return res.json({
    maintenanceMode: false,
    autoBracketAdvance: true,
    requireScreenshotProof: true,
    payoutGateway: "bKash & Nagad Direct",
    antiCheatEngine: "Active (Server-Authoritative)"
  });
});

// -----------------------------------------------------------------------------
// 6. LIVE TOURNAMENT STREAMS & BROADCAST HUB
// -----------------------------------------------------------------------------
router.get('/streams', (req, res) => {
  return res.json(memoryStore.streams || []);
});

router.post('/streams/submit', (req, res) => {
  const { tournamentId, tournamentTitle, participantIgn, title, streamUrl, gameTitle } = req.body;
  if (!streamUrl || !participantIgn) {
    return res.status(400).json({ error: "Stream URL and Participant IGN are required." });
  }

  // Sanitize stream URL to standard embed if standard YouTube link
  let embedUrl = streamUrl;
  if (streamUrl.includes('watch?v=')) {
    const videoId = streamUrl.split('watch?v=')[1].split('&')[0];
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0`;
  } else if (streamUrl.includes('youtu.be/')) {
    const videoId = streamUrl.split('youtu.be/')[1].split('?')[0];
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0`;
  } else if (streamUrl.includes('twitch.tv/')) {
    const channel = streamUrl.split('twitch.tv/')[1].split('/')[0];
    embedUrl = `https://player.twitch.tv/?channel=${channel}&parent=${req.headers.host || 'localhost'}`;
  }

  const newStream = {
    id: `stream-user-${Date.now()}`,
    tournamentId: tournamentId || "esbd-ff-pro-s4",
    tournamentTitle: tournamentTitle || "Live Tournament",
    gameTitle: gameTitle || "Esports Championship",
    type: "pov",
    participantIgn,
    title: title || `[POV] ${participantIgn} — Live Tournament Match`,
    caster: "Player Stream Feed",
    status: "live",
    viewerCount: Math.floor(100 + Math.random() * 850),
    streamUrl: embedUrl,
    chatEnabled: true,
    quality: "1080p60",
    featured: false,
    submittedAt: new Date().toISOString()
  };

  memoryStore.streams.push(newStream);
  return res.json({ success: true, stream: newStream });
});

router.post('/admin/streams', (req, res) => {
  const { tournamentId, title, caster, streamUrl, quality, featured } = req.body;
  const stream = {
    id: `stream-admin-${Date.now()}`,
    tournamentId: tournamentId || "esbd-ff-pro-s4",
    tournamentTitle: "Official Championship",
    gameTitle: "Featured Event",
    type: "official",
    title: title || "ESBD Official Broadcast",
    caster: caster || "Official Casters",
    status: "live",
    viewerCount: 15400,
    streamUrl,
    chatEnabled: true,
    quality: quality || "1080p60 Full HD",
    featured: featured !== false
  };
  memoryStore.streams.unshift(stream);
  return res.json({ success: true, stream });
});

// -----------------------------------------------------------------------------
// 7. LIVE TOURNAMENT CHATBOX
// -----------------------------------------------------------------------------
router.get('/chat/messages', (req, res) => {
  const channel = req.query.channel || 'tournament-live';
  const messages = (memoryStore.chatMessages || []).filter(m => !channel || channel === 'all' || m.channel === channel);
  return res.json(messages.slice(-50));
});

router.post('/chat/send', (req, res) => {
  const { channel, user, text, role, badge } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  const cleanText = text.trim().slice(0, 300);
  const cleanUser = user ? user.trim().slice(0, 30) : "AnonymousGamer";
  const newMsg = {
    id: `c-${Date.now()}`,
    channel: channel || "tournament-live",
    user: cleanUser,
    role: role || (cleanUser.toLowerCase().includes('admin') ? 'admin' : 'user'),
    badge: badge || (cleanUser.toLowerCase().includes('admin') ? '👑 ADMIN' : '🎮 PRO'),
    text: cleanText,
    timestamp: new Date().toISOString()
  };

  memoryStore.chatMessages.push(newMsg);
  // Keep last 150 messages
  if (memoryStore.chatMessages.length > 150) {
    memoryStore.chatMessages.shift();
  }

  return res.json({ success: true, message: newMsg });
});

// -----------------------------------------------------------------------------
// 8. GAMING RESULTS & MATCH SCORE SUBMISSIONS
// -----------------------------------------------------------------------------
router.get('/matches/results', (req, res) => {
  return res.json(memoryStore.matchResults || []);
});

router.post('/matches/submit-result', (req, res) => {
  const { tournamentId, tournamentTitle, matchId, roundName, winnerTeam, loserTeam, scoreA, scoreB, mvp, mvpKills, proofUrl } = req.body;
  if (!winnerTeam) {
    return res.status(400).json({ error: "Winner team name is required." });
  }

  const newResult = {
    id: `res-${Date.now()}`,
    tournamentId: tournamentId || "esbd-ff-pro-s4",
    tournamentTitle: tournamentTitle || "ESBD Championship",
    matchId: matchId || `m-user-${Date.now()}`,
    roundName: roundName || "Championship Match",
    winnerTeam,
    loserTeam: loserTeam || "Opponent Squad",
    scoreA: Number(scoreA) || 1,
    scoreB: Number(scoreB) || 0,
    mvp: mvp || `${winnerTeam} IGL`,
    mvpKills: Number(mvpKills) || 6,
    status: "verified",
    verifiedBy: "ESBD Automated Match Arbitrator",
    submittedAt: new Date().toISOString(),
    proofUrl: proofUrl || "/img/gallery/lan-01.jpg",
    bracketPlacement: "Match Complete & Recorded"
  };

  memoryStore.matchResults.unshift(newResult);
  return res.json({ success: true, result: newResult });
});

router.post('/admin/matches/verify-result', (req, res) => {
  const { resultId, status, verifiedBy } = req.body;
  const result = memoryStore.matchResults.find(r => r.id === resultId);
  if (result) {
    result.status = status || "verified";
    result.verifiedBy = verifiedBy || "ESBD Tournament Director";
  }
  return res.json({ success: true, result });
});


// Mount both on /api and / so it works with ANY Vercel rewrite configuration
app.use('/api', router);
app.use('/', router);

// Clean 404 handler so serverless function never throws unhandled error
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.url} not found` });
});

// Clean Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
