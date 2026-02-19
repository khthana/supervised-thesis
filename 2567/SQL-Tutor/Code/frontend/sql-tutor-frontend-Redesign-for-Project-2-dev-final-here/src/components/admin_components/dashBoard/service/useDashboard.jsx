import { API_BASE_URL } from '@/config/api';

const updatestatus = async (id, topicName, status) => {
  try {
    await fetch(`${API_BASE_URL}/api/course/topics/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        M_topic_title: topicName,
        status: status,
      }),
    });
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

const GettopicProgress = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/course/topics-progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

const GetAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

export { updatestatus, GettopicProgress, GetAllUsers };
