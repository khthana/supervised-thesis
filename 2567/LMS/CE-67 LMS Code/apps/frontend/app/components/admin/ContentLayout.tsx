import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import { useLocation } from 'react-router';

export interface TabItem {
	key: string;
	title: string;
	content: React.ReactNode;
}

interface ContentLayoutProps {
	children?: React.ReactNode;
	tabs?: TabItem[];
}

export function ContentLayout({ children, tabs }: ContentLayoutProps) {
	const [activeTab, setActiveTab] = useState(tabs?.[0]?.key || '');
	const handleTabChange = (key: React.Key) => {
		setActiveTab(key.toString());
	};

	return (
		<main className='admin-content flex flex-1 flex-col h-full overflow-hidden'>
			<div className='flex-shrink-0 p-4 lg:p-6'>
				<ContentBreadCrumbs activeTab={activeTab} tabs={tabs} />
			</div>
			{tabs && (
				<div className='flex-shrink-0 px-4 lg:px-6'>
					<Tabs aria-label='Content Tabs' selectedKey={activeTab} onSelectionChange={handleTabChange}>
						{tabs.map((tab) => (
							<Tab key={tab.key} title={tab.title} />
						))}
					</Tabs>
				</div>
			)}
			<div className='flex-1 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 overflow-y-auto'>
				<div className='flex flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
					{tabs ? tabs.find((tab) => tab.key === activeTab)?.content : children}
				</div>
			</div>
		</main>
	);
}

interface ContentBreadCrumbsProps {
	activeTab?: string;
	tabs?: TabItem[];
}

function ContentBreadCrumbs({ activeTab, tabs }: ContentBreadCrumbsProps) {
	const location = useLocation();
	const paths = location.pathname.split('/').filter((path) => path !== '');

	const breadcrumbs = paths.reduce(
		(acc, path, index) => {
			if (path === 'management') {
				acc.push({ name: 'Management', href: '/management' });
			} else if (index > paths.indexOf('management')) {
				const href = `/${paths.slice(0, index + 1).join('/')}`;
				acc.push({ name: path.charAt(0).toUpperCase() + path.slice(1), href });
			}
			return acc;
		},
		[] as { name: string; href: string }[],
	);

	return (
		<Breadcrumbs>
			{breadcrumbs.map(({ name, href }) => (
				<BreadcrumbItem key={href} href={href}>
					{name}
				</BreadcrumbItem>
			))}
			{activeTab && <BreadcrumbItem key={activeTab}>{activeTab}</BreadcrumbItem>}
		</Breadcrumbs>
	);
}
