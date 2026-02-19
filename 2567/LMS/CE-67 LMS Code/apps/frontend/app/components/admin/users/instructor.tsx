import type { UserTypes } from '@/interfaces/sharetype';
import RoleTable from './roleTable';

export default function AdminTable({ users }: { users: UserTypes[] }) {
	return <RoleTable users={users} roleType='INSTRUCTOR' editable={true} />;
}
