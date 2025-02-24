chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return; // Only handle main frame navigation
  
    const result = await chrome.storage.local.get('blockedSites');
    const blockedSites = result.blockedSites || [];
    
    const url = new URL(details.url);
    const currentHour = new Date().getHours();
  
    for (const site of blockedSites) {
      if (url.hostname.includes(site.url)) {
        if (isTimeBlocked(currentHour, site.startHour, site.endHour)) {
          chrome.tabs.update(details.tabId, {
            url: "about:blank"
          });
        }
        break;
      }
    }
  });
  
  function isTimeBlocked(currentHour, startHour, endHour) {
    if (startHour <= endHour) {
      return currentHour >= startHour && currentHour < endHour;
    } else {
      return currentHour >= startHour || currentHour < endHour;
    }
  }