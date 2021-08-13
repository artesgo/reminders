import { reminderStore, Reminder } from './reminders';
import { splitter } from '../background/helpers';

export function parseStorage(storage) {
	let reminders = [];
	for (let id of Object.keys(storage)) {
		const reminder: Reminder = storage[id];
		createList(reminder.list, reminder.order);
		reminders.push(reminder);
		updateListOrder(reminder.order);
		updateIndex(reminder.index);
	}
	populateStore(reminders);
}

/**
 * Populates the svelte store with data from local storage
 * @param reminders
 */
function populateStore(reminders: Reminder[]) {
	const lists = {};
	reminders.map((reminder) => {
		const { list, order } = reminder;
		if (lists[order] === undefined) {
			lists[order] = {};
			lists[order][list] = [];
		}
		lists[order][list].push(reminder);
	});

	reminderStore.update((s) => ({
		...s,
		populated: true,
		reminders: lists,
	}));
}

function updateIndex(index) {
	if (!!index) {
		reminderStore.update((s) => ({
			...s,
			index: s.index > index ? s.index : index,
		}));
	}
}

/**
 * Tracks largest reminder index for later use
 * @param index
 */
function updateListOrder(order: number) {
	reminderStore.update((s) => ({
		...s,
		listOrder: s.listOrder > order ? s.listOrder : order,
	}));
}

/**
 * Creates new reminder list
 * @param list
 * @param order
 */
export function createList(list: string, order: number) {
	const activateTakodachis = list.indexOf('ina ina ina') > -1;
	reminderStore.update((s) => {
		if (s.reminders[order] === undefined) {
			return {
				...s,
				takodachiMode: s.takodachiMode ? s.takodachiMode : activateTakodachis,
				reminders: {
					...s.reminders,
					[order]: {
						...s.reminders[order],
						[list]: [],
					},
				},
			};
		}
		return s;
	});
}

/**
 * Create or Updates Reminder Item in the svelte store
 * parses the reminder and saves to local storage
 * @param reminder
 * @param newItem
 */
export function createUpdateItem(reminder: Reminder, populated: boolean, newItem?: boolean) {
	// list--order--url--description
	const { list, order, url, description } = reminder;
	reminderStore.update((s) => ({
		...s,
		reminders: {
			...s.reminders,
			[order]: {
				[list]: []
					.concat(
						s.reminders[order][list].map((t) => {
							if (t && t.id === reminder.id) {
								t.url = url;
								t.description = description;
								t.when = reminder.when;
							}
							return t;
						}),
					)
					.concat(newItem ? [reminder] : []),
			},
		},
	}));
	// send when to storage
	if (reminderStore) {
	}
	chrome.runtime.sendMessage({ createSchedule: true, reminder }, function (response) {
		if (response && response.success) {
			console.log(response.success);
		}
	});
}

/**
 * Deletes the Reminder Item
 * @param reminder
 */
export function deleteItem(reminder: Reminder) {
	const { list, order } = reminder;
	reminderStore.update((s) => ({
		...s,
		reminders: {
			...s.reminders,
			[order]: {
				[list]: [].concat(
					s.reminders[order][list].filter((t) => {
						if (t && t.id !== reminder.id) {
							return t;
						}
					}),
				),
			},
		},
	}));

	chrome.runtime.sendMessage({ deleteScheduled: true, reminder }, function (success) {
		console.log('deleted', success);
	});
}

/**
 * Use the parameters below to create the proper data to pass to createUpdate
 * @param order
 * @param list
 * @param description
 * @param when
 * @param url
 */
export function addReminder(
	order: number,
	list: string,
	description: string,
	when: number,
	url: string,
	populated: boolean,
	index: number,
) {
	// list--order--url--description
	// when
	const id = `${list}${splitter}${index}`;
	const reminder: Reminder = { index, id, description, url, when, list, order };
	createUpdateItem(reminder, populated, true);
}
