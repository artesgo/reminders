import { i18n } from 'typesafe-i18n';
import { en } from './locales/en';
import { jp } from './locales/jp';

const localeTranslations = {
	en,
	jp,
};

const loadLocale = (locale) => localeTranslations[locale];

const initFormatters = (locale) => {
	const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' });
	return {
		weekday: (value) => dateFormatter.format(value),
	};
};

export const L = i18n(loadLocale, initFormatters);
