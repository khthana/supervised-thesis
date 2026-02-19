'use client';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardBody,
  CardHeader,
  User,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
} from '@heroui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GetTokenData from '@/components/GetTokenData';

// Notification item component
const ShowNotificationItem = ({ Data }) => {
  return (
    <Card className='h-fit max-h-96 w-full overflow-y-auto' shadow='none'>
      <CardHeader className='pb-0'>
        <h4>Notification</h4>
      </CardHeader>
      <CardBody className='flex flex-col pt-1'>
        {Data && Data.length > 0 ? (
          Data.map((item, index) => (
            <div
              key={index}
              className='flex flex-row justify-between p-4 hover:bg-gray-100'
            >
              <div className='flex flex-row gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500'>
                  <BellIcon className='h-5 w-5 text-white' />
                </div>
                <div>
                  <h5 className='text-sm font-bold'>{item.title}</h5>
                  <p className='text-sm'>{item.description}</p>
                </div>
              </div>
              <div className='flex flex-col'>
                <p className='text-xs'>{item.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className='p-4 text-center text-gray-500'>No notifications</div>
        )}
      </CardBody>
    </Card>
  );
};

const NavBar = () => {
  const [navigation, setNavigation] = useState([
    { name: 'Home', href: '/home' },
    { name: 'Learn', href: '/learn' },
    { name: 'Community', href: '/community' },
  ]);
  const [role, setRole] = useState('guest');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    firstName: '',
    lastName: '',
  });

  const router = useRouter();
  const pathname = usePathname();

  // Modified authentication check useEffect
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (token) {
        // Update state with token data in a single call to setUserData
        const updatedUserData = {
          username: GetTokenData(token, 'username'),
          firstName: localStorage.getItem('firstname'),
          lastName: localStorage.getItem('lastname'),
        };

        const userRole = String(GetTokenData(token, 'role'));

        setIsAuthenticated(true);
        setRole(userRole);
        setUserData(updatedUserData);

        // console.log('userData updated', updatedUserData);
      } else {
        setIsAuthenticated(false);
        setRole('guest');
        setUserData({
          username: null,
          firstName: null,
          lastName: null,
        });
      }
    };

    checkAuth();

    // Listen for custom auth event
    const handleAuthChange = () => checkAuth();
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Update navigation based on role and auth status
  useEffect(() => {
    const navItems =
      role === '0'
        ? [
            { name: 'Dashboard', href: '/admin/dashboard' },
            { name: 'Topics', href: '/admin/topics' },
            { name: 'Community', href: '/community' },
          ]
        : [
            { name: 'Home', href: '/home' },
            { name: 'Learn', href: '/learn' },
            { name: 'Community', href: '/community' },
          ];

    const updatedNavigation = navItems.map((item) => ({
      ...item,
      current: pathname === item.href,
    }));

    setNavigation(updatedNavigation);
  }, [role, pathname, isAuthenticated]);

  const logoRoute = role === '0' ? '/admin/dashboard' : '/home';

  const handleSignOut = () => {
    localStorage.clear(); // Clear all localStorage items
    setIsAuthenticated(false);
    setRole('guest');
    router.push('/login');
  };

  const truncateUsername = (username) => {
    return username && username.length > 16
      ? `${username.slice(0, 16)}...`
      : username;
  };

  const getAvatarUrl = (firstName, lastName) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff`;
  };

  const renderProfileDropdown = () => (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Button
          variant='light'
          className='bg-transparent p-0'
          aria-label='User menu'
        >
          <User
            name={truncateUsername(userData.username)}
            description={role === '0' ? 'Admin' : 'Student'}
            avatarProps={{
              src: getAvatarUrl(userData.firstName, userData.lastName),
              alt: `${userData.firstName || 'User'} ${userData.lastName || 'Name'}`,
              className: 'w-8 h-8', // Smaller avatar size
            }}
            classNames={{
              name: 'text-sm', // Smaller username text
              description: 'text-xs', // Smaller role text
            }}
            className='flex w-48 items-center justify-start border-none px-2 text-white'
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='User Actions'>
        {role !== '0' ? (
          <DropdownItem key='profile' onPress={() => router.push('/myProfile')}>
            Your Profile
          </DropdownItem>
        ) : null}
        <DropdownItem
          key='logout'
          className='text-danger'
          color='danger'
          onPress={handleSignOut}
        >
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <nav className='sticky top-0 z-50 bg-gray-800'>
      <div className='mx-auto max-w-full px-2 sm:px-10 sm:py-2 md:px-20 lg:px-20 lg:py-0'>
        <div className='relative flex h-14 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-between'>
            <Link
              href={logoRoute}
              className='flex flex-shrink-0 items-center text-xl font-bold text-white'
            >
              SQLTutor
            </Link>

            <div className='hidden sm:ml-6 sm:block'>
              <div className='flex space-x-4'>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className='lg:pl-5'>
            {role === 'guest' ? (
              <Link
                href='/login'
                className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
              >
                Login
              </Link>
            ) : (
              <div className='flex items-center gap-4'>
                {renderProfileDropdown()}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
