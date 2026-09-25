let currentUser = null;
let modal = null;

async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/login';
}

function esc(s) {
  const div = document.createElement('div');
  div.textContent = s == null ? '' : String(s);
  return div.innerHTML;
}

async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) { window.location.href = '/login'; return null; }
    const data = await res.json();
    return data.user;
  } catch {
    window.location.href = '/login';
    return null;
  }
}

async function loadAccounts() {
  const res = await fetch('/api/game-accounts');
  if (res.status === 401) { window.location.href = '/login'; return; }
  const data = await res.json();
  renderAccounts(data.accounts || []);
}

function renderAccounts(accounts) {
  const tbody = document.getElementById('accountsList');
  const noAccounts = document.getElementById('noAccounts');
  tbody.innerHTML = '';

  if (accounts.length === 0) {
    noAccounts.classList.remove('d-none');
    return;
  }
  noAccounts.classList.add('d-none');

  const isAdmin = currentUser.role === 'admin';
  for (const acc of accounts) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${esc(acc.display_name)}</td>
      <td>${esc(acc.username)}</td>
      <td>${esc(acc.server)}</td>
      <td>
        <button class="btn btn-success btn-sm me-1" onclick="window.open('/run?id=${acc.id}', '_blank')">Run</button>
        ${isAdmin ? `
          <button class="btn btn-outline-warning btn-sm me-1" onclick="openEditModal('${acc.id}')">Edit</button>
          <button class="btn btn-outline-danger btn-sm" onclick="deleteAccount('${acc.id}')">Delete</button>` : ''}
      </td>`;
    tbody.appendChild(tr);
  }
}

function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Thêm tài khoản game';
  document.getElementById('editId').value = '';
  document.getElementById('mDisplayName').value = '';
  document.getElementById('mUsername').value = '';
  document.getElementById('mPassword').value = '';
  document.getElementById('mServer').value = '';
  document.getElementById('mVisible').checked = true;
  modal.show();
}

function openEditModal(id) {
  fetch(`/api/game-accounts/${id}`)
    .then(r => r.json())
    .then(data => {
      if (!data.account) return;
      const acc = data.account;
      document.getElementById('modalTitle').textContent = 'Sửa tài khoản';
      document.getElementById('editId').value = acc.id;
      document.getElementById('mDisplayName').value = acc.display_name;
      document.getElementById('mUsername').value = acc.username;
      document.getElementById('mPassword').value = acc.password;
      document.getElementById('mServer').value = acc.server;
      document.getElementById('mVisible').checked = acc.visible_to_viewers;
      modal.show();
    });
}

async function saveAccount() {
  const id = document.getElementById('editId').value;
  const payload = {
    display_name: document.getElementById('mDisplayName').value.trim(),
    username: document.getElementById('mUsername').value.trim(),
    password: document.getElementById('mPassword').value,
    server: document.getElementById('mServer').value.trim(),
    visible_to_viewers: document.getElementById('mVisible').checked
  };

  if (!payload.display_name || !payload.username || !payload.password || !payload.server) {
    alert('Vui lòng điền đủ các trường.');
    return;
  }

  const url = id ? `/api/game-accounts/${id}` : '/api/game-accounts';
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    modal.hide();
    loadAccounts();
  } else {
    const data = await res.json();
    alert(data.error || 'Save failed');
  }
}

async function deleteAccount(id) {
  if (!confirm('Xóa tài khoản này?')) return;
  const res = await fetch(`/api/game-accounts/${id}`, { method: 'DELETE' });
  if (res.ok) loadAccounts();
}

async function init() {
  currentUser = await checkAuth();
  if (!currentUser) return;

  modal = new bootstrap.Modal(document.getElementById('accountModal'));

  document.getElementById('navDisplayName').textContent = currentUser.display_name;
  const badge = document.getElementById('navRoleBadge');
  badge.textContent = currentUser.role;
  badge.className = 'badge ' + (currentUser.role === 'admin' ? 'bg-danger' : 'bg-secondary');

  if (currentUser.role === 'admin') {
    document.getElementById('addBtn').classList.remove('d-none');
  }

  await loadAccounts();
}

init();
