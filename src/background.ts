import { onLinkContext } from './background/context';
import { createNotification } from './background/notification';
import { schedule, getSchedule, deleteScheduled } from './background/scheduler';

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
			chrome.storage.sync.get(alarm.name, (schedule) => {
				// storage get returns the object itself, thus the need to use schedule[key].prop
				if (!!schedule[alarm.name].url) {
					chrome.tabs.create({ url: schedule[alarm.name].url });
				}
				createNotification(
					schedule[alarm.name].description,
					schedule[alarm.name].url || 'Reminder',
				);
			});
		});

		chrome.contextMenus.create({ contexts: ['link'], onclick: onLinkContext });
	}
}

new BackgroundApp();
