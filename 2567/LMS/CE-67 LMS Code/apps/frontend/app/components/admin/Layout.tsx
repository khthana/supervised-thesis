import { AdminNavbar } from '@/components/admin/Navbar';
import { Sidebar, SidebarHeader } from '@/components/admin/Sidebar';
import type { UserSchema } from '@shared/types/users/user.model';
import type { z } from 'zod';

type UserType = z.infer<typeof UserSchema>; // Add this line

interface AdminLayoutProps {
	user: UserType | null;
	children: React.ReactNode;
}

export function AdminLayout({ user, children }: AdminLayoutProps) {
	return (
		<div className='grid min-h-dvh w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
			<div className='hidden border-r dark:border-zinc-800 md:block'>
				<div className='admin-navbar flex h-full max-h-dvh flex-col'>
					<div className='flex h-14 items-center border-b dark:border-zinc-800 px-4 lg:h-16 lg:px-6'>
						<SidebarHeader />
					</div>
					<div className='flex-1 overflow-y-auto scrollbar-thumb-rounded-full'>
						<Sidebar />
					</div>
				</div>
			</div>
			<div className='flex flex-col w-full max-h-dvh overflow-hidden'>
				<AdminNavbar user={user} />
				<div className='flex-1 overflow-y-auto'>{children}</div>
			</div>
		</div>
	);
}
