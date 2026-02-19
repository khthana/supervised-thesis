import { Switch } from '@heroui/react';
// import { useState, useEffect } from 'react';
import { Theme, useTheme } from 'remix-themes';

export function ThemeToggler() {
	const [theme, setTheme] = useTheme();

	const changeTheme = (isSelected: boolean) => {
		const nextTheme = isSelected ? Theme.DARK : Theme.LIGHT;
		setTheme(nextTheme as Theme);
	};

	return (
		<Switch
			defaultSelected={theme === 'dark'}
			isSelected={theme === 'dark'}
			onValueChange={changeTheme}
			size='lg'
			color='secondary'
			thumbIcon={({ isSelected, className }) =>
				isSelected ? (
					<span className={`material-symbols-outlined ${className}`}>light_mode</span>
				) : (
					<span className={`material-symbols-outlined ${className}`}>dark_mode</span>
				)
			}
		>
			{'Dark mode'}
		</Switch>
	);
}
