// import { Divider } from '@heroui/react';
// import { Link } from '@heroui/react';
// import { useLocation, useNavigate } from 'react-router';
// import { useTranslation } from 'react-i18next';

// export function LanguageSwitcher() {
// 	const { i18n } = useTranslation();
// 	const location = useLocation();
// 	const navigate = useNavigate();

// 	const handleClickChangeLanguage = async (newLocale: string) => {
// 		const searchParams = new URLSearchParams(location.search);
// 		searchParams.set('lng', newLocale);
// 		navigate(`${location.pathname}?${searchParams.toString()}`);
// 		await i18n.changeLanguage(newLocale);
// 	};

// 	return (
// 		<div className='max-w-md'>
// 			<div className='flex h-5 items-center space-x-4'>
// 				<Link
// 					color='foreground'
// 					onPress={() => handleClickChangeLanguage('en')}
// 					onKeyDown={() => handleClickChangeLanguage('en')}
// 					className={` text-[--color-text] cursor-pointer ${i18n.language === 'en' ? 'font-thin' : ''}`}
// 					style={{ fontSize: '14px' }}
// 				>
// 					English
// 				</Link>
// 				<Divider orientation='vertical' />
// 				<Link
// 					color='foreground'
// 					onPress={() => handleClickChangeLanguage('th')}
// 					onKeyDown={() => handleClickChangeLanguage('th')}
// 					className={` text-[--color-text] cursor-pointer ${i18n.language === 'th' ? 'font-thin' : ''}`}
// 					style={{ fontSize: '14px', marginRight: '10px' }}
// 				>
// 					ไทย
// 				</Link>
// 			</div>
// 		</div>
// 	);
// }
