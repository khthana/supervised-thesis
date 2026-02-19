import { type LoginFormData, createLoginSchema } from '@/schemas/login';
import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/global/Icons/IconEyeFilled';

interface LoginFormProps {
	onSubmit: (data: LoginFormData) => void;
	isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
	const loginSchema = createLoginSchema();

	const {
		control,
		handleSubmit,
		formState: { errors, touchedFields, isValid },
		trigger,
	} = useForm<LoginFormData>({
		mode: 'onChange', // Changed from onTouched to get more responsive validation
		criteriaMode: 'all',
		shouldFocusError: true,
		resolver: zodResolver(loginSchema), // Add the zod resolver to use your schema
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// Modified to check for touched fields and errors
	const showError = (fieldName: keyof LoginFormData) => {
		return touchedFields[fieldName] && errors[fieldName];
	};

	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-wrap justify-center gap-4'>
			<Controller
				name='email'
				control={control}
				render={({ field }) => (
					<Input
						{...field}
						type='email'
						label={'Email'}
						labelPlacement='outside'
						placeholder={'Enter your email.'}
						isInvalid={!!errors.email}
						errorMessage={errors.email?.message}
						variant='flat'
						className='w-[82%]'
						classNames={{
							label: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
							input: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
							inputWrapper: [
								'!bg-default-100',
								'data-[hover=true]:!bg-default-200',
								'group-data-[focus=true]:!bg-default-200',
							],
						}}
						onBlur={field.onBlur} // Ensure onBlur is handled to mark field as touched
					/>
				)}
			/>
			<Controller
				name='password'
				control={control}
				render={({ field }) => (
					<Input
						{...field}
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
						type={isVisible ? 'text' : 'password'}
						label={'Password'}
						labelPlacement='outside'
						placeholder={'Enter your password.'}
						isInvalid={!!errors.password}
						errorMessage={errors.password?.message}
						variant='flat'
						className='w-[82%]'
						classNames={{
							label: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
							input: ['!text-foreground-500', 'group-data-[filled-within=true]:!text-default-600'],
							inputWrapper: [
								'!bg-default-100',
								'data-[hover=true]:!bg-default-200',
								'group-data-[focus=true]:!bg-default-200',
							],
						}}
						autoComplete='current-password'
						onBlur={field.onBlur} // Ensure onBlur is handled to mark field as touched
					/>
				)}
			/>
			<div className='w-[82%]'>
				<Button
					type='submit'
					className='w-full'
					color='primary'
					isLoading={isLoading}
					isDisabled={!isValid || !touchedFields.email || !touchedFields.password}
				>
					{'Login'}
				</Button>
			</div>
		</form>
	);
}
