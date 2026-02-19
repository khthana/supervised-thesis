interface ArticleForm {
  TOPIC: string;
  DISEASES_TYPE_IDS: string;
  BODY: string;
  file: File | null;
}

export const createArticle = async (formData: ArticleForm) => {
  try {

    const data = new FormData();
    data.append('TOPIC', formData.TOPIC);
    data.append('DISEASES_TYPE_IDS', formData.DISEASES_TYPE_IDS);
    data.append('BODY', formData.BODY);
    if (formData.file) {
      data.append('file', formData.file);
    }

    const response = await fetch('http://localhost:3001/article', {
      method: 'POST',
      body: data,
      
      credentials: 'same-origin', 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create article: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};
