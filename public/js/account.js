const urlParams = new URLSearchParams(window.location.search);
const accountId = urlParams.get('id');

function esc(s) {
  const div = document.createElement('div');
  div.textContent = s == null ? '' : String(s);
  return div.innerHTML;
}

async function init() {
  // Auth check
  const authRes = await fetch('/api/auth/me');
  if (!authRes.ok) { window.location.href = '/login'; return; }
  const authData = await authRes.json();
  const user = authData.user;

  // Viewer → dashboard
  if (user.role !== 'admin') { window.location.href = '/dashboard'; return; }

  // Header
  document.getElementById('navDisplayName').textContent = user.display_name;
  const badge = document.getElementById('navRoleBadge');
  badge.textContent = user.role;
  badge.className = 'badge bg-danger';

  // Account
  if (!accountId) { window.location.href = '/dashboard'; return; }
  const res = await fetch(`/api/game-accounts/${accountId}`);
  if (!res.ok) { window.location.href = '/dashboard'; return; }
  const data = await res.json();
  const account = data.account;

  document.getElementById('pageTitle').textContent = `Account: ${account.display_name}`;
  document.getElementById('displayName').value = account.display_name;
  document.getElementById('username').value = account.username;
  document.getElementById('password').value = '';
  document.getElementById('server').value = account.server;
  document.getElementById('visibleToViewers').checked = account.visible_to_viewers;

  renderSettings(account.settings || {});
}

function renderSettings(settings) {
  const container = document.getElementById('settingsContainer');
  container.innerHTML = '';

  for (const group of SETTING_GROUPS) {
    const card = document.createElement('div');
    card.className = 'card bg-dark border-secondary mb-3';

    let fieldsHtml = '';
    for (const field of group.fields) {
      fieldsHtml += renderField(field, settings[field.key]);
    }

    card.innerHTML = `
      <div class="card-header fw-semibold">${group.name}</div>
      <div class="card-body">
        <div class="row">${fieldsHtml}</div>
      </div>`;
    container.appendChild(card);
  }
}

function renderField(field, value) {
  const { key, type, label } = field;

  if (type === 'checkbox') {
    return `
      <div class="col-md-4 col-lg-3 mb-2">
        <div class="form-check">
          <input class="form-check-input setting-field" type="checkbox" data-key="${key}" data-type="checkbox"
                 id="f_${key}" ${value === true ? 'checked' : ''}>
          <label class="form-check-label" for="f_${key}">${label}</label>
        </div>
      </div>`;
  }

  let input;
  if (type === 'select') {
    const opts = field.options.map(o =>
      `<option value="${o}" ${String(value) === o ? 'selected' : ''}>${o}</option>`
    ).join('');
    input = `
      <select class="form-select setting-field" data-key="${key}" data-type="select" id="f_${key}">
        <option value="">--</option>
        ${opts}
      </select>`;
  } else if (type === 'num') {
    input = `<input type="number" class="form-control setting-field" data-key="${key}" data-type="num" id="f_${key}" value="${value != null ? esc(value) : ''}">`;
  } else {
    input = `<input type="text" class="form-control setting-field" data-key="${key}" data-type="text" id="f_${key}" value="${esc(value)}">`;
  }

  return `
    <div class="col-md-4 col-lg-3 mb-3">
      <label class="form-label" for="f_${key}">${label}</label>
      ${input}
    </div>`;
}

function collectSettings() {
  const settings = {};
  document.querySelectorAll('.setting-field').forEach(el => {
    const key = el.dataset.key;
    const type = el.dataset.type;
    if (type === 'checkbox') {
      settings[key] = el.checked;
    } else if (el.value !== '') {
      settings[key] = type === 'num' ? parseInt(el.value, 10) : el.value;
    }
  });
  return settings;
}

async function saveAccount() {
  const payload = {
    display_name: document.getElementById('displayName').value.trim(),
    username: document.getElementById('username').value.trim(),
    server: document.getElementById('server').value.trim(),
    visible_to_viewers: document.getElementById('visibleToViewers').checked,
    settings: collectSettings()
  };

  // blank password = keep current
  const password = document.getElementById('password').value;
  if (password) payload.password = password;

  if (!payload.display_name || !payload.username || !payload.server) {
    alert('Vui lòng điền đủ Display Name, Login và Server.');
    return;
  }

  const res = await fetch(`/api/game-accounts/${accountId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    alert('Đã lưu!');
  } else {
    const data = await res.json();
    alert(data.error || 'Save failed');
  }
}

async function deleteAndGo() {
  if (!confirm('Xóa tài khoản này?')) return;
  const res = await fetch(`/api/game-accounts/${accountId}`, { method: 'DELETE' });
  if (res.ok) window.location.href = '/dashboard';
}

init();
