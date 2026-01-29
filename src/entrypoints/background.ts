

export default defineBackground(() => {
    chrome.runtime.onInstalled.addListener(() => {


     chrome.contextMenus.create({
      id: 'sync',
      title: 'Sync Testcases',
      contexts: ['all'], 
    });


    // chrome.contextMenus.create({
    //   id: 'run_manually',
    //   title: 'Run Manually',
    //   contexts: ['all'], 
    // });


 
     chrome.contextMenus.create({
      id: 'about',
      title: 'About',
      contexts: ['all'],
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: info.menuItemId });
    }
  });

});
