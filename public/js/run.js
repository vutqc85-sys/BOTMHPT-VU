// Run page: loads bot libraries, prepares localStorage, loads auto scripts,
// and wires the control buttons to the functions defined in auto*.js.

const urlParams = new URLSearchParams(window.location.search);
const accountId = urlParams.get('id');

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

function writeLogs(msg) {
  const el = document.getElementById('actions');
  const line = document.createElement('div');
  line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

const BOT_BUTTONS = [
  { label: 'Run Daily Auto', fn: 'auto' },
  { label: 'autoDot', fn: 'autoNew' },
  { label: 'Xingtian', fn: 'autoXingtian' },
  { label: 'Auto Local CoT', fn: 'autoCot' },
  { label: 'Auto Heavenly', fn: 'autoCotHeavenly' },
  { label: 'Auto CS', fn: 'autoCotCS' },
  { label: 'Auto Storm', fn: 'autoCotStorm' },
  { label: 'Auto ACS', fn: 'autoCotACS' },
  { label: 'Manual Local', fn: 'autoManualCot' },
  { label: 'Manual CS', fn: 'autoManualCotCS' },
  { label: 'Manual Storm', fn: 'autoManualCotStorm' },
  { label: 'Peach', fn: 'autoPeachEvent' },
  { label: 'Chaos', fn: 'autoChaosBattle' },
  { label: 'SwordFly', fn: 'autoSwordFly' },
  { label: 'Build islands', fn: 'autoBuildConquestReq' },
  { label: 'Atk troops', fn: 'autoPutTroopsConquestReq' },
  { label: 'Def troops', fn: 'autoPutDefTroopsConquestReq' }
];

function renderButtons() {
  const container = document.getElementById('botButtons');
  container.innerHTML = '';
  for (const btn of BOT_BUTTONS) {
    const b = document.createElement('button');
    b.className = 'btn btn-outline-primary btn-sm me-1 mb-1';
    b.textContent = btn.label;
    b.onclick = async () => {
      const fn = window[btn.fn];
      if (typeof fn !== 'function') {
        writeLogs('ERROR: function not found — ' + btn.fn);
        return;
      }
      writeLogs('▶ ' + btn.label);
      try {
        await fn();
        writeLogs('✓ ' + btn.label + ' finished');
      } catch (err) {
        writeLogs('ERROR in ' + btn.label + ': ' + (err && err.message ? err.message : err));
      }
    };
    container.appendChild(b);
  }
}

async function init() {
  writeLogs('Checking access...');

  // Auth
  const authRes = await fetch('/api/auth/me');
  if (!authRes.ok) { window.location.href = '/login'; return; }

  // Account
  if (!accountId) { window.location.href = '/dashboard'; return; }
  const accRes = await fetch(`/api/game-accounts/${accountId}`);
  if (!accRes.ok) { window.location.href = '/dashboard'; return; }
  const accData = await accRes.json();
  const account = accData.account;

  document.getElementById('runTitle').textContent = 'Run bot — ' + account.display_name;

  // gameVersion from AppSettings
  let gameVersion = '3.10.2';
  try {
    const sRes = await fetch('/api/app-settings/gameVersion');
    if (sRes.ok) {
      const sData = await sRes.json();
      if (sData.setting) gameVersion = sData.setting.value;
    }
  } catch { /* keep default */ }

  // 1) Load bot libraries in order
  writeLogs('Loading libraries...');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.11/pako.min.js');
  await loadScript('/lib/crypto-js.min.js');
  await loadScript('/lib/jquery.min.js');
  await loadScript('/lib/encrypt.js');
  await loadScript('/lib/getToken.js');
  await loadScript('/lib/servants.js');
  await loadScript('/lib/miniEvents.js');
  writeLogs('Libraries loaded.');

  // 2) Prepare localStorage for the bot
  localStorage.setItem('gameVersion', gameVersion);
  localStorage.setItem('auths', JSON.stringify([{
    username: account.username,
    password: account.password,
    server: account.server,
    displayName: account.display_name,
    formdata: account.settings || {}
  }]));

  // 3) userIndex=0 in URL (auto.js reads it)
  history.replaceState(null, '', '/run?id=' + accountId + '&userIndex=0');

  // 4) Load automation scripts
  writeLogs('Loading automation scripts...');
  await loadScript('/auto/webBrowser.js');
  await loadScript('/auto/auto.js');
  await loadScript('/auto/autoV2.js');
  await loadScript('/auto/autoV3.js');
  writeLogs('All scripts loaded. Ready — click a button to run.');

  renderButtons();
}

init().catch(err => {
  writeLogs('FATAL: ' + (err && err.message ? err.message : err));
});
