import { Badge, Button } from '@heroui/react';
import { useEffect, useState } from 'react';

export function NotifyButton() {
	const [badge, setBadge] = useState(0);

	useEffect(() => {
		setBadge(5);
	}, []);

	return (
		<button
			type='button'
			onClick={() => (badge === 0 ? setBadge(5) : setBadge(0))}
			// variant='light'
			// isIconOnly={true}
			aria-label='Toggle Theme'
		>
			<Badge isInvisible={badge === 0} content={badge} color='primary'>
				<span className='material-symbols-outlined'>{badge === 0 ? 'notifications' : 'notifications_active'}</span>
			</Badge>
		</button>
	);
}
