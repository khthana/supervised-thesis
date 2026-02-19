import { API_BASE_URL } from '@/config/api';
import GetTokenData from '@/components/GetTokenData';

const getMainTopics = async () => {
  try {
    const role = GetTokenData(localStorage.getItem('token'), 'role') ?? '';

    const response = await fetch(`${API_BASE_URL}/api/course/topics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Permission: role,
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error ${response.status}: ${errorText}`);
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (err) {
    console.error('Error fetching topics:', err);
    return null;
  }
};

const createMainTopic = async ({ newMainTopicName }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/course/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ M_topic_title: newMainTopicName, status: 0 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (
        response.status === 400 &&
        errorData.message === 'Main topic already exists'
      ) {
        return { error: 'Main topic already exists' };
      }
      throw new Error(
        `Server Error ${response.status}: ${errorData.message || 'Unknown error'}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating topic:', error);
    return { error: error.message };
  }
};

const createSubTopic = async ({ newSubTopicName, mainTopicId, topicType }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/course/topics/${mainTopicId}/subtopics`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          M_topic_id: mainTopicId,
          S_topic_title: newSubTopicName,
          Type: topicType,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (
        response.status === 400 &&
        errorData.message === 'Subtopic already exists'
      ) {
        return { error: 'Subtopic already exists' };
      }
      throw new Error(
        `Server Error ${response.status}: ${errorData.message || 'Unknown error'}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating subtopic:', error);
    return { error: error.message };
  }
};

const renameMaintopic = async ({ rename_main, mainTopicId, status }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/course/topics/${mainTopicId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ M_topic_title: rename_main, status: status }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      if (
        response.status === 400 &&
        errorData.message === 'Main topic already exists'
      ) {
        return { error: 'Main topic already exists' };
      }
      throw new Error(`Server Error ${response.status}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error updating topic:', error);
    return { error: error.message };
  }
};

const renameSubtopic = async ({ rename_sub, subTopicId, mainTopicId }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/course/subtopics/${subTopicId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          M_topic_id: mainTopicId,
          S_topic_title: rename_sub,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      if (
        response.status === 400 &&
        errorData.message === 'Subtopic already exists'
      ) {
        return { error: 'Subtopic already exists' };
      }
      throw new Error(`Server Error ${response.status}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error updating topic:', error);
    return { error: error.message };
  }
};

const deleteMainTopic = async ({ mainTopicId }) => {
  try {
    await fetch(`${API_BASE_URL}/api/course/topics/${mainTopicId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting topic:', error);
    return { error: error.message };
  }
};

const deleteSubTopic = async ({ subTopicId }) => {
  try {
    await fetch(`${API_BASE_URL}/api/course/subtopics/${subTopicId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting subtopic:', error);
    return { error: error.message };
  }
};

const updateSubtopicOrder = async ({
  mainTopicId,
  subtopicId,
  sourceIndex,
  destinationIndex,
}) => {
  // console.log(
  //   'updateSubtopicOrder',
  //   mainTopicId,
  //   subtopicId,
  //   sourceIndex,
  //   destinationIndex
  // );
  try {
    await fetch(`${API_BASE_URL}/api/course/subtopic/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Account_id: a,
        mainTopicId: mainTopicId,
        subtopicId: subtopicId,
        sourceOrder: sourceIndex,
        destinationOrder: destinationIndex,
      }),
    });
  } catch (error) {
    console.error('Error updateSubtopicOrder:', error);
    return { error: error.message };
  }
};

export {
  createMainTopic,
  getMainTopics,
  deleteMainTopic,
  deleteSubTopic,
  createSubTopic,
  renameMaintopic,
  renameSubtopic,
  updateSubtopicOrder,
};
