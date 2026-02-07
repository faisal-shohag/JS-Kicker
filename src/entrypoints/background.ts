

export default defineBackground(() => {
    chrome.runtime.onInstalled.addListener(() => {


     chrome.contextMenus.create({
      id: 'sync',
      title: '♾️ Sync Testcases(Dev in)',
      contexts: ['all'], 
    });


    chrome.contextMenus.create({
      id: 'shortcuts',
      title: '🎮 Shortcuts',
      contexts: ['all'], 
    });


 
     chrome.contextMenus.create({
      id: 'about',
      title: '🧬 About',
      contexts: ['all'],
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: info.menuItemId });
    }
  });

});
