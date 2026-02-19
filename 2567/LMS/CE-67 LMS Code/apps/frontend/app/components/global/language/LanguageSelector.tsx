// import { Select, SelectItem, Avatar } from '@heroui/react';
// import { useLocation, useNavigate } from 'react-router';
// import { useTranslation } from 'react-i18next';

// export function LanguageSelector() {
// 	const { t, i18n } = useTranslation();
// 	const location = useLocation();
// 	const navigate = useNavigate();

// 	const handleLanguageChange = async (
// 		event: React.ChangeEvent<HTMLSelectElement>,
// 	) => {
// 		const newLocale = event.target.value;
// 		const searchParams = new URLSearchParams(location.search);
// 		searchParams.set('lng', newLocale);
// 		navigate(`${location.pathname}?${searchParams.toString()}`);
// 		await i18n.changeLanguage(newLocale);
// 	};

// 	return (
// 		<Select
// 			className='min-w-48'
// 			// label={t('comp.LanguageSelector.placeholder')}
// 			placeholder={t('comp.LanguageSelector.placeholder')}
// 			aria-label={t('comp.LanguageSelector.placeholder')}
// 			selectedKeys={[i18n.language]}
// 			onChange={handleLanguageChange}
// 			startContent={
// 				<Avatar
// 					src={
// 						i18n.language === 'en'
// 							? '/images/Flag_of_the_United_States.svg'
// 							: '/images/Flag_of_Thailand.svg'
// 					}
// 					size='sm'
// 					alt={i18n.language === 'en' ? 'English' : 'ภาษาไทย'}
// 					showFallback={true}
// 					name={i18n.language === 'en' ? 'English' : 'ไทย'}
// 				/>
// 			}
// 		>
// 			<SelectItem
// 				key='en'
// 				startContent={
// 					<Avatar
// 						src='/images/Flag_of_the_United_States.svg'
// 						size='sm'
// 						alt='English'
// 						showFallback={true}
// 						name='English'
// 					/>
// 				}
// 			>
// 				English
// 			</SelectItem>
// 			<SelectItem
// 				key='th'
// 				startContent={
// 					<Avatar
// 						src='/images/Flag_of_Thailand.svg'
// 						size='sm'
// 						alt='ภาษาไทย'
// 						showFallback={true}
// 						name='ไทย'
// 					/>
// 				}
// 			>
// 				ภาษาไทย
// 			</SelectItem>
// 		</Select>
// 	);
// }
