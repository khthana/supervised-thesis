// import { useTranslation } from 'react-i18next';
// import { useLocation, useNavigate } from 'react-router';

// export function LanguageButton() {
// 	const { i18n } = useTranslation();
// 	const navigate = useNavigate();
// 	const location = useLocation(); // เพิ่มบรรทัดนี้เพื่อรับค่า location

// 	const handleLanguageChange = async () => {
// 		const newLocale = i18n.language === 'en' ? 'th' : 'en';

// 		console.log('newLocale', newLocale);

// 		try {
// 			// อัพเดต URL ด้วยภาษาใหม่
// 			const searchParams = new URLSearchParams(location.search);
// 			searchParams.set('lng', newLocale);
// 			navigate(`${location.pathname}?${searchParams.toString()}`, {
// 				replace: true,
// 			});

// 			// เปลี่ยนภาษาใน i18n
// 			await i18n.changeLanguage(newLocale);
// 		} catch (error) {
// 			console.error('Error changing language:', error);
// 		}
// 	};

// 	return (
// 		<div>
// 			<button
// 				type='button'
// 				onClick={handleLanguageChange}
// 				className='LanguageButton'
// 			>
// 				{i18n.language === 'th' ? 'Th' : 'En'}
// 			</button>
// 		</div>
// 	);
// }
