chrome.action.onClicked.addListener(() => {
  const appUrl = "https://script.google.com/a/macros/hispacontact.com/s/AKfycbztIQ0e8ICNd3Nq07NkkiKubVIXksGg2WJ-ZoZUKOFJHIvLHRyhEreeD7PL2IbNunzPng/exec";
  chrome.tabs.create({ url: appUrl });
});
