import { API_BASE_URL, UPLOADS_URL } from '@/config/api';

const handleTokenExpiration = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000;
    if (Date.now() >= expiryTime) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
};

const handleApiError = (error, functionName) => {
  console.error(`Error in ${functionName}:`, error);
  return {
    success: false,
    error: error.message || `Error occurred in ${functionName}`,
  };
};

// Create a post
const CreatePost = async (post) => {
  // console.log('CreatePost:', post);
  try {
    if (!(await handleTokenExpiration())) {
      return { success: false, error: 'Token expired' };
    }

    // Process content to handle base64 images
    let processedContent = post.content;
    const base64Regex = /<img[^>]+src="data:image\/[^"]+"[^>]*>/g;
    let imgTags = processedContent.match(base64Regex);

    // Create FormData instance
    const formData = new FormData();
    formData.append('title', post.title);

    // Handle base64 images from content
    if (imgTags) {
      // Convert base64 images to blobs and update content
      await Promise.all(
        imgTags.map(async (tag, index) => {
          const base64String = tag.match(/src="(data:image\/[^"]+)"/)[1];
          const base64Data = base64String.replace(
            /^data:image\/\w+;base64,/,
            ''
          );
          const byteCharacters = atob(base64Data);
          const byteArray = new Uint8Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }

          const blob = new Blob([byteArray], { type: 'image/png' });
          const fileName = `${Date.now()}-inline-image-${index}.png`;
          // Change from 'inlineImages' to 'images'
          formData.append('images', blob, fileName);

          // Replace entire img tag with new one
          processedContent = processedContent.replace(
            tag,
            `<img src="${UPLOADS_URL}/posts/${fileName}" alt="Inline image" style="max-width: 25%;"/>`
          );
        })
      );
    }

    // Add any additional uploaded files
    if (post.images && post.images.length > 0) {
      post.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Add the processed content
    formData.append('content', processedContent);

    const response = await fetch(`${API_BASE_URL}/api/community/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (response.status === 403) {
      await handleTokenExpiration();
      return { success: false, error: 'Please login again' };
    }

    if (response.status === 500) {
      return {
        success: false,
        error: 'Server error occurred. Please try again later.',
      };
    }

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleApiError(error, 'CreatePost');
  }
};

const handlePostCreation = async (post) => {
  const result = await CreatePost(post);
  if (result.success) {
    return result;
  } else if (result.error === 'Token expired') {
    alert('Your session has expired. Please login again.');
  }
  return result;
};

// Get all posts
const GetAllPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/community/all`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { success: true, data: await response.json() };
  } catch (error) {
    return handleApiError(error, 'GetAllPosts');
  }
};

// Get post by ID
const GetPostById = async (postId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/community/post/${postId}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { success: true, data: await response.json() };
  } catch (error) {
    return handleApiError(error, 'GetPostById');
  }
};

// Create a comment
const CreateComment = async (comment) => {
  // console.log('CreateComment:', comment);
  try {
    const token = localStorage.getItem('token');

    // Check if user is logged in
    if (!token) {
      return { success: false, error: 'Please login to comment' };
    }

    // Check token expiration
    const isTokenValid = await handleTokenExpiration();
    if (!isTokenValid) {
      localStorage.removeItem('token');
      return { success: false, error: 'Please login to comment' };
    }

    // Process content to handle base64 images
    let processedContent = comment.content;
    const base64Regex = /<img[^>]+src="data:image\/[^"]+"[^>]*>/g;
    let imgTags = processedContent.match(base64Regex);

    // Create FormData instance
    const formData = new FormData();
    formData.append('postId', comment.postId);

    // Handle base64 images from content
    if (imgTags) {
      await Promise.all(
        imgTags.map(async (tag, index) => {
          const base64String = tag.match(/src="(data:image\/[^"]+)"/)[1];
          const base64Data = base64String.replace(
            /^data:image\/\w+;base64,/,
            ''
          );
          const byteCharacters = atob(base64Data);
          const byteArray = new Uint8Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }

          const blob = new Blob([byteArray], { type: 'image/png' });
          const fileName = `${Date.now()}-comment-image-${index}.png`;
          formData.append('images', blob, fileName);

          // Replace entire img tag with new one
          processedContent = processedContent.replace(
            tag,
            `<img src="${UPLOADS_URL}/comments/${fileName}" alt="Comment image" style="max-width: 25%;"/>`
          );
        })
      );
    }

    // Add any additional uploaded files
    if (comment.images && comment.images.length > 0) {
      comment.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Add the processed content
    formData.append('content', processedContent);

    const response = await fetch(`${API_BASE_URL}/api/community/comment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      return { success: false, error: 'Please login to comment' };
    }

    if (response.status === 500) {
      return {
        success: false,
        error: 'Server error occurred. Please try again later.',
      };
    }

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleApiError(error, 'CreateComment');
  }
};

// Mark comment as helpful
const MarkCommentHelpful = async (commentId) => {
  // console.log('MarkCommentHelpful:', commentId);
  try {
    if (!(await handleTokenExpiration())) {
      return { success: false, error: 'Token expired' };
    }

    const response = await fetch(
      `${API_BASE_URL}/api/community/comment/${commentId}/helpful`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isHelpful: true }),
      }
    );

    if (response.status === 403) {
      await handleTokenExpiration();
      return { success: false, error: 'Please login again' };
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { success: true, data: await response.json() };
  } catch (error) {
    return handleApiError(error, 'MarkCommentHelpful');
  }
};

// Create a reply
const CreateReply = async (reply) => {
  // console.log('CreateReply:', reply);
  try {
    const token = localStorage.getItem('token');

    // Check if user is logged in
    if (!token) {
      return { success: false, error: 'Please login to reply' };
    }

    // Check token expiration
    if (!(await handleTokenExpiration())) {
      localStorage.removeItem('token');
      return { success: false, error: 'Please login to reply' };
    }

    // Process content to handle base64 images
    let processedContent = reply.content;
    const base64Regex = /<img[^>]+src="data:image\/[^"]+"[^>]*>/g;
    let imgTags = processedContent.match(base64Regex);

    // Create FormData instance
    const formData = new FormData();
    formData.append('commentId', reply.commentId);
    if (reply.parentReplyId) {
      formData.append('parentReplyId', reply.parentReplyId);
    }

    // Handle base64 images from content
    if (imgTags) {
      await Promise.all(
        imgTags.map(async (tag, index) => {
          const base64String = tag.match(/src="(data:image\/[^"]+)"/)[1];
          const base64Data = base64String.replace(
            /^data:image\/\w+;base64,/,
            ''
          );
          const byteCharacters = atob(base64Data);
          const byteArray = new Uint8Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }

          const blob = new Blob([byteArray], { type: 'image/png' });
          const fileName = `${Date.now()}-reply-image-${index}.png`;
          formData.append('images', blob, fileName);

          // Replace entire img tag with new one
          processedContent = processedContent.replace(
            tag,
            `<img src="${UPLOADS_URL}/replies/${fileName}" alt="Reply image" style="max-width: 25%;"/>`
          );
        })
      );
    }

    // Add any additional uploaded files
    if (reply.images && reply.images.length > 0) {
      reply.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Add the processed content
    formData.append('content', processedContent);

    const response = await fetch(`${API_BASE_URL}/api/community/reply`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      return { success: false, error: 'Please login to reply' };
    }

    if (response.status === 500) {
      return {
        success: false,
        error: 'Server error occurred. Please try again later.',
      };
    }

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleApiError(error, 'CreateReply');
  }
};

// Get replies by comment ID
const GetRepliesByComment = async (commentId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/community/reply/${commentId}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { success: true, data: await response.json() };
  } catch (error) {
    return handleApiError(error, 'GetRepliesByComment');
  }
};

// Get nested replies
const GetNestedReplies = async (parentReplyId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/community/reply/nested/${parentReplyId}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { success: true, data: await response.json() };
  } catch (error) {
    return handleApiError(error, 'GetNestedReplies');
  }
};

const getAvatar = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

const DeletePost = async (postId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/community/post/${postId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.status === 403) {
      await handleTokenExpiration();
      return { success: false, error: 'Please login again' };
    }

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return handleApiError(error, 'DeletePost');
  }
};

const DeleteComment = async (commentId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/community/comment/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.status === 403) {
      await handleTokenExpiration();
      return { success: false, error: 'Please login again' };
    }

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return handleApiError(error, 'DeleteComment');
  }
};

const DeleteReply = async (replyId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/community/reply/${replyId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.status === 403) {
      await handleTokenExpiration();
      return { success: false, error: 'Please login again' };
    }

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return handleApiError(error, 'DeleteReply');
  }
};

const handleEditContent = async ({
  postId,
  commentId,
  replyId,
  content,
  title,
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Please login to edit' };
    }

    // Check token expiration
    if (!(await handleTokenExpiration())) {
      return { success: false, error: 'Token expired' };
    }

    // Process content to handle base64 images
    let processedContent = content;
    const base64Regex = /<img[^>]+src="data:image\/[^"]+"[^>]*>/g;
    let imgTags = processedContent.match(base64Regex);

    let endpoint = '';
    const formData = new FormData();

    // Set appropriate endpoint and folder path based on content type
    let uploadFolder = '';
    if (postId) {
      endpoint = `${API_BASE_URL}/api/community/post/${postId}`;
      formData.append('postId', postId);
      formData.append('title', title); // Add title for posts
      uploadFolder = 'posts';
    } else if (commentId) {
      endpoint = `${API_BASE_URL}/api/community/comment/${commentId}`;
      formData.append('commentId', commentId);
      uploadFolder = 'comments';
    } else if (replyId) {
      endpoint = `${API_BASE_URL}/api/community/reply/${replyId}`;
      formData.append('replyId', replyId);
      uploadFolder = 'replies';
    } else {
      throw new Error('Invalid edit request');
    }

    // Handle base64 images from content
    if (imgTags) {
      await Promise.all(
        imgTags.map(async (tag, index) => {
          const base64String = tag.match(/src="(data:image\/[^"]+)"/)[1];
          const base64Data = base64String.replace(
            /^data:image\/\w+;base64,/,
            ''
          );
          const byteCharacters = atob(base64Data);
          const byteArray = new Uint8Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }

          const blob = new Blob([byteArray], { type: 'image/png' });
          const fileName = `${Date.now()}-${uploadFolder}-image-${index}.png`;
          formData.append('images', blob, fileName);

          // Replace entire img tag with new one
          processedContent = processedContent.replace(
            tag,
            `<img src="${UPLOADS_URL}/${uploadFolder}/${fileName}" alt="${uploadFolder} image" style="max-width: 25%;" />`
          );
        })
      );
    }

    // Add the processed content to FormData
    formData.append('content', processedContent);

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return { success: false, error: 'Token expired' };
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update content');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error in handleEditContent:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while editing content',
    };
  }
};

export {
  CreatePost,
  GetAllPosts,
  GetPostById,
  CreateComment,
  MarkCommentHelpful,
  CreateReply,
  GetRepliesByComment,
  GetNestedReplies,
  handlePostCreation,
  getAvatar,
  DeletePost,
  DeleteComment,
  DeleteReply,
  handleEditContent,
};
