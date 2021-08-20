import { createNotification } from './background/notification';
import { schedule, getSchedule, deleteScheduled, weekInMinutes } from './background/scheduler';
import { createTab } from './background/tab';

// spin up listeners, add contextMenu items
export class BackgroundApp {
	constructor() {
		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			schedule(request, sender, sendResponse);
			getSchedule(request, sender, sendResponse);
			deleteScheduled(request, sender, sendResponse);
			return true;
		});

		chrome.alarms.onAlarm.addListener((alarm) => {
			chrome.storage.sync.get(alarm.name, (reminder) => {
				// storage get returns the object itself, thus the need to use schedule[key].prop
				if (!!reminder[alarm.name].url) {
					chrome.tabs.create({ url: reminder[alarm.name].url });
				}
				console.log('schedule', reminder);
				console.log('alarm', alarm);
				if (reminder[alarm.name].recur) {
					reminder[alarm.name].when += weekInMinutes * 60 * 1000;
					// updates
					chrome.storage.sync.set({
						[alarm.name]: reminder[alarm.name],
					});
				}
				createNotification(
					reminder[alarm.name].description,
					reminder[alarm.name].url || 'Reminder',
				);
			});
		});

		chrome.runtime.onInstalled.addListener(() => {
			chrome.contextMenus.create({
				id: 'reminder-link',
				contexts: ['link'],
				title: 'Create Reminder with Link',
			});
			chrome.contextMenus.create({
				id: 'reminder-page',
				contexts: ['page'],
				title: 'Create Reminder with Page',
			});
		});

		chrome.contextMenus.onClicked.addListener((menu) => {
			if (menu.menuItemId === 'reminder-link') {
				createTab(menu.linkUrl);
			}
			if (menu.menuItemId === 'reminder-page') {
				createTab(menu.pageUrl);
			}
		});
	}
}

new BackgroundApp();
