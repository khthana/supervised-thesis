'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  ScrollShadow,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from '@heroui/react';

import {
  GetAllPosts,
  CreatePost,
  CreateComment,
  GetPostById,
  getAvatar,
  MarkCommentHelpful,
  CreateReply,
  GetRepliesByComment,
  DeletePost,
  DeleteComment,
  DeleteReply,
  handleEditContent,
} from '@/components/community/service/usecommunity';
import GetTokenData from '@/components/GetTokenData';
import TextEditor from '@/components/community/textEditor_community';

//icons
const MessageCircle = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
  >
    <path
      d='M12 21C13.78 21 15.5201 20.4722 17.0001 19.4832C18.4802 18.4943 19.6337 17.0887 20.3149 15.4442C20.9961 13.7996 21.1743 11.99 20.8271 10.2442C20.4798 8.49836 19.6226 6.89472 18.364 5.63604C17.1053 4.37737 15.5016 3.5202 13.7558 3.17294C12.01 2.82567 10.2004 3.0039 8.55585 3.68509C6.91131 4.36628 5.50571 5.51983 4.51677 6.99987C3.52784 8.47991 3 10.22 3 12C3 13.488 3.36 14.891 4 16.127L3 21L7.873 20C9.109 20.64 10.513 21 12 21Z'
      stroke='#525252'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const BackArrow = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M15 18l-6-6 6-6' />
  </svg>
);
//end icons

// Simplified formatTimeAgo function with English text
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Check each interval
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(secondsAgo / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

// Format date function
const formatDate = (dateString) => {
  const timeAgo = formatTimeAgo(dateString);

  // For tooltips or detailed view, keep the full date format
  const fullDate = new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    timeAgo,
    fullDate,
  };
};

// UserAvatar component
const UserAvatar = ({ accountId, username, size = 'sm', className = '' }) => {
  const [avatarInfo, setAvatarInfo] = useState({ firstName: '', lastName: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvatarInfo = async () => {
      try {
        setLoading(true);
        const profileData = await getAvatar(accountId);
        setAvatarInfo({
          firstName: profileData.Firstname,
          lastName: profileData.Lastname,
        });
      } catch (error) {
        console.error('Error loading avatar info:', error);
        setAvatarInfo({ firstName: 'User', lastName: 'Name' });
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      loadAvatarInfo();
    }
  }, [accountId]);

  const getAvatarUrl = (firstName, lastName) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff`;
  };

  return (
    <Avatar
      src={getAvatarUrl(avatarInfo.firstName, avatarInfo.lastName)}
      showFallback
      className={className}
      size={size}
      name={loading ? 'Loading' : username}
    />
  );
};

// PostListItem component
const PostListItem = ({ post, onClick, onEdit, onDelete }) => {
  const isOwner =
    String(post.Account_ID) ===
      String(GetTokenData(localStorage.getItem('token'), 'accountID')) ||
    GetTokenData(localStorage.getItem('token'), 'role') === '0';

  const handleClick = (e) => {
    // Prevent click if clicking on dropdown or its children
    if (e.target.closest('.dropdown-trigger')) {
      return;
    }
    onClick(post);
  };

  return (
    <div className='cursor-pointer' onClick={handleClick}>
      <Card className='p-4 hover:bg-gray-50' shadow='sm'>
        <div className='flex flex-col items-start gap-2'>
          <div className='flex w-full flex-row items-center justify-between'>
            <div className='flex flex-row items-center gap-2'>
              <UserAvatar
                accountId={post.Account_ID}
                username={post.Username}
                size='sm'
                className='h-8 w-8'
              />
              <h3 className='font-medium text-gray-500'>{post.Username}</h3>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className='text-sm text-gray-500'
                title={formatDate(post.Created_At).fullDate}
              >
                {formatDate(post.Created_At).timeAgo}
              </span>
              {isOwner && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant='light'
                      isIconOnly
                      className='dropdown-trigger'
                      onPress={(e) => e.stopPropagation()}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <circle cx='12' cy='12' r='1' />
                        <circle cx='12' cy='5' r='1' />
                        <circle cx='12' cy='19' r='1' />
                      </svg>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='Post actions'
                    onAction={(key) => {
                      if (key === 'edit') onEdit(post);
                      if (key === 'delete') onDelete(post);
                    }}
                  >
                    <DropdownItem key='edit' className='text-blue-600'>
                      Edit post
                    </DropdownItem>
                    <DropdownItem key='delete' className='text-red-600'>
                      Delete post
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-2 pl-10'>
            <h4 className='mt-1 font-semibold text-gray-800'>{post.Title}</h4>
            <div className='mt-2 flex flex-row items-center gap-2'>
              <MessageCircle />
              <span className='text-sm text-gray-500'>
                {post.commentCount} comments
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Update the PostDetail component
const PostDetail = ({ post, onBack, onCommentClick, onEdit, onDelete }) => {
  const [postData, setPostData] = useState(post);
  const [loading, setLoading] = useState(true);
  // Add these state variables for reply editing
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState('');
  const isOwner =
    String(postData?.Account_ID) ===
      String(GetTokenData(localStorage.getItem('token'), 'accountID')) ||
    GetTokenData(localStorage.getItem('token'), 'role') === '0';

  // Add function to refresh post data
  const refreshPostData = async () => {
    try {
      if (post.Post_ID) {
        const result = await GetPostById(post.Post_ID);
        if (result.success) {
          setPostData({
            ...result.data,
            comments: Array.isArray(result.data.Comments)
              ? result.data.Comments.map((comment) => ({
                  ...comment,
                  replies: comment.replies || [],
                }))
              : [],
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing post data:', error);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshPostData();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [post.Post_ID]);

  // Handle successful reply creation
  const handleReplyCreated = async () => {
    await refreshPostData();
  };

  // Add these handlers for reply editing and deleting
  // Inside the Comment component
  const handleEditReply = async (replyId, content) => {
    try {
      const result = await handleEditContent({
        replyId: replyId,
        content: content,
      });

      if (result.success) {
        setEditingReplyId(null);
        await refreshPostData(); // Use refreshPostData instead of onReplyCreated
      } else {
        if (result.error === 'Token expired') {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          return;
        }
        console.error('Failed to edit reply:', result.error);
      }
    } catch (error) {
      console.error('Error editing reply:', error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    // console.log('Deleting reply:', replyId);
    try {
      const result = await DeleteReply(replyId);
      if (result.success) {
        await refreshPostData();
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  if (loading)
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );

  if (!postData) return <div>No post data available</div>;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button
          onPress={onBack}
          variant='light'
          className='flex items-center gap-2'
        >
          <BackArrow />
          <span>Back to post list</span>
        </Button>
      </div>

      <Card className='p-6' shadow='sm'>
        <div className='flex items-start gap-4'>
          <UserAvatar
            accountId={postData.Account_ID}
            username={postData.Username}
            size='md'
            className='h-10 w-10'
          />
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <h3 className='font-medium text-gray-900'>
                  {postData.Username}
                </h3>
              </div>
              <div className='flex items-center gap-4'>
                <span
                  className='text-sm text-gray-500'
                  title={formatDate(postData.Created_At).fullDate}
                >
                  {formatDate(postData.Created_At).timeAgo}
                </span>
                {isOwner && (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant='light'
                        isIconOnly
                        className='dropdown-trigger'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <circle cx='12' cy='12' r='1' />
                          <circle cx='12' cy='5' r='1' />
                          <circle cx='12' cy='19' r='1' />
                        </svg>
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label='Post actions'
                      onAction={(key) => {
                        if (key === 'edit') onEdit(postData);
                        if (key === 'delete') onDelete(postData);
                      }}
                    >
                      <DropdownItem key='edit' className='text-blue-600'>
                        Edit post
                      </DropdownItem>
                      <DropdownItem key='delete' className='text-red-600'>
                        Delete post
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </div>
            <h2 className='mb-4 mt-2 border-b-1 py-2 text-xl font-semibold text-gray-900'>
              {postData.Title}
            </h2>
            <div className='ql-snow'>
              <div
                // className='ql-editor'
                dangerouslySetInnerHTML={{ __html: postData.Content }}
              />
            </div>

            {postData.code && (
              <pre className='mt-4 rounded-lg bg-gray-900 p-4'>
                <code className='text-sm text-white'>{postData.code}</code>
              </pre>
            )}
          </div>
        </div>
      </Card>

      {/* Comments section */}
      <div className='mt-8'>
        <div className='flex flex-row items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Comments ({postData.comments?.length || 0})
          </h3>
          <Button
            onPress={() => {
              if (checkAuthAndRedirect()) {
                onCommentClick(postData.Post_ID);
              }
            }}
            variant='bordered'
            color='primary'
          >
            Add comment
          </Button>
        </div>
        <div className='mt-4 space-y-4'>
          {postData.comments && postData.comments.length > 0 ? (
            postData.comments
              .sort((a, b) => {
                // Sort by Is_Helpful (true first)
                if (a.Is_Helpful && !b.Is_Helpful) return -1;
                if (!a.Is_Helpful && b.Is_Helpful) return 1;
                // If same helpful status, sort by newest first
                return new Date(b.Created_At) - new Date(a.Created_At);
              })
              .map((comment, index) => (
                <div key={comment.Comment_ID || `comment-${index}`}>
                  <Comment
                    comment={comment}
                    postAccountId={postData.Account_ID}
                    onReplyCreated={handleReplyCreated} // Pass down the refresh handler
                  />
                  {/* Display replies */}
                  {comment.Replies && comment.Replies.length > 0 && (
                    <div className='ml-8 mt-2 space-y-2 border-l-2 border-green-200 pl-24'>
                      {comment.Replies.map((reply, replyIndex) => (
                        <div
                          key={reply.Reply_ID || `reply-${replyIndex}`}
                          className='rounded-br-xl border-l-2 border-blue-200 pl-3'
                        >
                          <div className='flex items-start gap-3'>
                            <UserAvatar
                              accountId={reply.Account_ID}
                              username={reply.Username}
                              size='sm'
                              className='h-6 w-6'
                            />
                            <div className='flex-1'>
                              <div className='flex items-center justify-between'>
                                <span className='text-sm font-medium text-gray-900'>
                                  {reply.Username}
                                </span>
                                <div className='flex items-center gap-2'>
                                  <span className='text-xs text-gray-500'>
                                    {formatDate(reply.Created_At).timeAgo}
                                  </span>
                                  {String(reply.Account_ID) ===
                                    String(
                                      GetTokenData(
                                        localStorage.getItem('token'),
                                        'accountID'
                                      )
                                    ) ||
                                  GetTokenData(
                                    localStorage.getItem('token'),
                                    'role'
                                  ) === '0' ? (
                                    <Dropdown>
                                      <DropdownTrigger>
                                        <Button
                                          variant='light'
                                          isIconOnly
                                          className='dropdown-trigger'
                                        >
                                          <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='24'
                                            height='24'
                                            viewBox='0 0 24 24'
                                            fill='none'
                                            stroke='currentColor'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          >
                                            <circle cx='12' cy='12' r='1' />
                                            <circle cx='12' cy='5' r='1' />
                                            <circle cx='12' cy='19' r='1' />
                                          </svg>
                                        </Button>
                                      </DropdownTrigger>
                                      <DropdownMenu>
                                        <DropdownItem
                                          key='edit'
                                          className='text-blue-600'
                                          onPress={() => {
                                            setEditingReplyId(reply.Reply_ID);
                                            setEditedReplyContent(
                                              reply.Content
                                            );
                                          }}
                                        >
                                          Edit reply
                                        </DropdownItem>
                                        <DropdownItem
                                          key='delete'
                                          className='text-red-600'
                                          onPress={() =>
                                            handleDeleteReply(reply.Reply_ID)
                                          }
                                        >
                                          Delete reply
                                        </DropdownItem>
                                      </DropdownMenu>
                                    </Dropdown>
                                  ) : null}
                                </div>
                              </div>
                              {editingReplyId === reply.Reply_ID ? (
                                <div className='mt-2'>
                                  <TextEditor
                                    initialContent={reply.Content}
                                    getContext={setEditedReplyContent}
                                    size='20vh'
                                  />
                                  <div className='mt-2 flex justify-end gap-2'>
                                    <Button
                                      variant='light'
                                      onPress={() => setEditingReplyId(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      color='primary'
                                      onPress={() =>
                                        handleEditReply(
                                          reply.Reply_ID,
                                          editedReplyContent
                                        )
                                      }
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className='mt-2 text-sm text-gray-600'
                                  dangerouslySetInnerHTML={{
                                    __html: reply.Content,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div className='py-4 text-center text-gray-500'>
              No comments yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Update the Comment component with edit and delete functionality
const Comment = ({ comment, postAccountId, onReplyCreated }) => {
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.Content);
  const isPostOwner =
    String(postAccountId) ===
      String(GetTokenData(localStorage.getItem('token'), 'accountID')) ||
    GetTokenData(localStorage.getItem('token'), 'role') === '0';
  const isCommentOwner =
    String(comment.Account_ID) ===
      String(GetTokenData(localStorage.getItem('token'), 'accountID')) ||
    GetTokenData(localStorage.getItem('token'), 'role') === '0';

  // Add state for reply editing in the Comment component
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState('');
  const [isHelpful, setIsHelpful] = useState(comment.Is_Helpful);

  const handleDeleteComment = async () => {
    try {
      const result = await DeleteComment(comment.Comment_ID);
      if (result.success) {
        // Refresh the parent component
        if (onReplyCreated) {
          await onReplyCreated();
        }
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = async () => {
    try {
      const result = await handleEditContent({
        commentId: comment.Comment_ID,
        content: editedContent,
      });

      if (result.success) {
        setIsEditing(false);
        if (onReplyCreated) {
          await onReplyCreated();
        }
      } else {
        console.error('Failed to edit comment:', result.error);
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleReplySubmitted = async () => {
    try {
      // Fetch updated comment data including new replies
      const result = await GetRepliesByComment(comment.Comment_ID);
      if (result.success) {
        setReplies(result.data.replies || []);
        // Call the parent's refresh handler
        if (onReplyCreated) {
          await onReplyCreated();
        }
      }
    } catch (error) {
      console.error('Error updating replies:', error);
    }
  };

  const handleUseful = async (comment) => {
    try {
      const result = await MarkCommentHelpful(comment.Comment_ID);
      if (result.success) {
        setIsHelpful(true);
        // console.log('Comment marked as helpful:', result.data);
      } else {
        console.error('Failed to mark comment as helpful:', result.error);
      }
    } catch (error) {
      console.error('Error marking comment as helpful:', error);
    }
  };

  // Add these functions inside the Comment component
  const handleEditReply = async (replyId, content) => {
    try {
      const result = await handleEditContent({
        replyId: replyId,
        content: content,
      });

      if (result.success) {
        setEditingReplyId(null);
        if (onReplyCreated) {
          await onReplyCreated();
        }
      } else {
        if (result.error === 'Token expired') {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          return;
        }
        console.error('Failed to edit reply:', result.error);
      }
    } catch (error) {
      console.error('Error editing reply:', error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const result = await handleDeleteComment(replyId);
      if (result.success) {
        // Refresh the parent component
        if (onReplyCreated) {
          await onReplyCreated();
        }
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  return (
    <div className='ml-8 mt-4 border-l-2 border-green-200 pl-4'>
      <div className='flex items-start gap-4'>
        <UserAvatar
          accountId={comment.Account_ID}
          username={comment.Username}
          size='sm'
          className='h-8 w-8'
        />
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-5'>
              <h4 className='font-medium text-gray-900'>{comment.Username}</h4>
              {isHelpful && (
                <Chip size='sm' className='bg-green-100 px-2 text-green-600'>
                  <div className='flex items-center gap-1'>
                    <svg
                      fill='#ffffff'
                      width='12px'
                      height='12px'
                      viewBox='0 0 24 24'
                      id='check'
                      data-name='Line Color'
                      xmlns='http://www.w3.org/2000/svg'
                      className='icon line-color'
                    >
                      <polyline
                        id='primary'
                        points='5 12 10 17 19 8'
                        style={{
                          fill: 'none',
                          stroke: 'currentColor',
                          strokeLinecap: 'round',
                          strokeLinejoin: 'round',
                          strokeWidth: 2,
                        }}
                      />
                    </svg>
                    <span>Useful</span>
                  </div>
                </Chip>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <span
                className='text-sm text-gray-500'
                title={formatDate(comment.Created_At).fullDate}
              >
                {formatDate(comment.Created_At).timeAgo}
              </span>
              {isCommentOwner && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant='light'
                      isIconOnly
                      className='dropdown-trigger'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <circle cx='12' cy='12' r='1' />
                        <circle cx='12' cy='5' r='1' />
                        <circle cx='12' cy='19' r='1' />
                      </svg>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key='edit'
                      className='text-blue-600'
                      onPress={() => setIsEditing(true)}
                    >
                      Edit comment
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-red-600'
                      onPress={handleDeleteComment}
                    >
                      Delete comment
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className='mt-2'>
              <TextEditor
                getContext={setEditedContent}
                initialContent={comment.Content}
                size='20vh'
              />
              <div className='mt-2 flex justify-end gap-2'>
                <Button variant='light' onPress={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button color='primary' onPress={handleEditComment}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div
              className='mt-2 text-gray-600'
              dangerouslySetInnerHTML={{ __html: comment.Content }}
            />
          )}
          <div className='mt-3 flex items-center gap-4'>
            {/* Show Reply button to everyone */}
            <button
              className='flex content-center gap-1 text-sm text-gray-500 hover:text-blue-600'
              onClick={() => {
                if (checkAuthAndRedirect()) {
                  setShowReply(true);
                }
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
              </svg>
              Reply
            </button>

            {/* Show Useful button only to post owner and if not already marked as helpful */}
            {isPostOwner && !isHelpful && (
              <button
                className='flex content-center gap-1 text-sm text-gray-500 hover:text-green-600'
                onClick={() => handleUseful(comment)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
                </svg>
                Useful
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Display replies */}
      {replies.length > 0 && (
        <div className='mt-4 space-y-4'>
          {replies.map((reply, index) => (
            <div
              key={reply.Reply_ID || `reply-${index}`}
              className='ml-8 border-l-2 border-gray-100 pl-4'
            >
              <div className='flex items-start gap-4'>
                <UserAvatar
                  accountId={reply.Account_ID}
                  username={reply.Username}
                  size='sm'
                  className='h-6 w-6'
                />
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium text-gray-900'>
                      {reply.Username}
                    </h4>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-500'>
                        {formatDate(reply.Created_At).timeAgo}
                      </span>
                      {String(reply.Account_ID) ===
                        String(
                          GetTokenData(
                            localStorage.getItem('token'),
                            'accountID'
                          )
                        ) &&
                        GetTokenData(localStorage.getItem('token'), 'role') ===
                          '0' && (
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                variant='light'
                                isIconOnly
                                className='dropdown-trigger'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='24'
                                  height='24'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                >
                                  <circle cx='12' cy='12' r='1' />
                                  <circle cx='12' cy='5' r='1' />
                                  <circle cx='12' cy='19' r='1' />
                                </svg>
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                              <DropdownItem
                                key='edit'
                                className='text-blue-600'
                                onPress={() => {
                                  setEditingReplyId(reply.Reply_ID);
                                  setEditedReplyContent(reply.Content);
                                }}
                              >
                                Edit reply
                              </DropdownItem>
                              <DropdownItem
                                key='delete'
                                className='text-red-600'
                                onPress={() =>
                                  handleDeleteReply(reply.Reply_ID)
                                }
                              >
                                Delete reply
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                    </div>
                  </div>
                  {editingReplyId === reply.Reply_ID ? (
                    <div className='mt-2'>
                      <TextEditor
                        initialContent={reply.Content}
                        getContext={setEditedReplyContent}
                        size='20vh'
                      />
                      <div className='mt-2 flex justify-end gap-2'>
                        <Button
                          variant='light'
                          onPress={() => setEditingReplyId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          color='primary'
                          onPress={() =>
                            handleEditReply(reply.Reply_ID, editedReplyContent)
                          }
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className='mt-2 text-gray-600'
                      dangerouslySetInnerHTML={{ __html: reply.Content }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form Modal */}
      <ReplyForm
        isOpen={showReply}
        onClose={() => setShowReply(false)}
        commentId={comment.Comment_ID}
        onReplyCreated={handleReplySubmitted}
      />
    </div>
  );
};

// CreatePostForm component
const CreatePostForm = ({ isOpen, onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle('');
    setContent('');
    setError(null);
  }, [isOpen]);

  const handleContent = (value) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    try {
      if (!checkAuthAndRedirect()) return;

      setIsSubmitting(true);
      setError(null);

      if (!title.trim()) {
        setError('Please enter a post title');
        return;
      }

      if (!content.trim()) {
        setError('Please enter post content');
        return;
      }

      const postData = {
        title,
        content,
      };

      const result = await CreatePost(postData);

      if (result.success) {
        onPostCreated();
        setTitle('');
        setContent('');
      } else {
        setError(result.error || 'Failed to create post');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while creating the post');
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='2xl' hideCloseButton>
      <ModalContent>
        <ModalHeader className='w-full justify-center'>
          Create a new post
        </ModalHeader>
        <ModalBody>
          <div className='flex flex-col gap-2'>
            {error && (
              <div className='mb-2 rounded-lg bg-red-50 p-3 text-red-600'>
                {error}
              </div>
            )}
            <Input
              label='Title'
              placeholder='Enter post title'
              labelPlacement='outside'
              radius='sm'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div>
              <TextEditor getContext={handleContent} size='40vh' />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='light' onPress={onClose}>
            Cancel
          </Button>
          <Button
            variant='solid'
            onPress={handleSubmit}
            isLoading={isSubmitting}
            color='primary'
          >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// CommentForm component
const CommentForm = ({ isOpen, onClose, postId, onCommentCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleContent = (value) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        return;
      }

      if (!content.trim()) {
        setError('Please enter comment content');
        return;
      }

      const commentData = {
        postId: postId,
        content: content,
      };

      const result = await CreateComment(commentData);

      if (result.success) {
        const updatedPost = await GetPostById(postId);
        if (updatedPost.success) {
          onCommentCreated(updatedPost.data);
          setContent('');
          onClose();
        }
      } else {
        if (result.error === 'Please login to comment') {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          return;
        }
        setError(result.error || 'Failed to create comment');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while creating the comment');
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='2xl' hideCloseButton>
      <ModalContent>
        <ModalHeader className='w-full justify-center'>
          Add a comment
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className='mb-4 rounded-lg bg-red-50 p-3 text-red-600'>
              {error}
            </div>
          )}
          <div>
            <TextEditor getContext={handleContent} size='40vh' />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='light' onPress={onClose}>
            Cancel
          </Button>
          <Button
            variant='solid'
            color='primary'
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            Submit Comment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Add this component before the Community component
const ReplyForm = ({ isOpen, onClose, commentId, onReplyCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleContent = (value) => {
    setContent(value);
  };

  // Update the handleSubmit function in ReplyForm
  const handleSubmit = async () => {
    try {
      if (!checkAuthAndRedirect()) return;

      setIsSubmitting(true);
      setError(null);

      if (!content.trim()) {
        setError('Please enter reply content');
        return;
      }

      const replyData = {
        commentId: commentId,
        content: content,
      };

      const result = await CreateReply(replyData);

      if (result.success) {
        onReplyCreated();
        setContent('');
        onClose();
      } else {
        setError(result.error || 'Failed to create reply');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while creating the reply');
      console.error('Error creating reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='2xl' hideCloseButton>
      <ModalContent>
        <ModalHeader className='w-full justify-center'>Add a reply</ModalHeader>
        <ModalBody>
          {error && (
            <div className='mb-4 rounded-lg bg-red-50 p-3 text-red-600'>
              {error}
            </div>
          )}
          <div>
            <TextEditor getContext={handleContent} size='40vh' />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='light' onPress={onClose}>
            Cancel
          </Button>
          <Button
            variant='solid'
            color='primary'
            onPress={handleSubmit}
            isLoading={isSubmitting}
          >
            Submit Reply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const checkAuthAndRedirect = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    return false;
  }
  return true;
};

// Main Community component
export default function Community() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [handleMyposts, setHandleMyposts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editPostData, setEditPostData] = useState(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await GetAllPosts();
      if (result.success) {
        setPosts(result.data);
      } else {
        setError(result.error || 'Failed to fetch posts');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = async (post) => {
    try {
      setIsLoading(true);
      const result = await GetPostById(post.Post_ID);
      if (result.success) {
        const postData = {
          ...result.data,
          Image: result.data.Image || null,
        };
        setSelectedPost(postData);
      } else {
        setError(result.error || 'Failed to fetch post details');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching post details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentCreated = async () => {
    try {
      const result = await GetPostById(selectedPost.Post_ID);
      if (result.success) {
        setSelectedPost(result.data);
        await fetchPosts(); // Refresh the posts list
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error.message);
    } finally {
      setShowComment(false);
    }
  };

  // Inside the Community component, add these handlers
  const handleEditPost = (post) => {
    setEditPostData(post);
    setShowEditPostModal(true);
  };

  const handleDeletePost = async (post) => {
    // console.log('Delete post:', post);
    try {
      const result = await DeletePost(post.Post_ID);
      if (result.success) {
        await fetchPosts();
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className='min-h-[calc(100vh-64px)]'>
      <div className='PaddingXSet'>
        <div className='flex w-full gap-6 pt-4'>
          {/* Only show sidebar when no post is selected */}
          {!selectedPost && (
            <div className='w-2/12 shrink-0 pt-1'>
              <div className='h-auto rounded-lg border border-gray-200 bg-white p-4 shadow'>
                <nav className='flex flex-col gap-2'>
                  <Input
                    type='text'
                    placeholder='Search posts...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-gray-400'
                      >
                        <circle cx='11' cy='11' r='8' />
                        <line x1='21' y1='21' x2='16.65' y2='16.65' />
                      </svg>
                    }
                    className='mb-4'
                  />
                  <Button
                    variant={handleMyposts ? 'secondary' : 'solid'}
                    color={handleMyposts ? 'default' : 'primary'}
                    className='w-full'
                    onPress={() => {
                      setHandleMyposts(false);
                      setSelectedPost(null);
                    }}
                  >
                    Community posts
                  </Button>
                  <Button
                    variant={handleMyposts ? 'solid' : 'secondary'}
                    color={handleMyposts ? 'primary' : 'default'}
                    className='w-full'
                    onPress={() => {
                      setHandleMyposts(true);
                      setSelectedPost(null);
                    }}
                  >
                    My posts
                  </Button>
                  <Button
                    variant='ghost'
                    color='primary'
                    onPress={() => {
                      if (checkAuthAndRedirect()) {
                        setShowCreatePost(true);
                      }
                    }}
                    className='mt-4 w-full'
                  >
                    + Create new Post
                  </Button>
                </nav>
              </div>
            </div>
          )}
          {/* Main content - adjust width based on selectedPost */}
          <ScrollShadow
            hideScrollBar
            orientation
            className={`rg:pr-20 flex max-h-[calc(100vh-100px)] flex-col px-2 pb-4 pt-1 sm:pr-10 md:pr-20 ${
              selectedPost ? 'w-full' : 'w-10/12'
            }`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center py-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
              </div>
            ) : error ? (
              <div className='rounded-lg bg-red-50 p-4 text-red-600'>
                {error}
              </div>
            ) : selectedPost ? (
              <PostDetail
                post={selectedPost}
                onBack={() => setSelectedPost(null)}
                onCommentClick={() => setShowComment(true)}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ) : (
              <div className='space-y-4'>
                {posts
                  .filter((post) => {
                    // First apply My Posts filter if active
                    if (handleMyposts) {
                      const userAccountId = GetTokenData(
                        localStorage.getItem('token'),
                        'accountID'
                      );
                      if (String(post.Account_ID) !== String(userAccountId)) {
                        return false;
                      }
                    }

                    // Then apply search filter if there's a search query
                    if (searchQuery.trim()) {
                      const query = searchQuery.toLowerCase();
                      return (
                        post.Title.toLowerCase().includes(query) ||
                        post.Content.toLowerCase().includes(query) ||
                        post.Username.toLowerCase().includes(query)
                      );
                    }

                    return true;
                  })
                  .sort(
                    (a, b) => new Date(b.Created_At) - new Date(a.Created_At)
                  )
                  .map((post) => (
                    <PostListItem
                      key={`${post.Post_ID}-${post.Created_At}`}
                      post={post}
                      onClick={() => handlePostClick(post)}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                {posts.filter((post) => {
                  if (handleMyposts) {
                    return (
                      String(post.Account_ID) ===
                        String(
                          GetTokenData(
                            localStorage.getItem('token'),
                            'accountID'
                          )
                        ) ||
                      GetTokenData(localStorage.getItem('token'), 'role') ===
                        '0'
                    );
                  }
                  if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    return (
                      post.Title.toLowerCase().includes(query) ||
                      post.Content.toLowerCase().includes(query) ||
                      post.Username.toLowerCase().includes(query)
                    );
                  }
                  return true;
                }).length === 0 && (
                  <div className='py-8 text-center text-gray-500'>
                    {handleMyposts
                      ? "You haven't created any posts yet"
                      : searchQuery.trim()
                        ? 'No posts found matching your search'
                        : 'No posts available'}
                  </div>
                )}
              </div>
            )}
          </ScrollShadow>
        </div>
        {/* Modals */}
        <CreatePostForm
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false);
            fetchPosts();
          }}
        />
        {selectedPost && (
          <CommentForm
            isOpen={showComment}
            onClose={() => setShowComment(false)}
            postId={selectedPost.Post_ID}
            onCommentCreated={handleCommentCreated}
          />
        )}
        <EditPostForm
          isOpen={showEditPostModal}
          onClose={() => setShowEditPostModal(false)}
          post={editPostData}
          onPostEdited={async () => {
            setShowEditPostModal(false);
            await fetchPosts();
            if (selectedPost) {
              const updatedPost = await GetPostById(selectedPost.Post_ID);
              if (updatedPost.success) {
                setSelectedPost(updatedPost.data);
              }
            }
          }}
        />
      </div>
    </div>
  );
}

// Add a new EditPostForm component
const EditPostForm = ({ isOpen, onClose, post, onPostEdited }) => {
  const [title, setTitle] = useState(post?.Title || '');
  const [content, setContent] = useState(post?.Content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (post) {
      setTitle(post.Title);
      setContent(post.Content);
    }
  }, [post]);

  const handleContent = (value) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!title.trim()) {
        setError('Please enter a post title');
        return;
      }

      if (!content.trim()) {
        setError('Please enter post content');
        return;
      }

      const result = await handleEditContent({
        postId: post.Post_ID,
        title: title, // Pass the title
        content: content,
      });

      if (result.success) {
        onPostEdited();
        onClose();
      } else {
        setError(result.error || 'Failed to update post');
      }
    } catch (error) {
      setError(error.message || 'An error occurred while updating the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='2xl' hideCloseButton>
      <ModalContent>
        <ModalHeader className='w-full justify-center'>Edit post</ModalHeader>
        <ModalBody>
          <div className='flex flex-col gap-2'>
            {error && (
              <div className='mb-2 rounded-lg bg-red-50 p-3 text-red-600'>
                {error}
              </div>
            )}
            <Input
              label='Title'
              placeholder='Enter post title'
              labelPlacement='outside'
              radius='sm'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div>
              <TextEditor
                getContext={handleContent}
                initialContent={content}
                size='40vh'
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='light' onPress={onClose}>
            Cancel
          </Button>
          <Button
            variant='solid'
            onPress={handleSubmit}
            isLoading={isSubmitting}
            color='primary'
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
