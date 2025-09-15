async function fetchMe() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

function renderItems(items) {
  const results = document.getElementById('results');
  results.innerHTML = '';
  if (!items || items.length === 0) {
    results.innerHTML = '<p>No results</p>';
    return;
  }
  for (const x of items) {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <h3>${x.title}</h3>
      <div class="badge">${x.type}</div>
      <div class="badge">${x.location}</div>
      <p style="color:#cbd5e1">${x.organization}</p>
      <p>${x.description}</p>
      ${x.tags ? `<p style="color:#94a3b8">Tags: ${x.tags}</p>` : ''}
    `;
    results.appendChild(el);
  }
}

async function search() {
  const q = document.getElementById('q').value;
  const type = document.getElementById('type').value;
  const location = document.getElementById('location').value;
  const tags = document.getElementById('tags').value;
  const url = new URL('/api/experiences', window.location.origin);
  if (q) url.searchParams.set('q', q);
  if (type) url.searchParams.set('type', type);
  if (location) url.searchParams.set('location', location);
  if (tags) url.searchParams.set('tags', tags);
  const res = await fetch(url);
  const data = await res.json();
  renderItems(data.items);
}

async function createExperience() {
  const body = {
    title: document.getElementById('c_title').value,
    organization: document.getElementById('c_org').value,
    location: document.getElementById('c_location').value,
    type: document.getElementById('c_type').value,
    description: document.getElementById('c_desc').value,
    tags: document.getElementById('c_tags').value,
  };
  const res = await fetch('/api/experiences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (res.ok) {
    await search();
    document.getElementById('c_title').value = '';
    document.getElementById('c_org').value = '';
    document.getElementById('c_location').value = '';
    document.getElementById('c_type').value = 'volunteer';
    document.getElementById('c_desc').value = '';
    document.getElementById('c_tags').value = '';
  } else {
    alert('Failed to create');
  }
}

async function init() {
  const user = await fetchMe();
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const createSection = document.getElementById('createSection');

  if (user) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (createSection) createSection.style.display = 'block';
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      window.location.reload();
    });
  }

  document.getElementById('searchBtn').addEventListener('click', search);
  document.getElementById('createBtn').addEventListener('click', createExperience);
  await search();
}

window.addEventListener('DOMContentLoaded', init);


