import { LearnifyLayout } from '@/components/learnify/Layout';
import type { UserTypes } from '@/interfaces/sharetype';
import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from '@heroui/react';
import { useLoaderData, useOutletContext } from 'react-router';
import type { ParentLoaderData } from '~/app/routes/_lnf';

interface LMSLayoutProps {
	children: React.ReactNode;
	breadcrumbs: string[]; //required
	tabs?: string[];
	onTabChange?: (tab: string) => void;
	selectedTab?: string;
}

export function LMSLayout({ children, breadcrumbs, tabs, onTabChange, selectedTab }: LMSLayoutProps) {
	const { loaderData } = useOutletContext<{ loaderData: ParentLoaderData }>();
	const user = loaderData.user as UserTypes;
	return (
		<LearnifyLayout user={user}>
			<div className='flex flex-col min-h-screen max-w-[2000px] min-w-[1100px] w-full'>
				<Breadcrumbs size='lg' itemsAfterCollapse={2} itemsBeforeCollapse={1} className='content px-5 mb-5'>
					{breadcrumbs.map((item) => (
						<BreadcrumbItem href={'/'} key={item}>
							{item}
						</BreadcrumbItem>
					))}
					{/* i18n.language === 'th' && items.name.th ? items.name.th : items.name.en */}
				</Breadcrumbs>

				{tabs && (
					<Tabs
						color='primary'
						variant='underlined'
						className='w-full md:w-auto mb-5 ml-4 lg:mb-5'
						selectedKey={selectedTab}
						onSelectionChange={(key) => onTabChange?.(key.toString())}
					>
						{tabs?.map((tab) => (
							<Tab key={tab} title={tab} />
						))}
					</Tabs>
				)}

				<div className='flex-1'>{children}</div>
			</div>
		</LearnifyLayout>
	);
}
