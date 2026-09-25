const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// ---------------------------------------------------------------------------
// JSON-file database
// ---------------------------------------------------------------------------
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error('Failed to parse db.json, starting fresh:', e.message);
    }
  }
  return { users: [], game_accounts: [], app_settings: [] };
}

const db = loadDb();

function saveDb() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// --- Seed ---
function seed() {
  // AppSettings
  const defaultSettings = [{ key: 'gameVersion', value: '3.10.2' }];
  for (const d of defaultSettings) {
    if (!db.app_settings.find(s => s.key === d.key)) {
      db.app_settings.push({ ...d });
    }
  }
  // First user becomes admin so there is always a way in
  if (db.users.length === 0) {
    db.users.push({
      id: crypto.randomUUID(),
      email: 'admin@xztw.local',
      display_name: 'Admin',
      role: 'admin',
      password_hash: bcrypt.hashSync('admin1234', 10),
      created_at: new Date().toISOString()
    });
    console.log('Seeded admin account: admin@xztw.local / admin1234');
  }
  saveDb();
}
seed();

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------
const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'xztw-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// --- Helpers ---
function currentUser(req) {
  return db.users.find(u => u.id === req.session.userId);
}

function publicUser(u) {
  return { id: u.id, email: u.email, display_name: u.display_name, role: u.role };
}

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

function requireAdmin(req, res, next) {
  const user = currentUser(req);
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
  next();
}

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const normalizedEmail = String(email).trim().toLowerCase();
  let user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (user) {
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });
  } else {
    // First login: auto-create UserProfile with role "viewer"
    user = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      display_name: normalizedEmail.split('@')[0],
      role: 'viewer',
      password_hash: await bcrypt.hash(password, 10),
      created_at: new Date().toISOString()
    };
    db.users.push(user);
    saveDb();
  }

  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/auth/me', (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: publicUser(user) });
});

// ---------------------------------------------------------------------------
// GameAccount API
// ---------------------------------------------------------------------------
app.get('/api/game-accounts', requireAuth, (req, res) => {
  const user = currentUser(req);
  let accounts = db.game_accounts;
  if (user.role !== 'admin') {
    accounts = accounts.filter(a => a.visible_to_viewers === true);
  }
  res.json({ accounts });
});

app.get('/api/game-accounts/:id', requireAuth, (req, res) => {
  const user = currentUser(req);
  const account = db.game_accounts.find(a => a.id === req.params.id);
  if (!account) return res.status(404).json({ error: 'Not found' });
  if (user.role !== 'admin' && account.visible_to_viewers !== true) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json({ account });
});

app.post('/api/game-accounts', requireAdmin, (req, res) => {
  const { display_name, username, password, server, settings, visible_to_viewers } = req.body;
  if (!display_name || !username || !password || !server) {
    return res.status(400).json({ error: 'display_name, username, password and server are required' });
  }
  const account = {
    id: crypto.randomUUID(),
    display_name: String(display_name),
    username: String(username),
    password: String(password),
    server: String(server),
    settings: settings && typeof settings === 'object' ? settings : {},
    visible_to_viewers: visible_to_viewers !== false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.game_accounts.push(account);
  saveDb();
  res.status(201).json({ account });
});

app.put('/api/game-accounts/:id', requireAdmin, (req, res) => {
  const account = db.game_accounts.find(a => a.id === req.params.id);
  if (!account) return res.status(404).json({ error: 'Not found' });

  const { display_name, username, password, server, settings, visible_to_viewers } = req.body;
  if (display_name !== undefined) account.display_name = String(display_name);
  if (username !== undefined) account.username = String(username);
  if (password) account.password = String(password); // empty string = keep current
  if (server !== undefined) account.server = String(server);
  if (settings !== undefined && settings !== null && typeof settings === 'object') account.settings = settings;
  if (visible_to_viewers !== undefined) account.visible_to_viewers = Boolean(visible_to_viewers);
  account.updated_at = new Date().toISOString();
  saveDb();
  res.json({ account });
});

app.delete('/api/game-accounts/:id', requireAdmin, (req, res) => {
  const idx = db.game_accounts.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.game_accounts.splice(idx, 1);
  saveDb();
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// AppSettings API
// ---------------------------------------------------------------------------
app.get('/api/app-settings', requireAuth, (req, res) => {
  res.json({ settings: db.app_settings });
});

app.get('/api/app-settings/:key', requireAuth, (req, res) => {
  const setting = db.app_settings.find(s => s.key === req.params.key);
  if (!setting) return res.status(404).json({ error: 'Not found' });
  res.json({ setting });
});

app.put('/api/app-settings/:key', requireAdmin, (req, res) => {
  const { value } = req.body;
  if (value === undefined) return res.status(400).json({ error: 'value is required' });
  let setting = db.app_settings.find(s => s.key === req.params.key);
  if (setting) {
    setting.value = String(value);
  } else {
    setting = { key: req.params.key, value: String(value) };
    db.app_settings.push(setting);
  }
  saveDb();
  res.json({ setting });
});

// ---------------------------------------------------------------------------
// Static files & pages
// ---------------------------------------------------------------------------
app.use('/lib', express.static(path.join(__dirname, '..', 'lib')));
app.use('/auto', express.static(path.join(__dirname, '..', 'auto')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get(['/', '/login'], (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'account.html'));
});

app.get('/run', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'run.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`XZTW Bot Manager listening on http://0.0.0.0:${PORT}`);
});
