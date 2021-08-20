import { createNotification } from './notification';
import { getAlarms } from './alarm';

export const minute = 1;
export const dayInMinutes = 60 * 24;
export const weekInMinutes = dayInMinutes * 7;

export function schedule(request, sender, sendResponse) {
	if (request.createSchedule) {
		let { reminder } = request;
		let recur = reminder.recur ? weekInMinutes : null;
		console.log(recur);
		// alarms are getting created
		chrome.alarms.create(reminder.id, {
			when: reminder.when,
			periodInMinutes: recur,
		});
		chrome.storage.sync.set({
			[reminder.id]: reminder,
		});
		createNotification(reminder.description, `${reminder.url} is scheduled`);
	}
}

export function getSchedule(request, sender, sendResponse) {
	if (request.previousSchedules) {
		getAlarms(sendResponse);
	}
}

export function deleteScheduled(request, sender, sendResponse) {
	if (request.deleteScheduled) {
		let { reminder } = request;
		chrome.storage.sync.get(reminder.id, (data) => {
			chrome.storage.sync.remove(reminder.id);
		});
		getAlarms(sendResponse);
	}
}
