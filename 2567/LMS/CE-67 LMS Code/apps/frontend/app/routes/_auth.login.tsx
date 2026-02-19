import IconGoogle from '@/components/global/Icons/IconGogle';
import IconLearnify from '@/components/global/Icons/IconLearnify';
import { LoginForm } from '@/components/global/auth/LoginForm';
import { OAuth2Button } from '@/components/global/auth/OAuth2Button';
import { FormErrorModal } from '@/components/global/modal/FormErrorModal';
import { useGetTheme } from '@/hooks/useLearnifyHook';
import { getPublicEnv } from '@/lib/env.server';
import { createLoginSchema } from '@/schemas/login';
import type { LoginFormData } from '@/schemas/login';
import userService from '@/server/api/user.server';
import { commitSession as commitUserSession, getSession as getUserSession } from '@/server/sessions/learnify.server';
// import { destroySession, getSession as getToastSession } from '@/server/sessions/toast.server';
// import { getToast } from '@/server/toaster.server';
import { Card, CardHeader, useDisclosure } from '@heroui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from 'react-router';
import { Link, useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router';
import { ToastContainer, toast as notify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { UserCookie } from '@shared/types/auth.model';

export async function action({ request }: ActionFunctionArgs) {
	const env = getPublicEnv();

	let formData: FormData;
	try {
		formData = await request.formData();
		// console.log('formData', formData);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
	} catch (error) {
		console.log('formdata');
		return { status: 500, message: error };
	}

	try {
		const loginSchema = createLoginSchema();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const validatedData = loginSchema.parse({ email: email, password: password });
		// console.log('validatedData',  JSON.stringify(validatedData));
		// console.log('validatedData', validatedData);
		// console.log('validatedData', validatedData);

		const response = await fetch(`${env.BACKEND_URL}/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(validatedData),
		});

		// console.log('response', response.ok);

		if (!response.ok) {
			const errorData = await response.json();
			console.log('errorData', errorData);
			return {
				status: response.status,
				message: errorData.message || 'Unknown error occurred',
			};
		}

		// console.log('response', response);

		const res = await response.json();
		const data = res.responseObject as UserCookie;
		// console.log('data', data);
		if (data.refreshToken && data.accessToken) {
			const accessToken = data.accessToken;
			const refreshToken = data.refreshToken;
			const user = await userService.getLocalInfo(accessToken);

			const session = await getUserSession();
			session.set('refreshToken', refreshToken);
			session.set('accessToken', accessToken);

			// console.log('user', user);

			// if (user?.is_verified === false) {
			// 	console.log('user?.email', user?.email);
			// 	return redirect(`/verify/account?email=${user?.email}`, {
			// 		headers: {
			// 			'Set-Cookie': await commitUserSession(session),
			// 		},
			// 	});
			// }
			return redirect('/', {
				headers: {
					'Set-Cookie': await commitUserSession(session),
				},
			});
		}
		return { status: 500, message: 'Invalid server response' };
	} catch (error) {
		console.error(`Login error: ${error}`);
		return { status: 500, message: 'Internal server error' };
	}
}

// export async function loader({ request }: LoaderFunctionArgs) {
//   const { toast } = await getToast(request);

//   const toastSession = await getToastSession(request.headers.get('Cookie'));

//   toastSession.unset('toast');

//   return {
//     toast,
//     headers: {
//       'Set-Cookie': await destroySession(toastSession),
//     },
//   };
// }

export default function LoginUser() {
	const actionData = useActionData<{ status: number; message: string }>();
	const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [popupBody, setPopupBody] = useState('');
	const theme = useGetTheme();
	const submit = useSubmit();
	const navigation = useNavigation();

	const toastShownRef = useRef(false);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const toastType = queryParams.get('toast');
		const toastMessage = queryParams.get('message');

		if (toastType && toastMessage) {
			// กำหนด toast จาก URL parameters
			setToast({
				type: toastType,
				message: toastMessage.replace(/\+/g, ' '),
			});

			// ลบ parameters ออกจาก URL ทันที
			window.history.replaceState({}, '', window.location.pathname);
		}
	}, []);

	// แสดง toast เมื่อข้อมูลพร้อม
	useEffect(() => {
		if (toast) {
			notify(toast.message, { type: toast.type as 'info' | 'success' | 'warning' | 'error' });
			// ล้าง toast หลังจากแสดง
			setToast(null);
		}
	}, [toast]);

	const handleErrorsAndToasts = useCallback(() => {
		const queryParams = new URLSearchParams(location.search);
		const errorParam = queryParams.get('error');

		const errorMessages: Record<string, string> = {
			unauthorized: 'User not registered. Please register first.',
			access_denied: 'User not registered. Please register first.',
			unknown: 'An error occurred. Please try again later.',
		};

		if (errorParam && errorMessages[errorParam]) {
			setPopupBody(errorMessages[errorParam]);
			onOpen();
		}

		if (actionData?.status === 401 || actionData?.status === 400) {
			setPopupBody('Invalid email or password.');
			onOpen();
		}

		if (actionData?.status === 500) {
			setPopupBody(actionData.message || 'An error occurred. Please try again later.');
			onOpen();
		}

		// if (toast && !toastShownRef.current) {
		// notify(toast.message, { type: toast.type as 'info' | 'success' | 'warning' | 'error' });
		// 	toastShownRef.current = true;

		// 	localStorage.setItem('toast_displayed', 'true');
		// }

		if (errorParam) {
			window.history.replaceState(null, '', window.location.pathname);
		}
	}, [onOpen, actionData]);

	useEffect(() => {
		handleErrorsAndToasts();
	}, [handleErrorsAndToasts]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const handleSubmit = useCallback(
		(data: LoginFormData) => {
			if (!data.email || !data.email.trim()) {
				setPopupBody('Email is required.');
				onOpen();
				return;
			}

			if (!data.password || !data.password.trim()) {
				setPopupBody('Password is required.');
				onOpen();
				return;
			}

			const formData = new FormData();
			formData.append('email', data.email);
			formData.append('password', data.password);
			// console.log('formData', formData);
			submit(formData, { method: 'post', action: '/login' });
		},
		[submit],
	);

	return (
		<div className='w-full h-screen overflow-y-auto flex items-center justify-center'>
			<Card className='max-w-[350px] max-h-[800px] md:max-w-[500px]'>
				<div className='self-end px-5 pt-2'>{/* <LanguageButton /> */}</div>
				<CardHeader className='flex flex-col justify-center'>
					<Link to='/' className='flex'>
						{/* <IconLearnify size='2xl' /> */}
						<h1 className='text-2xl text-blue-500'>
							<b>Sign In</b>
						</h1>
					</Link>
					<LoginForm onSubmit={handleSubmit} isLoading={navigation.state === 'submitting'} />
					<FormErrorModal
						isOpen={isOpen}
						onOpenChange={onOpenChange}
						popupBody={popupBody}
						onClose={onOpenChange}
						buttonString={'Close'}
						headerString={'Authentication failed'}
					/>
					<ToastContainer theme={theme} />
					{/* <div className='text-md mx-12 self-end'>
						<Link to='/forgot-password' className='text-default-400 hover:text-blue-500'>
							{'Forgot Password?'}
						</Link>
					</div> */}
					<div className='m-2 flex w-[82%] justify-center'>
						<div className='line w-[41%] self-center border-1' />
						<p className='mx-3'>{'Or'}</p>
						<div className='line w-[41%] self-center border-1' />
					</div>
					<div className='mx-12 w-[82%]'>
						<OAuth2Button provider='google' label={'Continue with Google'} startIcon={<IconGoogle />} />
					</div>
					<div className='mx-12 mt-2 self-end'>
						<p className='text-default-400'>
							{''} &nbsp;
							<Link to='/register' className='text-blue-500'>
								{'Sign Up'}
							</Link>
						</p>
					</div>
				</CardHeader>
			</Card>
		</div>
	);
}
