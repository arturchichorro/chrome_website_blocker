let sites = [];

document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.local.get('blockedSites');
  sites = result.blockedSites || [];
  renderSites();

  document.getElementById('addSite').addEventListener('click', addNewSite);
  document.getElementById('save').addEventListener('click', saveChanges);
});

function renderSites() {
  const container = document.getElementById('sites-container');
  container.innerHTML = '';

  sites.forEach((site, index) => {
    const div = document.createElement('div');
    div.className = 'site-entry';
    div.innerHTML = `
      <input type="text" value="${site.url}" placeholder="Website URL (e.g., youtube.com)">
      <input type="number" value="${site.startHour}" min="0" max="23" placeholder="Start hour">
      <input type="number" value="${site.endHour}" min="0" max="23" placeholder="End hour">
      <button onclick="removeSite(${index})">Remove</button>
    `;
    container.appendChild(div);
  });
}

function addNewSite() {
  sites.push({ url: '', startHour: 0, endHour: 0 });
  renderSites();
}

function removeSite(index) {
  sites.splice(index, 1);
  renderSites();
}

async function saveChanges() {
  const siteEntries = document.getElementsByClassName('site-entry');
  sites = Array.from(siteEntries).map(entry => {
    const inputs = entry.getElementsByTagName('input');
    return {
      url: inputs[0].value,
      startHour: parseInt(inputs[1].value),
      endHour: parseInt(inputs[2].value)
    };
  });

  await chrome.storage.local.set({ blockedSites: sites });
  alert('Settings saved!');
}