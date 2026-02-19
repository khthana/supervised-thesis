import { type UserRole, UserRoleSchema } from '@shared/types/users/user.model';
import { useMemo } from 'react';

export function useValidation() {
	return useMemo(
		() => ({
			email: {
				validate: (email: string) => {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					return {
						valid: emailRegex.test(email),
						message: 'email format is invalid',
					};
				},
			},
			fullName: {
				validate: (name: string) => {
					const nameParts = name.split(' ');
					return {
						valid: nameParts.length >= 2 && name.trim() !== '',
						message: 'Please enter your full name',
					};
				},
			},
			required: {
				validate: (value: string) => {
					return {
						valid: value.trim() !== '',
						message: 'This field is required',
					};
				},
			},
			role: {
				validate: (role: string) => {
					return {
						valid: UserRoleSchema['~validate'](role as UserRole),
						message: 'Invalid role',
					};
				},
			},
		}),
		[],
	);
}
