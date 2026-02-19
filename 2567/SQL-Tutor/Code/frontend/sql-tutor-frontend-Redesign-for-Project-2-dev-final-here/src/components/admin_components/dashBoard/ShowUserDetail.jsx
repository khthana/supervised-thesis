import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from '@heroui/react';
import { GetAllUsers } from './service/useDashboard';
import {
  updateProfile,
  deleteUserProfile,
} from '@/components/User_components/profile/useProfile';

const UserDataFetch = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await GetAllUsers();
      // Filter users with Permission 1
      const filteredUsers = allUsers.filter((user) => user.Permission === 1);
      setUsers(filteredUsers);
    };
    fetchUsers();
  }, []);
  return { users, setUsers };
};

const UserTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  const { users, setUsers } = UserDataFetch() || {
    users: [],
    setUsers: () => {},
  };

  // Calculate pagination values
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const columns = [
    { key: 'Account_ID', label: 'USER ID' },
    {
      key: 'username',
      label: 'USERNAME',
      renderCell: (user) => user.Username,
    },
    {
      key: 'firstname',
      label: 'Firstname',
      renderCell: (user) => `${user.Firstname}`,
    },
    {
      key: 'lastname',
      label: 'Lastname',
      renderCell: (user) => `${user.Lastname}`,
    },
    { key: 'Email', label: 'EMAIL' },

    { key: 'postCount', label: 'POSTS', className: 'text-center' },
    { key: 'progressCount', label: 'FINISH', className: 'text-center' },
    { key: 'actions', label: 'ACTION', className: 'text-center' },
  ];

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      firstname: user.Firstname,
      lastname: user.Lastname,
      email: user.Email,
    });
    setIsEditOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUserProfile(userToDelete.Account_ID);
      setUsers(
        users.filter((user) => user.Account_ID !== userToDelete.Account_ID)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile(
        formData.firstname,
        formData.lastname,
        formData.email,
        selectedUser.Account_ID // Make sure this is passed correctly
      );

      if (result) {
        const updatedUsers = users.map((user) =>
          user.Account_ID === selectedUser.Account_ID
            ? {
                ...user,
                Firstname: formData.firstname,
                Lastname: formData.lastname,
                Email: formData.email,
              }
            : user
        );
        setUsers(updatedUsers);
        setIsEditOpen(false);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCell = (user, columnKey) => {
    switch (columnKey) {
      case 'username':
        return user.Username;
      case 'firstname':
        return user.Firstname;
      case 'lastname':
        return user.Lastname;
      case 'Email':
        return user.Email;
      case 'postCount':
        return user.postCount || 0;
      case 'progressCount':
        return user.progressCount || 0;
      case 'actions':
        return (
          <div className='flex items-center justify-center gap-4'>
            <Tooltip content='Edit user'>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                onPress={() => handleEditUser(user)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                >
                  <path
                    d='M0.5 12.3751V15.5001H3.625L12.8417 6.28342L9.71667 3.15842L0.5 12.3751ZM15.2583 3.86675C15.3356 3.78966 15.3969 3.69808 15.4387 3.59727C15.4805 3.49646 15.502 3.38839 15.502 3.27925C15.502 3.17011 15.4805 3.06204 15.4387 2.96123C15.3969 2.86042 15.3356 2.76885 15.2583 2.69175L13.3083 0.74175C13.2312 0.664497 13.1397 0.603208 13.0389 0.56139C12.938 0.519572 12.83 0.498047 12.7208 0.498047C12.6117 0.498047 12.5036 0.519572 12.4028 0.56139C12.302 0.603208 12.2104 0.664497 12.1333 0.74175L10.6083 2.26675L13.7333 5.39175L15.2583 3.86675Z'
                    fill='#525252'
                  />
                </svg>
              </Button>
            </Tooltip>
            <Tooltip content='Delete user'>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                className='text-danger'
                onPress={() => handleDeleteClick(user)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='20'
                  viewBox='0 0 18 20'
                  fill='none'
                >
                  <path
                    d='M7 16C7.26522 16 7.51957 15.8946 7.70711 15.7071C7.89464 15.5196 8 15.2652 8 15V9C8 8.73478 7.89464 8.48043 7.70711 8.29289C7.51957 8.10536 7.26522 8 7 8C6.73478 8 6.48043 8.10536 6.29289 8.29289C6.10536 8.48043 6 8.73478 6 9V15C6 15.2652 6.10536 15.5196 6.29289 15.7071C6.48043 15.8946 6.73478 16 7 16ZM17 4H13V3C13 2.20435 12.6839 1.44129 12.1213 0.87868C11.5587 0.316071 10.7956 0 10 0H8C7.20435 0 6.44129 0.316071 5.87868 0.87868C5.31607 1.44129 5 2.20435 5 3V4H1C0.734784 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5C0 5.26522 0.105357 5.51957 0.292893 5.70711C0.48043 5.89464 0.734784 6 1 6H2V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V6H17C17.2652 6 17.5196 5.89464 17.7071 5.70711C17.8946 5.51957 18 5.26522 18 5C18 4.73478 17.8946 4.48043 17.7071 4.29289C17.5196 4.10536 17.2652 4 17 4ZM7 3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H10C10.2652 2 10.5196 2.10536 10.7071 2.29289C10.8946 2.48043 11 2.73478 11 3V4H7V3ZM14 17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H5C4.73478 18 4.48043 17.8946 4.29289 17.7071C4.10536 17.5196 4 17.2652 4 17V6H14V17ZM11 16C11.2652 16 11.5196 15.8946 11.7071 15.7071C11.8946 15.5196 12 15.2652 12 15V9C12 8.73478 11.8946 8.48043 11.7071 8.29289C11.5196 8.10536 11.2652 8 11 8C10.7348 8 10.4804 8.10536 10.2929 8.29289C10.1054 8.48043 10 8.73478 10 9V15C10 15.2652 10.1054 15.5196 10.2929 15.7071C10.4804 15.8946 10.7348 16 11 16Z'
                    fill='#FF5555'
                  />
                </svg>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return user[columnKey];
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate showing entries text
  const firstEntry = indexOfFirstUser + 1;
  const lastEntry = Math.min(indexOfLastUser, users.length);
  const totalEntries = users.length;

  const getCellAlignment = (columnKey) => {
    const centeredColumns = [
      'enrollmentDate',
      'postCount',
      'progressCount',
      'actions',
    ];
    return centeredColumns.includes(columnKey) ? 'text-center' : '';
  };

  return (
    <div className='PaddingXSet'>
      <div className='rg:pr-20 w-full sm:pr-10 md:pr-20'>
        <Table
          aria-label='User table'
          classNames={{
            wrapper: 'min-h-[650px]',
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className={`text-sm ${column.className || ''}`}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={currentUsers}>
            {(item) => (
              <TableRow key={item.Account_ID}>
                {(columnKey) => (
                  <TableCell className={getCellAlignment(columnKey)}>
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className='mt-5 flex items-center justify-between'>
          <span className='text-sm text-gray-500'>
            Showing {firstEntry} to {lastEntry} of {totalEntries} entries
          </span>
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='bordered'
              disabled={currentPage === 1}
              onPress={handlePreviousPage}
            >
              Previous
            </Button>
            <Button
              size='sm'
              variant='bordered'
              disabled={currentPage === totalPages}
              onPress={handleNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalBody>
            <Input
              label='First Name'
              name='firstname'
              value={formData.firstname}
              onChange={handleChange}
            />
            <Input
              label='Last Name'
              name='lastname'
              value={formData.lastname}
              onChange={handleChange}
            />
            <Input
              label='Email'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant='light'
              onPress={() => setIsEditOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onPress={handleSubmit}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        hideCloseButton
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      >
        <ModalContent className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-6 py-2 text-left align-middle shadow-xl transition-all'>
          <ModalHeader className='text-lg font-medium leading-6 text-gray-900'>
            Edit User
          </ModalHeader>

          <ModalBody>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='firstname'
                  className='block text-sm font-medium text-gray-700'
                >
                  First Name
                </label>
                <Input
                  radius='sm'
                  id='firstname'
                  name='firstname'
                  value={formData.firstname}
                  onChange={handleChange}
                  className='mt-1'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='lastname'
                  className='block text-sm font-medium text-gray-700'
                >
                  Last Name
                </label>
                <Input
                  radius='sm'
                  id='lastname'
                  name='lastname'
                  value={formData.lastname}
                  onChange={handleChange}
                  className='mt-1'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <Input
                  radius='sm'
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='mt-1'
                  required
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className='flex justify-end space-x-3'>
            <Button
              label='Cancel'
              variant='flat'
              onPress={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              label='Save Changes'
              color='primary'
              disabled={isSubmitting}
              onPress={handleSubmit}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className='pb-2'>
            <span className='w-full font-bold text-red-500'>Delete User</span>
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete {userToDelete?.Username}? This
            action cannot be undone.
          </ModalBody>
          <ModalFooter className='pt-2'>
            <Button
              variant='light'
              onPress={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color='danger'
              onPress={handleDeleteConfirm}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserTable;
