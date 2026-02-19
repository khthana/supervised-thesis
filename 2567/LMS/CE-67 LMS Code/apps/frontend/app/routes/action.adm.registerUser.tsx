import { DEFAULT_PASSWORD, getPublicEnv } from '@/lib/env.server';
import type { UserRegister } from '@shared/types/auth.model';
import { type UserRole, UserRoleSchema } from '@shared/types/users/user.model';
import type { ActionFunctionArgs } from 'react-router';

export async function loader() {
	return null;
}

export async function action({ request }: ActionFunctionArgs) {
	const env = getPublicEnv();

	try {
		const formData = await request.formData();
		console.log('Processing form data');

		const email = formData.get('email') as string;
		const firstname_en = formData.get('firstname_en') as string;
		const lastname_en = formData.get('lastname_en') as string;
		const role = formData.get('role') as string;

		// console.log('form data:', { email, firstname_en, lastname_en, role });

		if (!email || !firstname_en || !lastname_en) {
			return { status: 400, message: 'Please enter name and last name' };
		}

		// if (!Object.values(UserRoleSchema).includes(role as UserRole)) {
		//   return { status: 400, message: 'Incorrect Role' };
		// }

		const requestBody: UserRegister = {
			email,
			password: DEFAULT_PASSWORD,
			firstname_en,
			lastname_en,
			user_role: role as UserRole,
		};

		console.log('Request body:', requestBody);

		try {
			const response = await fetch(`${env.BACKEND_URL}/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error('API error response');
			}

			const responseData = await response.json();

			if (!response.ok) {
				console.error('API error response:', responseData);
				return {
					status: response.status,
					message: responseData.message || 'API error response',
				};
			}

			console.log('User registered successfully');

			return {
				status: 200,
				message: 'User registered successfully',
				user: responseData.responseObject?.user || null,
			};
		} catch (error) {
			console.error('Error registering user:', error);
			return { status: 500, message: 'Failed to register user' };
		}
	} catch (error) {
		console.error('Error processing form data:', error);
		return { status: 500, message: 'Failed to process form data' };
	}
}
