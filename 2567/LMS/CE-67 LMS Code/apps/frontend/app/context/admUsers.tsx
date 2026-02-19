import type { UserTypes } from '@/interfaces/sharetype';
import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLoaderData, useOutletContext } from 'react-router';
// Replace ParentLoaderData with the correct type or define it locally if needed
type ParentLoaderData = { users: UserTypes[] }; // Example type definition

interface UserContextType {
	users: UserTypes[];
	isLoading: boolean;
	error: string | null;
	refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [users, setUsers] = useState<UserTypes[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const fetchUsers = useLoaderData<ParentLoaderData>();

	// console.log('fetchUsers users data:', fetchUsers);

	const loadUsers = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await fetchUsers;
			setUsers(data.users);
		} catch (err) {
			setError('Failed to load users');
			console.error('Error loading users:', err);
		} finally {
			setIsLoading(false);
		}
	}, [fetchUsers]);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	return (
		<UserContext.Provider value={{ users, isLoading, error, refreshUsers: loadUsers }}>{children}</UserContext.Provider>
	);
}

// Hook สำหรับใช้งาน context
export function useUsers() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUsers must be used within a UserProvider');
	}
	return context;
}
