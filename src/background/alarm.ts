export function getAlarms(sendResponse) {
	chrome.storage.sync.get(null, (data) => {
		if (data) {
			console.log('getAlarms', data);
			sendResponse({
				alarms: data,
			});
		}
	});
}
