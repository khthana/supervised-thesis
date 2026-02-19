import IconLearnify from '@/components/global/Icons/IconLearnify';
import MaterialSymbol from '@/components/global/Icons/MaterialSymbol';
import { cn } from '@/lib/shadcnUtils';
import { Link } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';

export function SidebarHeader() {
	return (
		<div className='w-fit'>
			<Link href='/' className='flex'>
				<IconLearnify size='2xl' />
			</Link>
		</div>
	);
}

export function Sidebar() {
	return (
		<nav className='grid my-4 items-start gap-4 px-2 font-medium lg:px-4'>
			{/* <SidebarLink href='/management/dashboard' icon={<MaterialSymbol size='1rem' name='bar_chart_4_bars' />}>
				Dashboard
			</SidebarLink> */}
			<SidebarLink href='/management/users' icon={<MaterialSymbol size='1rem' name='group' />}>
				Users Management
			</SidebarLink>
			<SidebarLink href='/management/learning_categories' icon={<MaterialSymbol size='1rem' name='category' />}>
				Course Categories Management
			</SidebarLink>
		</nav>
	);
}

interface SidebarLinkProps {
	href: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}

function SidebarLink({ href, icon, children }: SidebarLinkProps) {
	return (
		<Link
			isBlock
			href={href}
			anchorIcon={icon}
			showAnchorIcon
			className='text-md flex justify-between items-center p-2 rounded-lg hover:bg-opacity-10'
			color='foreground'
		>
			{children}
		</Link>
	);
}
