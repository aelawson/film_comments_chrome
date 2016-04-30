chrome.browserAction.onClicked.addListener(function(activeTab){
  chrome.tabs.executeScript({
    file: 'index.js'
  });
});
