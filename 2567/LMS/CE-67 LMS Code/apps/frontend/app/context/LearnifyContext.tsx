import { type ReactNode, createContext, useContext } from 'react';
import type { Theme } from 'remix-themes';

interface LearnifyContextType {
	theme: Theme | null;
}

const LearnifyContext = createContext<LearnifyContextType | undefined>(undefined);

interface LearnifyProviderProps {
	theme: Theme | null;
	children: ReactNode;
}

export function LearnifyProvider({ theme, children }: LearnifyProviderProps) {
	const value = { theme };

	return <LearnifyContext.Provider value={value}>{children}</LearnifyContext.Provider>;
}

export function useLearnifyContext() {
	const context = useContext(LearnifyContext);
	if (context === undefined) {
		throw new Error('useLearnifyContext must be used within an LearnifyProvider');
	}
	return context;
}
