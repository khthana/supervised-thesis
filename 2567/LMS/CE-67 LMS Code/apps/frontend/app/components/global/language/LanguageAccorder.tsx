import { Accordion, AccordionItem, Button } from '@heroui/react';
// import { LanguageSwitcher } from '@/components/global/language/LanguageSwitcher';

export function LanguageAccorder() {
	return (
		<Accordion className='items-center justify-center'>
			<AccordionItem
				key='1'
				aria-label={'Select Languages'}
				title={'Select Languages'}
				indicator={<span className='material-symbols-outlined'>translate</span>}
			>
				{/* <LanguageSwitcher /> */}
			</AccordionItem>
		</Accordion>
	);
}
