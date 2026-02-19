import IconLearnify from '@/components/global/Icons/IconLearnify';
// import { LanguageAccorder } from '@/components/global/language/LanguageAccorder';
import { ThemeSwitcher } from '@/components/global/theme/ThemeSwitcher';
import { ThemeToggler } from '@/components/global/theme/ThemeToggler';
import { NotifyButton } from '@/components/learnify/NotifyButton';
import type { UserWithAvatarType } from '@/interfaces/sharetype';
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
	User,
} from '@heroui/react';
import { useState } from 'react';

interface UserNavBarProps {
	user: UserWithAvatarType | null;
}

export function UserNavbar({ user }: UserNavBarProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Navbar onMenuOpenChange={setIsMenuOpen} maxWidth='full' position='static' className='w-full navbar mb-5'>
			<NavbarBrand className='col-start-1'>
				<div className='w-fit'>
					<Link href={'/'} className='flex'>
						<IconLearnify size='2xl' />
					</Link>
				</div>
			</NavbarBrand>
			<NavbarContent justify='end' className='w-full'>
				<NavbarItem className='hidden sm:grid '>
					<ThemeSwitcher />
				</NavbarItem>
				<NavbarItem className='hidden sm:grid '>
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
										description={user?.user_role}
										classNames={{
											name: 'text-left ml-0', // เพิ่ม ml-0 เพื่อให้ text ติดซ้าย
											description: 'text-left ml-0',
											base: 'justify-start gap-2', // ปรับ base class ให้เริ่มจากซ้าย
										}}
										className='justify-start'
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

			<NavbarContent justify='end' className='sm:hidden'>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
					className='col-start-6 w-fit sm:hidden'
				/>
			</NavbarContent>
			<NavbarMenu>
				{user && (
					<NavbarMenuItem key='profile'>
						<Link color='foreground' href='/' size='lg'>
							{'My Profile'}
						</Link>
					</NavbarMenuItem>
				)}
				{/* <NavbarMenuItem key='languages'>
					<LanguageAccorder />
				</NavbarMenuItem> */}
				<NavbarMenuItem key='switchtheme'>
					<ThemeToggler />
				</NavbarMenuItem>
				{user ? (
					<NavbarMenuItem key='logout'>
						<Link color='danger' href='/logout' size='lg'>
							{'Logout'}
						</Link>
					</NavbarMenuItem>
				) : (
					<NavbarMenuItem key='login'>
						<Link color='primary' href='/login' size='lg'>
							{'Login'}
						</Link>
					</NavbarMenuItem>
				)}
			</NavbarMenu>
		</Navbar>
	);
}
