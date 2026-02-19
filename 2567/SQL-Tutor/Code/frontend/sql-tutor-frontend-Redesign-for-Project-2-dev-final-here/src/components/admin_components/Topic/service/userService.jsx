import { API_BASE_URL, UPLOADS_URL } from '@/config/api';

const CreateContents = async (contents, subtopicData, cmd) => {
  // console.log('CreateContent', contents, subtopicData, cmd[0]);
  let updateHtml = await SaveImage(
    contents,
    subtopicData?.Contents?.[0]?.Content_id
  );
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/course/Contents/${subtopicData?.Contents?.[0]?.Content_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Content_info: updateHtml,
          Content_type: subtopicData.Type,
          Query_type: cmd[0],
        }),
      }
    );
    const data = await response.json();
    // console.log('✅ สร้างคอสสำเร็จ:', data);
  } catch (error) {
    throw error;
  }
};

const SaveImage = async (htmlContent, contentId) => {
  // Match only base64 image tags
  const base64Regex = /<img\s+src="data:image\/[^"]+"/g;
  let imgTags = htmlContent.match(base64Regex);

  // If no base64 images found, return original content
  if (!imgTags) return htmlContent;

  let formData = new FormData();

  try {
    // Convert base64 images to blobs
    let imageBlobs = await Promise.all(
      imgTags.map(async (tag, index) => {
        const base64String = tag.match(/src="(data:image\/[^"]+)"/)[1];
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteArray = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([byteArray], { type: 'image/png' });
        return { tag, blob, filename: `image_${Date.now()}_${index}.png` };
      })
    );

    // Add all files to FormData
    imageBlobs.forEach(({ blob, filename }) => {
      formData.append('images', blob, filename);
    });

    if (!contentId) {
      throw new Error('Content ID is required for image upload');
    }

    const response = await fetch(
      `${API_BASE_URL}/api/course/contents/${contentId}/images`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Image upload failed');
    }

    const data = await response.json();
    // console.log('Server response:', data);

    if (!data.content) {
      throw new Error('Server response missing content data');
    }

    // Parse the Content_img properly
    let uploadedImages;
    if (typeof data.content.Content_img === 'string') {
      try {
        // If it's a JSON string, parse it
        uploadedImages = JSON.parse(data.content.Content_img);
      } catch (e) {
        // If it's a single filename, wrap it in an array
        uploadedImages = [data.content.Content_img];
      }
    } else if (Array.isArray(data.content.Content_img)) {
      uploadedImages = data.content.Content_img;
    } else {
      uploadedImages = [data.content.Content_img];
    }

    // Ensure we have a flat array of strings
    uploadedImages = uploadedImages
      .map((img) => {
        if (typeof img === 'string') {
          // Remove any extra quotes and brackets
          return img.replace(/[\[\]"]/g, '');
        }
        return img;
      })
      .filter(Boolean);

    if (uploadedImages.length === 0) {
      throw new Error('No image paths returned from server');
    }

    // Replace base64 images with uploaded image URLs
    let updatedContent = htmlContent;
    imgTags.forEach((tag, index) => {
      if (uploadedImages[index]) {
        const newImageTag = `<img src="${UPLOADS_URL}/${uploadedImages[index]}" alt="uploaded content"`;
        updatedContent = updatedContent.replace(tag, newImageTag);
      }
    });

    return updatedContent;
  } catch (error) {
    console.error('Error in SaveImage:', error);
    throw new Error('❌ ไม่สามารถอัปโหลดรูปภาพได้: ' + error.message);
  }
};

const GetSubTopic = async (SubtopicId) => {
  if (!SubtopicId) return;
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/course/subtopics/${SubtopicId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const GetContents = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/course/contents/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const executecode = async (cmd) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/course/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: cmd,
      }),
      cache: 'no-cache',
    });
  } catch (error) {
    throw error;
  }
};

const resetDB = async ({ userId }) => {
  // console.log('userId', userId);
  try {
    const response = await fetch(`${API_BASE_URL}/api/course/user/reset-db`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      }),
      cache: 'no-cache',
    });
  } catch (error) {
    // console.log('Error resetDB:', error);
    null;
  }
};

export {
  CreateContents,
  GetSubTopic,
  GetContents,
  SaveImage,
  executecode,
  resetDB,
};
