// import Backend from 'i18next-fs-backend';
// import { resolve } from 'node:path';
// import { RemixI18Next } from 'remix-i18next/server';
// import i18n from '@/config/i18n';
// import { localeSession } from '@/server/sessions/i18n.server';

// const i18next = new RemixI18Next({
// 	detection: {
// 		supportedLanguages: i18n.supportedLngs,
// 		fallbackLanguage: i18n.fallbackLng,
// 		cookie: localeSession,
// 	},
// 	i18next: {
// 		...i18n,
// 		backend: {
// 			loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
// 		},
// 	},
// 	backend: Backend,
// 	plugins: [Backend],
// });

// export default i18next;
