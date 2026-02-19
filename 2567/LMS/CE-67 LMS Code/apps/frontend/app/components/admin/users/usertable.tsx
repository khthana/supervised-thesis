import { Button } from '@/components/global/shadcn/button';
import { Input } from '@/components/global/shadcn/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/global/shadcn/table';
import { useDataTable } from '@/hooks/useDataTable';
import type { UserTypes } from '@/interfaces/sharetype';
import type { UserRegister } from '@shared/types/auth.model';
import type { UserRole } from '@shared/types/users/user.model';
import type { Cell } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form, useActionData, useFetcher, useNavigation, useSubmit } from 'react-router-dom';
import { FilterMenu } from './filter_menu';
import { columns as initialColumns } from './tableuser';

interface UserDataTableProps {
	users: UserTypes[];
	roleType: UserRole;
	editable?: boolean;
	onUserDataChange?: (updatedUsers: UserTypes[]) => void;
}

export default function UserDataTable({ users, roleType, editable = false, onUserDataChange }: UserDataTableProps) {
	// States...
	const [tableConfig, setTableConfig] = useState({
		sorting: [],
		columnFilters: [],
		columnVisibility: {},
	});

	const filteredUsers = useMemo(
		() =>
			users.filter((user: UserTypes) => {
				if (!user) return false;
				const role = user.user_role?.toString().toUpperCase() || '';
				return role === roleType;
			}),
		[users, roleType],
	);

	const [editState, setEditState] = useState({
		cell: null as { rowId: string; columnId: string } | null,
		value: '',
		error: null as string | null,
	});

	const [isAddingNewRow, setIsAddingNewRow] = useState(false);
	const [newUserData, setNewUserData] = useState({
		email: '',
		firstname_en: '',
		lastname_en: '',
		role: roleType,
	});

	const inputRef = useRef<HTMLInputElement>(null);
	const newRowInputRef = useRef<HTMLInputElement>(null);

	// React Router hooks
	const submit = useSubmit();
	const fetcher = useFetcher();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === 'submitting' || fetcher.state === 'submitting';
	const actionData = useActionData() as
		| { status: number; message: string; user: UserRegister & { user_id: number } }
		| undefined;
	const [submitError, setSubmitError] = useState<string | null>(null);

	useEffect(() => {
		if (fetcher.data) {
			const data = fetcher.data as { status: number; message: string; user: UserRegister };

			if (data.status === 200) {
				// หากสำเร็จ
				// console.log('User created successfully:', data.user);

				// รีเซ็ตฟอร์ม
				setNewUserData({
					email: '',
					firstname_en: '',
					lastname_en: '',
					role: roleType,
				});

				setIsAddingNewRow(false);
				setSubmitError(null);

				// ถ้ามี callback รีเฟรชข้อมูล
				if (onUserDataChange) {
					// สร้างข้อมูลผู้ใช้ใหม่ที่มีรวม user ที่เพิ่มเข้ามา
					const updatedUsers = [...users];
					if (data.user) {
						updatedUsers.push(data.user as unknown as UserTypes);
					}
					onUserDataChange(updatedUsers);
				}
			} else {
				// หากเกิดข้อผิดพลาด
				setSubmitError(data.message);
			}
		}
	}, [fetcher.data, onUserDataChange, roleType, users]);

	useEffect(() => {
		if (fetcher.data) {
			const data = fetcher.data as { status: number; message: string; user: UserRegister };

			if (data.status === 200) {
				console.log('User created successfully:', data.user);

				setNewUserData({
					email: '',
					firstname_en: '',
					lastname_en: '',
					role: roleType,
				});

				setIsAddingNewRow(false);
				setSubmitError(null);

				setTimeout(() => {
					window.location.reload();
				}, 500);
			} else {
				setSubmitError(data.message);
			}
		}
	}, [fetcher.data, roleType]);

	// Combined validator functions
	const validators = useMemo(
		() => ({
			email: {
				validate: (email: string) => {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					return {
						valid: emailRegex.test(email),
						message: 'Please enter a valid email address',
					};
				},
			},
			fullName: {
				validate: (name: string) => {
					const nameParts = name.split(' ');
					return {
						valid: nameParts.length >= 2 && name.trim() !== '',
						message: 'Please enter a valid full name',
					};
				},
			},
			role: {
				validate: (role: string) => {
					return {
						valid: ['ANNOUNCER', 'INSTRUCTOR', 'LEARNER'].includes(role),
						message: 'Please select a valid role',
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
		}),
		[],
	);

	// Auto-focus when entering edit mode
	useEffect(() => {
		if (editState.cell && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editState.cell]);

	// Auto-focus when adding new row
	useEffect(() => {
		if (isAddingNewRow && newRowInputRef.current) {
			newRowInputRef.current.focus();
		}
	}, [isAddingNewRow]);

	const handleInlineEdit = useCallback(
		(cell: Cell<UserTypes, unknown>) => {
			if (!editable) return;

			setEditState({
				cell: { rowId: cell.row.original.user_id, columnId: cell.column.id },
				value: cell.getValue() as string,
				error: null,
			});
		},
		[editable],
	);

	// Validate and apply edit changes
	const saveInlineEdit = useCallback(
		(rowId: string, columnId: string, newValue: string) => {
			// ตรวจสอบข้อมูล...
			let validationResult = { valid: true, message: '' };
			validationResult = validators.required.validate(newValue);
			if (!validationResult.valid) {
				setEditState((prev) => ({ ...prev, error: validationResult.message }));
				return;
			}

			// ตรวจสอบข้อมูลเฉพาะ...
			if (columnId === 'fullName_en' || columnId === 'fullName_th') {
				validationResult = validators.fullName.validate(newValue);
			} else if (columnId === 'email') {
				validationResult = validators.email.validate(newValue);
			} else if (columnId === 'role') {
				validationResult = validators.role.validate(newValue);
			}

			if (!validationResult.valid) {
				setEditState((prev) => ({ ...prev, error: validationResult.message }));
				return;
			}

			// อัพเดทข้อมูล...
			const updateUser = (user: UserTypes): UserTypes => {
				if (user.user_id !== rowId) return user;

				// จัดการกับชื่อ
				if (columnId === 'fullName_en') {
					const [firstname, ...lastnameParts] = newValue.split(' ');
					const lastname = lastnameParts.join(' ');
					return {
						...user,
						firstname_en: firstname,
						lastname_en: lastname,
					};
				}

				if (columnId === 'fullName_th') {
					const [firstname, ...lastnameParts] = newValue.split(' ');
					const lastname = lastnameParts.join(' ');
					return {
						...user,
						firstname_th: firstname,
						lastname_th: lastname,
					};
				}

				// จัดการกับข้อมูล boolean
				if (columnId === 'is_verified' || columnId === 'is_active') {
					return { ...user, [columnId]: newValue === 'true' };
				}

				// จัดการกับข้อมูลอื่นๆ
				return { ...user, [columnId]: newValue };
			};

			// อัพเดทข้อมูลทั้งหมด
			const updatedUsers = users.map(updateUser);

			// แจ้ง parent component ถ้ามี callback
			if (onUserDataChange) {
				onUserDataChange(updatedUsers);
			}

			// รีเซ็ต edit state
			setEditState({
				cell: null,
				value: '',
				error: null,
			});

			// ดึงข้อมูลผู้ใช้ที่ต้องการอัพเดท
			const userToUpdate = updatedUsers.find((u) => u.user_id === rowId);

			if (userToUpdate) {
				// สร้างออบเจกต์ข้อมูลที่ต้องการส่ง
				const userData = {
					email: userToUpdate.email || '',
					firstname_en: userToUpdate.firstname_en || '',
					lastname_en: userToUpdate.lastname_en || '',
					firstname_th: userToUpdate.firstname_th || '',
					lastname_th: userToUpdate.lastname_th || '',
				};

				// อัพเดทข้อมูลตาม columnId
				if (columnId === 'email') {
					userData.email = newValue;
				} else if (columnId === 'fullName_en') {
					const [firstname, ...lastnameParts] = newValue.split(' ');
					userData.firstname_en = firstname;
					userData.lastname_en = lastnameParts.join(' ');
				} else if (columnId === 'fullName_th') {
					const [firstname, ...lastnameParts] = newValue.split(' ');
					userData.firstname_th = firstname;
					userData.lastname_th = lastnameParts.join(' ');
				}

				console.log('User data to send:', userData);

				// แปลงเป็น FormData
				const formData = new FormData();
				for (const [key, value] of Object.entries(userData)) {
					formData.append(key, value);
				}

				// ตรวจสอบข้อมูลที่จะส่ง
				console.log('Sending data:', Object.fromEntries(formData.entries()));

				// ใช้ fetcher แทน submit เพื่อไม่ให้มีการเปลี่ยนหน้า
				fetcher.submit(formData, {
					method: 'POST',
					action: '/action/change/userData',
				});
			}
		},
		[validators, users, onUserDataChange, fetcher],
	);

	const cancelEditing = useCallback(() => {
		setEditState({
			cell: null,
			value: '',
			error: null,
		});
	}, []);

	const cancelAddUser = useCallback(() => {
		setIsAddingNewRow(false);
		setNewUserData({
			email: '',
			firstname_en: '',
			lastname_en: '',
			role: roleType,
		});
		setSubmitError(null);
	}, [roleType]);

	// จัดการการเพิ่มผู้ใช้ใหม่ - ใช้ fetcher แทน submit
	const handleAddUser = useCallback(() => {
		if (isAddingNewRow) {
			// Validate form data
			if (!validators.email.validate(newUserData.email).valid) {
				setSubmitError('Please enter a valid email address');
				return;
			}

			if (
				!validators.required.validate(newUserData.firstname_en).valid ||
				!validators.required.validate(newUserData.lastname_en).valid
			) {
				setSubmitError('กรุณากรอกชื่อภาษาอังกฤษให้ครบถ้วน');
				return;
			}

			// สร้างออบเจกต์ข้อมูลที่ต้องการส่ง
			const userData = {
				email: newUserData.email,
				firstname_en: newUserData.firstname_en,
				lastname_en: newUserData.lastname_en,
				role: roleType,
				action: 'create',
			};

			// แปลงเป็น FormData
			const formData = new FormData();
			for (const [key, value] of Object.entries(userData)) {
				formData.append(key, value);
			}

			// ส่งไปยัง action โดยใช้ fetcher แทน submit
			fetcher.submit(formData, {
				method: 'post',
				action: '/action/adm/registerUser',
			});
		} else {
			// เปิดโหมดเพิ่มผู้ใช้
			setIsAddingNewRow(true);
			setNewUserData({
				email: '',
				firstname_en: '',
				lastname_en: '',
				role: roleType,
			});
			setSubmitError(null);
		}
	}, [isAddingNewRow, newUserData, roleType, validators, fetcher]);

	const table = useDataTable({
		data: filteredUsers,
		columns: initialColumns,
		initialPageSize: 6,
		initialSorting: tableConfig.sorting,
		initialColumnFilters: tableConfig.columnFilters,
		initialColumnVisibility: tableConfig.columnVisibility,
		enableRowSelection: true,
		enableMultiRowSelection: true,
	});

	// แสดงเนื้อหาของ cell
	const renderCellContent = useCallback(
		(cell: Cell<UserTypes, unknown>) => {
			const { cell: editingCell, value: editedValue, error } = editState;
			const rowId = cell.row.original.user_id;
			const columnId = cell.column.id;

			// ตรวจสอบว่า cell นี้กำลังถูกแก้ไขหรือไม่
			if (editingCell?.rowId === rowId && editingCell?.columnId === columnId) {
				// แสดง editor ตามประเภทของคอลัมน์
				if (columnId === 'role') {
					return (
						<select
							value={editedValue}
							onChange={(e) => setEditState((prev) => ({ ...prev, value: e.target.value }))}
							onBlur={() => saveInlineEdit(rowId, columnId, editedValue)}
							className='w-full p-2 border rounded'
						>
							<option value='ANNOUNCER'>Announcer</option>
							<option value='INSTRUCTOR'>Instructor</option>
							<option value='LEARNER'>Learner</option>
						</select>
					);
				}

				if (columnId === 'is_verified' || columnId === 'is_active') {
					return (
						<select
							value={editedValue}
							onChange={(e) => setEditState((prev) => ({ ...prev, value: e.target.value }))}
							onBlur={() => saveInlineEdit(rowId, columnId, editedValue)}
							className='w-full p-2 border rounded'
						>
							<option value='true'>Yes</option>
							<option value='false'>No</option>
						</select>
					);
				}

				return (
					<Input
						ref={inputRef}
						type='text'
						value={editedValue}
						onChange={(e) => setEditState((prev) => ({ ...prev, value: e.target.value }))}
						onBlur={() => saveInlineEdit(rowId, columnId, editedValue)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								saveInlineEdit(rowId, columnId, editedValue);
							}
							if (e.key === 'Escape') {
								cancelEditing();
							}
						}}
						className='w-full'
					/>
				);
			}

			// แสดง cell ปกติ
			return flexRender(cell.column.columnDef.cell, cell.getContext());
		},
		[editState, saveInlineEdit, cancelEditing],
	);

	// นับจำนวนคอลัมน์ที่แสดง
	const columnCount = useMemo(() => {
		return table.getAllColumns().filter((col) => col.getIsVisible()).length;
	}, [table]);

	return (
		<div className='w-full'>
			<FilterMenu table={table} />

			{(editState.error || submitError) && (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4' role='alert'>
					<span className='block sm:inline'>{editState.error || submitError}</span>
				</div>
			)}

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.original.user_id || `row-${row.id}`} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											onDoubleClick={() => handleInlineEdit(cell)}
											className={editable ? 'cursor-pointer hover:bg-gray-50' : ''}
										>
											{renderCellContent(cell)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columnCount} className='h-24 text-center'>
									No users found
								</TableCell>
							</TableRow>
						)}

						{/* แถวสำหรับเพิ่มผู้ใช้ใหม่ */}
						{isAddingNewRow && (
							<TableRow className='bg-gray-50'>
								{table
									.getAllColumns()
									.filter((col) => col.getIsVisible())
									.map((column) => {
										// คอลัมน์ลำดับหรือเช็คบ็อกซ์
										if (column.id === 'select' || column.id === 'rowNumber') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<span className='text-gray-400'>Auto</span>
												</TableCell>
											);
										}

										// คอลัมน์อีเมล
										if (column.id === 'email') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<Input
														ref={newRowInputRef}
														type='email'
														placeholder='Email'
														value={newUserData.email}
														onChange={(e) => setNewUserData((prev) => ({ ...prev, email: e.target.value }))}
														className={`w-full ${submitError?.includes('Emails') ? 'border-red-500' : ''}`}
													/>
												</TableCell>
											);
										}

										// คอลัมน์ชื่อภาษาอังกฤษ
										if (column.id === 'fullName_en') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<div className='flex space-x-2'>
														<Input
															type='text'
															placeholder='Name'
															value={newUserData.firstname_en}
															onChange={(e) => setNewUserData((prev) => ({ ...prev, firstname_en: e.target.value }))}
															className={`w-1/2 ${submitError?.includes('Name') ? 'border-red-500' : ''}`}
														/>
														<Input
															type='text'
															placeholder='lastname'
															value={newUserData.lastname_en}
															onChange={(e) => setNewUserData((prev) => ({ ...prev, lastname_en: e.target.value }))}
															className={`w-1/2 ${submitError?.includes('Name') ? 'border-red-500' : ''}`}
														/>
													</div>
												</TableCell>
											);
										}

										// คอลัมน์ชื่อภาษาไทย
										if (column.id === 'fullName_th') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<span className='text-gray-400'>N/A</span>
												</TableCell>
											);
										}

										// คอลัมน์บทบาท - ควรกำหนดล่วงหน้าตามประเภทตาราง
										if (column.id === 'role') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<span className='text-gray-600'>{roleType}</span>
												</TableCell>
											);
										}

										// สถานะการยืนยัน
										if (column.id === 'is_verified') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<span className='text-gray-400'>Auto</span>
												</TableCell>
											);
										}

										// สถานะการเปิดใช้งาน
										if (column.id === 'is_active') {
											return (
												<TableCell key={`new-cell-${column.id}`}>
													<span className='text-gray-400'>Auto</span>
												</TableCell>
											);
										}

										// คอลัมน์อื่นๆ
										return (
											<TableCell key={`new-cell-${column.id}`}>
												<span className='text-gray-400'>Auto</span>
											</TableCell>
										);
									})}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* ปุ่มเพิ่ม/บันทึก */}
			<div className='flex justify-end space-x-2 py-4'>
				<Button
					className={`${isAddingNewRow ? 'bg-green-600' : 'bg-blue-600'} rounded text-white`}
					variant='ghost'
					size='sm'
					onClick={handleAddUser}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Saving...' : isAddingNewRow ? 'Save' : 'Add New User'}
				</Button>

				{isAddingNewRow && (
					<Button
						className='bg-gray-500 rounded text-white'
						variant='ghost'
						size='sm'
						onClick={cancelAddUser}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
				)}
			</div>

			{/* การแบ่งหน้า */}
			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='flex-1 text-sm text-muted-foreground'>
					Select {table.getFilteredSelectedRowModel().rows.length} To {table.getFilteredRowModel().rows.length} orders
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
