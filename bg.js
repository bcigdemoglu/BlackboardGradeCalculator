chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab) {
   chrome.tabs.sendMessage(tab.id, {displayGraderData: true}, function(response) {
    if (response.indexOf("Total calculated: ") > -1)
      alert(response);
    });
  }
});