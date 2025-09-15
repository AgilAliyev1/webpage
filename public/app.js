async function fetchMe() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch (e) {
    return null;
  }
}

let __DATA_CACHE = null;
async function loadData() {
  if (__DATA_CACHE) return __DATA_CACHE;
  if (Array.isArray(window.__LAHVO_DATA__) && window.__LAHVO_DATA__.length) {
    __DATA_CACHE = window.__LAHVO_DATA__;
    return __DATA_CACHE;
  }
  try {
    const res = await fetch('C:\\Users\\user\\webpage\\public/data.json');
    if (res.ok) {
      const data = await res.json();
      __DATA_CACHE = data;
      return data;
    }
  } catch (e) {}
  return [];
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
      <h3><a href="${x.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${x.title}</a></h3>
      <div class="badge">${x.type}</div>
      <div class="badge">${x.location}</div>
      <p style="color:#cbd5e1">${x.organization}</p>
      <p>${x.description}</p>
      ${x.tags ? `<p style="color:#94a3b8">Tags: ${x.tags}</p>` : ''}
    `;
    el.addEventListener('click', () => { window.open(x.url, '_blank', 'noopener'); });
    results.appendChild(el);
  }
}

async function search() {
  const q = document.getElementById('q').value.trim().toLowerCase();
  const type = document.getElementById('type').value.trim().toLowerCase();
  const location = document.getElementById('location').value.trim().toLowerCase();
  const tags = document.getElementById('tags').value.trim().toLowerCase();
  const items = await loadData();
  const filtered = items.filter(x => {
    const title = (x.title || '').toLowerCase();
    const org = (x.organization || '').toLowerCase();
    const desc = (x.description || '').toLowerCase();
    const loc = (x.location || '').toLowerCase();
    const tagStr = (x.tags || '').toLowerCase();
    const matchesQ = q ? (title.includes(q) || org.includes(q) || desc.includes(q)) : true;
    const matchesType = type ? (String(x.type).toLowerCase() === type) : true;
    const matchesLoc = location ? loc.includes(location) : true;
    const matchesTags = tags ? tagStr.includes(tags) : true;
    return matchesQ && matchesType && matchesLoc && matchesTags;
  });
  renderItems(filtered);
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
  const createBtn = document.getElementById('createBtn');
  if (createBtn) {
    // Optional: keep client-only experience creation disabled without backend
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Posting is temporarily disabled in this demo build.');
    });
  }
  await search();
}

window.addEventListener('DOMContentLoaded', init);


