import { writable } from 'svelte/store';

export interface Reminder {
	url: string;
	id: string;
	description: string;
	list: string;
	order: number;
	when: number;
	index: number;
}

type ReminderArrayDef = {
	[key: string]: Array<Reminder>;
};

export type ReminderState = {
	reminders: {
		[index: number]: ReminderArrayDef;
	};
	index: number;
	listOrder: number;
	populated: boolean;
	takodachiMode: boolean;
};

const initialState: ReminderState = {
	reminders: {},
	index: 0,
	listOrder: 0,
	populated: false,
	takodachiMode: false,
};

export const reminderStore = writable(initialState);
