import IconLearnify from '@/components/global/Icons/IconLearnify';
import { useGetTheme } from '@/hooks/useLearnifyHook';
import { getPublicEnv } from '@/lib/env.server';
import authService from '@/server/api/auth.server';
import userService from '@/server/api/user.server';
import { getSession } from '@/server/sessions/learnify.server';
import { getAccessToken } from '@/server/token.server';
import { Button, Card, CardBody, CardFooter, CardHeader, Link } from '@heroui/react';
import { useEffect } from 'react';
// import { LanguageButton } from '@/components/global/language/LanguageButton';
import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from 'react-router';
import { Form, useActionData, useLoaderData, useSubmit } from 'react-router';
import { ToastContainer, toast as notify } from 'react-toastify';
import validator from 'validator';
import 'react-toastify/dist/ReactToastify.css';

interface LoaderData {
	email: string;
	is_verified: boolean;
}

export async function loader({ request }: LoaderFunctionArgs): Promise<Response | LoaderData> {
	const env = getPublicEnv();
	const session = await getSession(request.headers.get('Cookie'));
	let accessToken = session.get('accessToken');
	const refreshToken = session.get('refreshToken');

	const verifyAccessTokenPayload = await authService.verifyAccessToken(accessToken);
	const verifyRefreshTokenPayload = await authService.verifyRefreshToken(refreshToken);

	if (!refreshToken || !verifyRefreshTokenPayload) {
		return redirect('/logout');
	}

	if (!accessToken || !verifyAccessTokenPayload) {
		const newAccessToken = await getAccessToken(refreshToken);
		if (!newAccessToken) {
			return redirect('/logout');
		}
		accessToken = newAccessToken;
	}

	const user = await userService.getLocalInfo(accessToken);
	if (!user) {
		console.error('Failed to fetch user data in verify account');
		return redirect('/login');
	}

	const url = new URL(request.url);
	const email = url.searchParams.get('email');
	if (!email) {
		console.error(`User [${user.user_id}]: email is required to verify account`);
		return redirect('/404');
	}

	if (email !== user.email) {
		console.error(`User [${user.user_id}]: email does not match with user email to verify account`);
		return redirect('/404');
	}

	const response = await fetch(`${env.BACKEND_URL}/api/users?email=${email}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		console.error('Failed to fetch user data (get user by email)');
		return redirect('/404');
	}

	const data = await response.json();
	if (data.is_verified) {
		return redirect('/login');
	}

	return data;
}

interface ActionData {
	status: number;
}

export async function action({ request }: ActionFunctionArgs): Promise<Response | ActionData> {
	const env = getPublicEnv();
	const formData = await request.formData();
	const email = formData.get('email') as string;
	const locale = formData.get('locale') as string;

	try {
		const validEmail = validator.isEmail(email);
		const localeExists = validator.isIn(locale, ['en', 'th']);

		if (!validEmail || !localeExists) {
			return { status: 400 };
		}
	} catch (error) {
		console.error(`verifyaccount validation stage: ${error}`);
		return { status: 500 };
	}

	try {
		const response = await fetch(`${env.BACKEND_URL}/api/auth/verify/account`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': locale,
			},
			body: JSON.stringify({
				email,
				mailtype: 'email',
			}),
		});
		if (!response.ok) {
			console.error('Failed to send verification email', response);
			return { status: 500 };
		}

		return { status: 200 };
	} catch (error) {
		console.error(`Register action stage: ${error}`);
		return { status: 500 };
	}
}

export default function VerifyRegister() {
	const theme = useGetTheme();
	const data = useLoaderData<LoaderData>();
	const actionData = useActionData<ActionData>();
	const submit = useSubmit();

	useEffect(() => {
		console.log(actionData);
		if (actionData) {
			notify.dismiss(); // dismiss "Sending email..." toast
			// console.log('it contains actionData');
			// ตรวจสอบสถานะและแสดงข้อความที่เหมาะสม
			if (actionData.status !== 200) {
				notify.error('Failed to send email. Please try again later.');
			} else if (actionData.status === 200) {
				notify.success('Email sent successfully.');
			}
		}
	}, [actionData]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const $form = e.currentTarget;
			const formData = new FormData($form);

			formData.append('email', data.email);
			// formData.append('locale', i18n.language);

			await submit(formData, {
				method: 'post',
				encType: 'application/x-www-form-urlencoded',
			});

			notify.loading('Sending email...');
		} catch (error) {
			return redirect(`${window.location.pathname}?error=unknown`);
		}
	};

	return (
		<div className='w-full h-screen overflow-y-auto flex justify-center items-center'>
			<Card className='w-fit'>
				<div className='self-end px-5 pt-2'>{/* <LanguageButton /> */}</div>
				<CardHeader className='flex flex-col'>
					<Link href={'/'} className=''>
						<IconLearnify size='xl' />
					</Link>
					<div className='flex flex-row space-x-2.5'>
						<p className=''>{'Please check your email to verify your account.'}</p>
					</div>
				</CardHeader>
				<CardBody className='h-fit flex flex-col justify-center'>
					<Form
						method='post'
						onSubmit={handleSubmit}
						className='w-fit h-full overflow-y-auto self-center justify-self-center space-y-3'
					>
						<Button color='primary' type='submit' name='submit-button'>
							{'Send verification email again'}
							<span className='material-symbols-outlined'>send</span>
						</Button>
					</Form>
					<ToastContainer theme={theme} />
				</CardBody>
			</Card>
		</div>
	);
}
