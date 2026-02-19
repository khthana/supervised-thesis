import { ThemeSwitcher } from '@/components/global/theme/ThemeSwitcher';
import type { UserWithAvatarType } from '@/interfaces/sharetype';
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
	Navbar,
	NavbarContent,
	NavbarItem,
	User,
} from '@heroui/react';

interface AdminNavbarProps {
	user: UserWithAvatarType | null;
}

export function AdminNavbar({ user }: AdminNavbarProps) {
	return (
		<Navbar maxWidth='full' position='static' className='w-full navbar mb-5 border-b-1 border-gray-200'>
			<NavbarContent justify='end'>
				<NavbarItem className='hidden lg:flex'>
					<ThemeSwitcher />
				</NavbarItem>
				<NavbarItem className='hidden lg:flex'>
					{user ? (
						<Dropdown>
							<DropdownTrigger>
								<Button
									type='button'
									color='primary'
									variant='light'
									aria-label='Toggle Theme'
									className='w-[350px] md:w-[250px] sm:w-[200px] flex items-center justify-start px-4'
								>
									<User
										// name={user.firstname_en}
										name={`${user?.firstname_en} ${user?.lastname_en}`}
										avatarProps={{
											src: user.avatar?.url || undefined,
											// fallback: user.firstname.en[0].toUpperCase(),
											className: 'rounded-full w-10 h-10  ',
										}}
										classNames={{
											name: 'text-left ml-0', // เพิ่ม ml-0 เพื่อให้ text ติดซ้าย
											description: 'text-left ml-0',
											base: 'justify-start gap-2', // ปรับ base class ให้เริ่มจากซ้าย
										}}
										className='justify-start'
										description={user?.user_role}
									/>
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label='Drop Down Actions'
								onAction={(key) => {
									switch (key) {
										case 'profile':
											window.location.href = '/profile';
											break;
										case 'logout':
											window.location.href = '/logout';
											break;
										case 'mycourse':
											window.location.href = '/mycourse';
											break;
										case 'management':
											window.location.href = '/management/users';
											break;
										default:
											break;
									}
								}}
							>
								<DropdownItem key='profile' href='/profile' color='default'>
									{'My Profile'}
								</DropdownItem>
								<DropdownItem key='mycourse' href='/mycourse' color='default'>
									{'My Courses'}
								</DropdownItem>
								<DropdownItem key='management' href='/management/users'>
									{'Management'}
								</DropdownItem>
								<DropdownItem key='logout' color='danger' className='text-danger'>
									{'Logout'}
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					) : (
						<Button as={Link} color='primary' href={'/login'} variant='solid'>
							{'Login'}
						</Button>
					)}
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
