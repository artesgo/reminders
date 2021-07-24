import { derived } from 'svelte/store';
import { reminderStore } from './reminders';

export const reminderList = derived(reminderStore, (s) => {
	let reminders: Array<{ order: number; list: string }> = [];
	// get order
	for (let order of Object.keys(s.reminders)) {
		// just grab the first items list name
		if (!!order) {
			reminders.push({
				order: Number.parseInt(order),
				list: Object.keys(s.reminders[order])[0],
			});
		}
	}
	return reminders;
});

export const takodachiMode = derived(reminderStore, (s) => {
	return s.takodachiMode;
});
