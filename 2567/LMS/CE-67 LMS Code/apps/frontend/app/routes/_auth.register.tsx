import { isEnglishAlphaInput } from '@/lib/customValidator';
// import { redirectWithToast } from '@/server/toaster.server';
import { type ActionFunctionArgs, redirect } from 'react-router';

import IconLearnify from '@/components/global/Icons/IconLearnify';
import { FormErrorModal } from '@/components/global/modal/FormErrorModal';
import { useGetTheme } from '@/hooks/useLearnifyHook';
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Link, useDisclosure } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { Form, useActionData, useLoaderData, useSubmit } from 'react-router';
import { ToastContainer, toast as notify } from 'react-toastify';
import validator from 'validator';
import 'react-toastify/dist/ReactToastify.css';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/global/Icons/IconEyeFilled';
import { getPublicEnv } from '@/lib/env.server';
import type { UserRegister } from '@shared/types/auth.model';
import { useNavigate } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const password_confirm = formData.get('password_confirm') as string;
	const firstname_en = formData.get('firstname_en') as string;
	const lastname_en = formData.get('lastname_en') as string;
	const role = 'LEARNER';
	const env = getPublicEnv();

	//validation check before fetch
	try {
		const validEmail = validator.isEmail(email);
		const validPassword = validator.isStrongPassword(password) && validator.equals(password, password_confirm);
		const validName = (await isEnglishAlphaInput(firstname_en)) && (await isEnglishAlphaInput(lastname_en));

		if (!validEmail || !validPassword || !validName) {
			console.log('Validation Error');
			return { status: 400 };
		}
	} catch (error) {
		console.error(`Register validation stage: ${error}`);
		return { status: 500 };
	}

	// fetch to backend
	try {
		const response = await fetch(`${env.BACKEND_URL}/api/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
				firstname_en,
				lastname_en,
				user_role: role,
			} as UserRegister),
		});
		if (response.status !== 200) {
			if (response.status === 400) {
				return { status: 400 };
			}

			if (response.status === 409) {
				return { status: 409 };
			}

			return { status: 500 };
		}

		// return redirectWithToast('/login', {
		// 	type: 'success',
		// 	message: 'Registered Please login',
		// 	duration: 5000,
		// });

		if (response.status === 200) {
			// ส่ง redirect พร้อม URL parameter แทนการใช้ session
			return redirect('/login?toast=success&message=Registered+Please+login');
		}
	} catch (error) {
		console.error(`Register fetch stage: ${error}`);
		return { status: 500 };
	}
}

/**
 * Loader function to fetch user name titles from a JSON file.
 *
 * @returns {Promise<LoaderData>} An object containing the user name titles.
 */

interface ActionData {
	status: number;
}

export default function RegisterUser() {
	// const data = useLoaderData<LoaderData>();
	const actionData: ActionData | null = useActionData() ?? null;
	const theme = useGetTheme();

	// form data
	const [user_email, setEmail] = useState('');
	const [user_password, setPassword] = useState('');
	const [user_password_confirm, setPasswordConfirm] = useState('');
	const [firstname_en, setFirstNameEn] = useState('');
	const [lastname_en, setLastNameEn] = useState('');

	// invalid check
	const [isFirstOpen, setIsFirstOpen] = useState(true);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [popupBody, setPopupBody] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	const [isConfirmVisible, setIsConfirmVisible] = useState(false);
	const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
	const errorsRegister: string[] = [];

	if (user_password.length < 1) {
		errorsRegister.push('Please fill in your password.');
	}
	if (user_password.length < 8) {
		errorsRegister.push('Password must be at least 4 characters long.');
	}
	if ((user_password.match(/[A-Z]/g) || []).length < 1) {
		errorsRegister.push('Password must contain at least one uppercase letter.');
	}
	if ((user_password.match(/[a-z]/g) || []).length < 1) {
		errorsRegister.push('Password must contain at least one lowercase letter.');
	}
	if ((user_password.match(/[^a-zA-Z\d]/g) || []).length < 1) {
		errorsRegister.push('Password must contain at least one special character.');
	}
	if ((user_password.match(/\d/g) || []).length < 1) {
		errorsRegister.push('Password must contain at least one number.');
	}

	useEffect(() => {
		if (actionData) {
			if (actionData?.status !== 201) {
				notify.dismiss();
			}

			if (actionData?.status === 400) {
				setPopupBody('Please fill in the information correctly and completely.');
				onOpen();
				notify.error('Please fill in the information correctly and completely.');
			}
			if (actionData?.status === 409) {
				setPopupBody('This email is already in use.');
				onOpen();
			}
			if (actionData?.status === 500) {
				setPopupBody('An error occurred. Please try again later.');
				onOpen();
			}
		}
		window.history.replaceState(null, '', window.location.pathname);
	}, [actionData, onOpen]);

	const isEnglishAlphaInput = /^[a-zA-Z\s]*$/;

	const isNotValidFirstNameEn = useMemo(() => {
		if (firstname_en === '' && isFirstOpen) {
			return false;
		}
		return !validator.isLength(firstname_en, { min: 1 }) || !isEnglishAlphaInput.test(firstname_en);
	}, [firstname_en, isFirstOpen]);

	const isNotValidLastNameEn = useMemo(() => {
		if (lastname_en === '' && isFirstOpen) {
			return false;
		}
		return !validator.isLength(lastname_en, { min: 1 }) || !isEnglishAlphaInput.test(lastname_en);
	}, [lastname_en, isFirstOpen]);

	const isNotValidEmail = useMemo(() => {
		if (user_email === '' && isFirstOpen) {
			return false;
		}
		return !validator.isEmail(user_email);
	}, [user_email, isFirstOpen]);

	const isNotValidPassword = useMemo(() => {
		if (user_password === '' && isFirstOpen) {
			return false;
		}
		return !validator.isLength(user_password, { min: 1 }) || !validator.isStrongPassword(user_password);
	}, [user_password, isFirstOpen]);

	const isNotValidConfirmPassword = useMemo(() => {
		if (user_password_confirm === '' && isFirstOpen) {
			return false;
		}
		return !validator.equals(user_password_confirm, user_password) || user_password_confirm === '';
	}, [user_password, user_password_confirm, isFirstOpen]);

	const onInputChange = (inputValue: string) => {
		// console.log('Input Value:', inputValue);
		return;
	};

	return (
		<div className='w-full h-screen overflow-y-auto flex justify-center items-center'>
			<Card className=''>
				<div className='self-end px-5 pt-2'>{/* <LanguageButton /> */}</div>
				<CardHeader className='flex flex-col'>
					<Link href={'/'} className=''>
						{/* <IconLearnify size='xl' /> */}
						<h1 className='text-2xl text-blue-500'>
							<b>Sign Up</b>
						</h1>
					</Link>
					<div className='flex flex-row space-x-2.5'>
						<p className='text-default-400'>{'Already have an account? '}</p>
						<Link href='/login' className='text-blue-500'>
							{'Login'}
						</Link>
					</div>
				</CardHeader>
				<CardBody className='h-fit flex flex-col justify-center'>
					<Form method='post' className='w-[90%] h-full overflow-y-auto self-center justify-self-center space-y-3'>
						<div className='flex flex-col md:space-x-4 sm:flex-row'>
							<Input
								isInvalid={isNotValidFirstNameEn}
								label={'First Name'}
								name='firstname_en'
								type='text'
								errorMessage={'Please fill in your name & lastname in English.'}
								placeholder={`${'firstname'} (en)`}
								isRequired={true}
								variant='underlined'
								className='w-full'
								classNames={{
									label: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
									input: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
								}}
								value={firstname_en}
								onChange={(e) => {
									setIsFirstOpen(false);
									setFirstNameEn(e.target.value);
								}}
							/>
							<Input
								isInvalid={isNotValidLastNameEn}
								label={'Last Name'}
								name='lastname_en'
								type='text'
								errorMessage={'Please fill in your name & lastname in English.'}
								placeholder={`${'lastname'} (en)`}
								isRequired={true}
								variant='underlined'
								className='w-full'
								classNames={{
									label: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
									input: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
								}}
								value={lastname_en}
								onChange={(e) => {
									setIsFirstOpen(false);
									setLastNameEn(e.target.value);
								}}
							/>
						</div>
						<Input
							isInvalid={isNotValidEmail}
							label={'Email'}
							name='email'
							type='email'
							placeholder={'Account email address'}
							errorMessage={'Please fill in your email address.'}
							isRequired={true}
							variant='underlined'
							classNames={{
								label: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
								input: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
							}}
							value={user_email}
							onChange={(e) => {
								setIsFirstOpen(false);
								setEmail(e.target.value);
							}}
						/>
						<Input
							isInvalid={isNotValidPassword}
							autoComplete='off'
							label={'Password'}
							name='password'
							type={isVisible ? 'text' : 'password'}
							errorMessage={() => (
								<ul>
									{errorsRegister.map((error) => (
										<li key={error}>{error}</li>
									))}
								</ul>
							)}
							placeholder={'Account Password'}
							isRequired={true}
							variant='underlined'
							className='w-full'
							classNames={{
								label: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
								input: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
							}}
							value={user_password}
							endContent={
								<button
									aria-label='toggle password visibility'
									className='focus:outline-none'
									type='button'
									onClick={toggleVisibility}
								>
									{isVisible ? (
										<EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
									) : (
										<EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
									)}
								</button>
							}
							onChange={(e) => {
								setIsFirstOpen(false);
								setPassword(e.target.value);
							}}
						/>
						<Input
							isInvalid={isNotValidConfirmPassword}
							autoComplete='off'
							label={'Confirm Password'}
							name='password_confirm'
							type={isConfirmVisible ? 'text' : 'password'}
							errorMessage={'Passwords do not match.'}
							placeholder={'Confirm Password'}
							isRequired={true}
							variant='underlined'
							className='w-full'
							classNames={{
								label: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
								input: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
							}}
							value={user_password_confirm}
							endContent={
								<button
									aria-label='toggle password visibility'
									className='focus:outline-none'
									type='button'
									onClick={toggleConfirmVisibility}
								>
									{isConfirmVisible ? (
										<EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
									) : (
										<EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
									)}
								</button>
							}
							onChange={(e) => {
								setIsFirstOpen(false);
								setPasswordConfirm(e.target.value);
							}}
						/>
						<Button
							isDisabled={
								isFirstOpen ||
								isNotValidFirstNameEn ||
								isNotValidLastNameEn ||
								isNotValidEmail ||
								isNotValidPassword ||
								isNotValidConfirmPassword
							}
							className='w-full'
							color='primary'
							type='submit'
							name='register-submit'
						>
							{'Continue'}
						</Button>
					</Form>
					<FormErrorModal
						isOpen={isOpen}
						onOpenChange={onOpenChange}
						popupBody={popupBody}
						onClose={onOpenChange}
						buttonString={'Close'}
						headerString={'Registration  failed'}
					/>
					<ToastContainer theme={theme} />
				</CardBody>
				<CardFooter className='flex items-center justify-center'>{/* <LanguageSwitcher /> */}</CardFooter>
			</Card>
		</div>
	);
}
