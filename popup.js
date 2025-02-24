let sites = [];

document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.local.get('blockedSites');
  sites = result.blockedSites || [];
  renderSites();

  document.getElementById('addSite').addEventListener('click', addNewSite);
  document.getElementById('save').addEventListener('click', saveChanges);
  
  document.getElementById('sites-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const index = parseInt(e.target.dataset.index);
      removeSite(index);
    }
  });
});

function renderSites() {
  const container = document.getElementById('sites-container');
  container.innerHTML = '';

  sites.forEach((site, index) => {
    const div = document.createElement('div');
    div.className = 'site-entry';
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = site.url;
    urlInput.placeholder = 'Website URL (e.g., youtube.com)';
    
    const startInput = document.createElement('input');
    startInput.type = 'number';
    startInput.value = site.startHour;
    startInput.min = '0';
    startInput.max = '23';
    startInput.placeholder = 'Start hour';
    
    const endInput = document.createElement('input');
    endInput.type = 'number';
    endInput.value = site.endHour;
    endInput.min = '0';
    endInput.max = '23';
    endInput.placeholder = 'End hour';
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-btn';
    removeButton.dataset.index = index;

    div.appendChild(urlInput);
    div.appendChild(startInput);
    div.appendChild(endInput);
    div.appendChild(removeButton);
    
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