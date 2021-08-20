import type { Locales } from '../i18n/i18n-types';
import { writable } from 'svelte/store';

let locale: Locales;
locale = 'en';

export const lang = writable<Locales>(locale);
