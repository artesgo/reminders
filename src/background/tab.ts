export function createTab(url) {
	chrome.tabs.create({ url: chrome.runtime.getURL('index.html') }, () => {
		setTimeout(() => {
			chrome.runtime.sendMessage({
				contextCreateLink: url,
			});
		}, 500);
	});
}
