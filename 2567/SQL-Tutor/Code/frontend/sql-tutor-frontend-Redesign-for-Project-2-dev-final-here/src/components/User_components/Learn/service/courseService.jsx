import { API_BASE_URL } from '@/config/api';
import GetTokenData from '@/components/GetTokenData';

const fetchTopics = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/course/topics-with-progress`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Permission: GetTokenData(localStorage.getItem('token'), 'role'),
          userId: GetTokenData(localStorage.getItem('token'), 'accountID'),
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};

const fetchContent = async (content_id) => {
  try {
    if (!content_id) return;
    const response = await fetch(
      `${API_BASE_URL}/api/course/contents/${content_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Permission: GetTokenData(localStorage.getItem('token'), 'role'),
          userId: GetTokenData(localStorage.getItem('token'), 'accountID'),
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subtopics:', error);
  }
};

const updateProgress = async (content_id, state) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/course/progress/${content_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: GetTokenData(localStorage.getItem('token'), 'accountID'),
          newState: state,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

export { fetchTopics, fetchContent, updateProgress };
