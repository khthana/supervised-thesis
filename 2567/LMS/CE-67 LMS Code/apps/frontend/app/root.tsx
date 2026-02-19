import MaterialSymbol from '@/components/global/Icons/MaterialSymbol';
import { useWindowDimensions } from '@/hooks/winindowDimensions';
import authService from '@/server/api/auth.server';
import userService from '@/server/api/user.server';
import { getSession } from '@/server/sessions/learnify.server';
import { themeSessionResolver } from '@/server/sessions/theme.server';
import { redirectWithToast } from '@/server/toaster.server';
import { getAccessToken } from '@/server/token.server';
import { DndContext } from '@dnd-kit/core';
import { HeroUIProvider } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLoaderData } from 'react-router';
import { type LoaderFunctionArgs, type MetaFunction, redirect, useNavigate } from 'react-router';
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes';
import type { Theme } from 'remix-themes';
import type { Route } from './+types/root';
import { LearnifyProvider } from './context/LearnifyContext';

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
	},
	{
		rel: 'stylesheet',
		href: '/app/styles/globals.css',
	},
];

export const meta: MetaFunction = () => {
	return [
		{ title: 'Learnify' },
		{
			property: 'og:title',
			content: 'LMS for CE KMITL',
		},
		{
			name: 'description',
			content:
				"Learnify is a Learning Management System for Computer Engineering students at King Mongkut's Institute of Technology Ladkrabang.",
		},
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const { getTheme } = await themeSessionResolver(request);

	// Check if user is logged in
	const session = await getSession(request.headers.get('Cookie'));
	const accessToken = session.get('accessToken');

	// if logged in, check if access token is valid
	if (accessToken) {
		const { status } = await getAccessToken(request);
		switch (status) {
			case 401:
				return redirectWithToast('/login', {
					type: 'error',
					message: 'Session expired. Please login again.',
				});
			case 403:
				return redirectWithToast('/logout', {
					type: 'error',
					message: 'Session expired. Please login again.',
				});
			case 500:
				return redirectWithToast('/login', {
					type: 'error',
					message: 'Something went wrong. Please try again later.',
				});
			case 200:
				// User is logged in and access token is valid
				try {
					const userData = await userService.getInfo(accessToken);
					if (!userData) {
						return { user: null, accessToken };
					}

					const user = userData;
					// console.log('user:', user.created_at);

					if (!user) {
						return redirect('/logout');
					}

					const accessTokenPayload = await authService.verifyAccessToken(accessToken);
					if (!accessTokenPayload) {
						return redirectWithToast('/login', {
							type: 'error',
							message: 'Session expired. Please login again.',
						});
					}

					return {
						user: user,
						accessToken: {
							token: accessToken,
							expires: accessTokenPayload.exp,
						},
						theme: getTheme(),
					};
				} catch (error) {
					console.error('Error fetching user info:', error);
					return redirectWithToast('/login', {
						type: 'error',
						message: 'Something went wrong. Please try again later.',
					});
				}
			default:
				return redirectWithToast('/login', {
					type: 'error',
					message: 'Something went wrong. Please try again later.',
				});
		}
	}

	return {
		user: null,
		accessToken: null,
		theme: getTheme(),
	};
}

export default function AppWithProviders() {
	const data = useLoaderData();
	return (
		<ThemeProvider specifiedTheme={data.theme} themeAction='/action/set-theme'>
			<App />
		</ThemeProvider>
	);
}

function App() {
	const data = useLoaderData<typeof loader>();
	const { width } = useWindowDimensions();
	const [hasMounted, setHasMounted] = useState(false);

	const [theme] = useTheme();
	const currentTheme: Theme = theme ?? ('dark' as Theme);

	const navigate = useNavigate();

	const ouletPropsData = {
		user: data.user ?? null,
		accessToken: data.accessToken?.token ?? null,
	};

	useEffect(() => {
		if (data.accessToken?.expires) {
			const expiresAt = new Date(data.accessToken.expires).getTime();
			if (Date.now() >= expiresAt) {
				console.warn('Access token expired on client, redirecting...');
				navigate('/logout');
			}
		}
	}, [data.accessToken?.expires, navigate]);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	// if (!hasMounted) {
	//   return null;
	// }
	const isMobile = typeof width !== 'undefined' && width < 390;

	return (
		<html lang='en' className={currentTheme}>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
				<Links />
			</head>
			<body>
				<HeroUIProvider>
					<LearnifyProvider theme={currentTheme}>
						{/* <DndContext> */}
						{isMobile ? (
							<div className='flex h-screen items-center justify-center text-center'>
								<h1>
									<MaterialSymbol name='app_blocking' fill={0} weight={700} grade={0} opticalSize={48} size='5rem' />
									<br />
									<p className='text-xl'>
										Please use a larger screen
										<br />
										to view this app.
									</p>
								</h1>
							</div>
						) : (
							<Outlet context={ouletPropsData} />
						)}
						{/* </DndContext> */}
					</LearnifyProvider>
				</HeroUIProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className='pt-16 p-4 container mx-auto'>
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className='w-full p-4 overflow-x-auto'>
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
