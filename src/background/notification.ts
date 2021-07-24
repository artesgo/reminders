export function createNotification(title, message) {
	chrome.notifications.create({
		iconUrl: './icon/arrow-down--128--blue.png',
		type: 'basic',
		title: title,
		message: message,
		requireInteraction: false,
	});
}
