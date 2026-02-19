// roleTable.tsx (แก้ไข)
import type { UserTypes } from '@/interfaces/sharetype';
import type { UserRole } from '@shared/types/users/user.model';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
// import type { ParentLoaderData } from '../../../routes/_action.adm.getUsers';
import UserDataTable from './usertable';

interface RoleTableProps {
	users: UserTypes[];
	roleType: UserRole;
	editable?: boolean;
}

export default function RoleTable({ users: initialUsers, roleType, editable = false }: RoleTableProps) {
	const { users } = useLoaderData() as { users: UserTypes[] };
	const revalidator = useRevalidator();

	const latestUsers = useLoaderData() as { users: UserTypes[] };

	const handleUserDataChange = useCallback(() => {
		revalidator.revalidate();
	}, [revalidator]);

	return (
		<UserDataTable users={users} roleType={roleType} editable={editable} onUserDataChange={handleUserDataChange} />
	);
}
