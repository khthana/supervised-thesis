import { Button } from '@heroui/react';
import { Form } from 'react-router';

/**
 * SocialButton component
 * @param {string} provider - The provider of the social button
 * @param {string} label - The label of the social button
 * @param {React.ReactNode} startIcon - The start icon of the social button
 */
interface OAuth2ButtonProps {
	provider: 'google'; // | 'facebook' | 'twitter' | 'github',
	label: string;
	startIcon?: React.ReactNode;
}

export function OAuth2Button({ provider, label, startIcon }: OAuth2ButtonProps) {
	return (
		<Form method='get' action={`/login/${provider}`}>
			<Button className='w-full' startContent={startIcon} type='submit' name={`login-${provider}`}>
				{label}
			</Button>
		</Form>
	);
}
