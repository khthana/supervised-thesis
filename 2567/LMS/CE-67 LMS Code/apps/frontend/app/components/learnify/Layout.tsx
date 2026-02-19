import { Footer } from '@/components/learnify/Footer';
import { UserNavbar } from '@/components/learnify/Navbar';
import type { UserWithAvatarType } from '@/interfaces/sharetype';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AdminNavbar } from '../admin/Navbar';

interface LearnifyLayoutProps {
	user: UserWithAvatarType | null;
	children: React.ReactNode;
}

export function LearnifyLayout({ user, children }: LearnifyLayoutProps) {
	return (
		<div className='flex flex-col items-center min-h-screen min-w-screen overflow-x-hidden'>
			<div className='max-w-[2000px] min-w-[1100px] w-full'>
				{user && user.user_role === 'ANNOUCNER' ? <AdminNavbar user={user} /> : <UserNavbar user={user} />}
			</div>
			<div className='flex-1'>{children}</div>
			<Footer companyName='CE KMITL' year={new Date().getFullYear()} />
		</div>
	);
}
