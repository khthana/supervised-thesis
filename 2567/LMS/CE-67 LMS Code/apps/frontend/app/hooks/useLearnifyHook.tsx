import { useLearnifyContext } from '@/context/LearnifyContext';
import { Theme } from 'remix-themes';

export function useGetTheme(): 'dark' | 'light' {
	const { theme } = useLearnifyContext();

	if (theme === null) {
		console.warn('Theme is null, defaulting to light theme');
		return 'light';
	}

	return theme === Theme.DARK ? 'dark' : 'light';
}
