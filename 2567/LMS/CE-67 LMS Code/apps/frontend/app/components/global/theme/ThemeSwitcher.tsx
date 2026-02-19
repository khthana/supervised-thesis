import { Theme, useTheme } from 'remix-themes';

export function ThemeSwitcher() {
	const [theme, setTheme] = useTheme();

	const toggleTheme = () => {
		const nextTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
		setTheme(nextTheme as Theme);
	};

	return (
		<button
			type='button'
			onClick={toggleTheme}
			// variant='ghost'
			aria-label='Toggle Theme'
			className='relative p-2'
		>
			<span className='material-symbols-outlined'>{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
		</button>
	);
}
