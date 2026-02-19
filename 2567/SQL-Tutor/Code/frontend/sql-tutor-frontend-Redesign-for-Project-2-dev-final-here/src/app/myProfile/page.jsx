'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  ScrollShadow,
  Card,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@heroui/react';
import { fetchTopics } from '@/components/User_components/Learn/service/courseService';
import {
  fetchProfile,
  updateProfile,
  deleteUserProfile,
} from '@/components/User_components/profile/useProfile';
import GetTokenData from '@/components/GetTokenData';

const EditIcon = () => {
  return (
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
  );
};

export default function MyProfile() {
  // Sample user data - in a real app, you would fetch this from an API
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const response = await fetchTopics();
        if (response.success && Array.isArray(response.data)) {
          setProgressData(response.data);
        } else {
          console.error('Invalid progress data format:', response);
        }
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetchProfile();
        setUserData(response);
        // console.log('User data:', response);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUser();
    fetchProgress();
  }, []);

  // Calculate completion percentage for each topic
  const calculateTopicProgress = (topic) => {
    if (!topic.SubTopics || topic.SubTopics.length === 0) return 0;

    let totalContents = 0;
    let completedContents = 0;
    let inProgressContents = 0;

    topic.SubTopics.forEach((subTopic) => {
      if (subTopic.Contents && subTopic.Contents.length > 0) {
        totalContents += subTopic.Contents.length;

        subTopic.Contents.forEach((content) => {
          if (content.state === 'pass') {
            completedContents += 1;
          } else if (content.state === 'wait') {
            inProgressContents += 1;
          }
          // 'lock' state counts toward total but not completed
        });
      }
    });

    // Calculate weighted progress - completed items count fully, in-progress items count half
    const progressValue =
      totalContents === 0
        ? 0
        : Math.round(
            ((completedContents + inProgressContents * 0.5) / totalContents) *
              100
          );

    // Make sure we don't exceed 100%
    return Math.min(progressValue, 100);
  };

  // Get status label and color based on state
  const getStatusInfo = (state) => {
    switch (state) {
      case 'pass':
        return { label: 'Completed', color: 'success' };
      case 'wait':
        return { label: 'In Progress', color: 'primary' };
      case 'rock':
      default:
        return { label: 'Not Started', color: 'default' };
    }
  };

  const getTypeInfo = (type) => {
    switch (type) {
      case 'L':
        return { label: 'Lesson', color: 'text-blue-400' };
      case 'EX':
        return { label: 'Exercise', color: 'text-purple-400' };
      case 'ET':
      default:
        return { label: 'Examtest', color: 'text-green-400' };
    }
  };

  const openEditForm = () => {
    setFormData({
      firstname: userData?.Firstname || '',
      lastname: userData?.Lastname || '',
      email: userData?.Email || '',
    });
    setIsEditOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Updated handleSubmit to work with HeroUI Modal
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const result = await updateProfile(
        formData.firstname,
        formData.lastname,
        formData.email
      );

      if (result) {
        // Update local state with new user data
        setUserData((prev) => ({
          ...prev,
          Firstname: formData.firstname,
          Lastname: formData.lastname,
          Email: formData.email,
        }));
        localStorage.setItem('firstname', formData.firstname);
        localStorage.setItem('lastname', formData.lastname);
        setIsEditOpen(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Add error handling here (could show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Replace the empty handleDeleteAccount function with this implementation
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const userId = GetTokenData(localStorage.getItem('token'), 'accountID');
      await deleteUserProfile(userId);

      // Clear all local storage data
      localStorage.clear();

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to delete account:', error);
      // You could add error notification here
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getAvatarUrl = (firstName, lastName) => {
    return `https://ui-avatars.com/api/?name=${firstName || 'User'}+${lastName || 'Name'}&background=random`;
  };

  if (!userData) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='h-full'>
      <div className='mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8'>
        <div className='flex max-h-[cal(100vh-4rem)] flex-col gap-6 md:flex-row'>
          {/* Profile Navigation Sidebar */}
          <div className='max-h-fit rounded-lg border bg-white px-6 py-4 shadow-md md:w-3/12'>
            <div className='flex flex-col items-center p-4'>
              <User
                name={userData?.Username}
                avatarProps={{
                  src: getAvatarUrl(userData?.Firstname, userData?.Lastname),
                  alt: `${userData?.Firstname || 'User'} ${userData?.Lastname || 'Name'}`,
                  className: 'w-20 h-20',
                }}
                className='flex flex-col items-center'
                classNames={{
                  name: 'text-xl font-bold text-gray-800',
                  description: 'text-sm text-gray-500',
                }}
              />
            </div>

            <nav className='mt-4'>
              <div>
                <div className='space-y-4'>
                  <div className='flex flex-row content-center items-center justify-between'>
                    <h3
                      id='profile-info'
                      className='text-lg font-medium text-gray-800'
                    >
                      Personal Information
                    </h3>

                    <Button
                      variant='light'
                      onPress={openEditForm}
                      aria-label='Edit profile information'
                      isIconOnly
                    >
                      <EditIcon />
                    </Button>
                  </div>

                  <div>
                    <div className='flex flex-col gap-4'>
                      <div>
                        <p className='text-sm text-gray-400'>Username</p>
                        <p className='font-medium'>{userData?.Username}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-400'>Email</p>
                        <p className='font-medium'>{userData?.Email}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-400'>First Name</p>
                        <p className='font-medium'>{userData?.Firstname}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-400'>Last Name</p>
                        <p className='font-medium'>{userData?.Lastname}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <div className='mt-6 border-t pt-6'>
              <Button
                color='danger'
                variant='flat'
                onPress={() => setIsDeleteModalOpen(true)}
                className='w-full'
              >
                Delete Account
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <ScrollShadow
            className='flex max-h-[calc(100vh-5rem)] w-full flex-col gap-4 pb-4 md:w-9/12 md:flex-col md:justify-between md:gap-4'
            hideScrollBar
            orientation='vertical'
            size={10}
          >
            {/* user information */}

            {/* user progress */}
            <div className='rounded-lg border bg-white p-6 shadow-md'>
              <div className='mb-6 border-b pb-4'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  User Progress
                </h2>
                <p className='text-gray-500'>
                  Track your learning progress and achievements
                </p>
              </div>

              {isLoading ? (
                <div className='flex h-32 items-center justify-center'>
                  <div className='h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500'></div>
                </div>
              ) : progressData.length === 0 ? (
                <Card shadow='sm' className='p-4'>
                  <p className='text-center text-gray-500'>
                    No progress data available
                  </p>
                </Card>
              ) : (
                <div className='space-y-6'>
                  {progressData.map((topic) => {
                    const progressPercent = calculateTopicProgress(topic);

                    return (
                      <Card key={topic.M_topic_id} shadow='sm' className='p-5'>
                        <div className='mb-4'>
                          <div className='mb-2 flex items-center justify-between'>
                            <h3 className='text-lg font-semibold'>
                              {topic.M_topic_title}
                            </h3>
                            <span
                              className={`rounded px-2 py-1 text-sm ${topic.status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              {topic.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          <div className='mb-2'>
                            <div className='mb-1 flex justify-between text-sm'>
                              <span>Progress</span>
                              <span>{progressPercent}%</span>
                            </div>
                            <Progress
                              value={progressPercent}
                              className='h-2'
                              color={
                                progressPercent === 100 ? 'success' : 'primary'
                              }
                            />
                          </div>
                        </div>

                        {topic.SubTopics && topic.SubTopics.length > 0 && (
                          <div className='mt-4 space-y-4 border-l-2 border-gray-200 pl-4'>
                            {topic.SubTopics.sort(
                              (a, b) => a.S_topic_id - b.S_topic_id
                            ).map((subTopic) => (
                              <div key={subTopic.S_topic_id} className='mb-3'>
                                <h4 className='mb-2 font-medium text-gray-800'>
                                  {subTopic.S_topic_title}
                                </h4>

                                {subTopic.Contents &&
                                subTopic.Contents.length > 0 ? (
                                  <div className='grid grid-cols-1 gap-2 pl-3'>
                                    {subTopic.Contents.map((content) => {
                                      const status = getStatusInfo(
                                        content.state
                                      );
                                      return (
                                        <div
                                          key={content.Content_id}
                                          className='flex items-center justify-between'
                                        >
                                          <div className='flex items-center gap-2'>
                                            <span
                                              className={`h-2 w-2 rounded-full ${
                                                status.color === 'success'
                                                  ? 'bg-green-500'
                                                  : status.color === 'primary'
                                                    ? 'bg-blue-500'
                                                    : 'bg-gray-300'
                                              }`}
                                            ></span>
                                            <span
                                              className={`text-sm ${
                                                getTypeInfo(
                                                  content.Content_type
                                                ).color
                                              } `}
                                            >
                                              {
                                                getTypeInfo(
                                                  content.Content_type
                                                ).label
                                              }
                                            </span>
                                          </div>
                                          <span
                                            className={`rounded px-2 py-1 text-xs ${
                                              status.color === 'success'
                                                ? 'bg-green-100 text-green-700'
                                                : status.color === 'primary'
                                                  ? 'bg-blue-100 text-blue-700'
                                                  : 'bg-gray-100 text-gray-600'
                                            }`}
                                          >
                                            {status.label}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className='pl-3 text-sm text-gray-500'>
                                    No content available
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollShadow>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          hideCloseButton
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        >
          <ModalContent className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-6 py-2 text-left align-middle shadow-xl transition-all'>
            <ModalHeader className='text-lg font-medium leading-6 text-gray-900'>
              Edit Profile
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

            <ModalFooter className='mt-6 flex justify-end space-x-3'>
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
        {/* Delete Account Modal */}
        <Modal
          hideCloseButton
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <ModalContent className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-6 py-2 text-left align-middle shadow-xl transition-all'>
            <ModalHeader className='text-lg font-medium leading-6 text-gray-900'>
              Delete Account
            </ModalHeader>

            <ModalBody>
              <p className='text-sm text-gray-500'>
                Are you sure you want to delete your account? This action cannot
                be undone. All your data will be permanently removed.
              </p>
            </ModalBody>

            <ModalFooter className='mt-6 flex justify-end space-x-3'>
              <Button
                variant='flat'
                onPress={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                color='danger'
                onPress={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
