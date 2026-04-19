import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Document {
  id: string;
  name: string;
  chunks: number;
}

export const DocumentAPI = {
  list: async (): Promise<Document[]> => {
    console.log('[API] Fetching document list...');
    const response = await apiClient.get('/documents');
    console.log('[API] Fetched document list successfully:', response.data);
    return response.data.documents;
  },

  upload: async (file: File) => {
    console.log(`[API] Uploading file: ${file.name} (${file.size} bytes)...`);
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('[API] File uploaded and embedded successfully:', response.data);
    return response.data;
  },

  delete: async (id: string) => {
    console.log(`[API] Deleting document ID: ${id}...`);
    const response = await apiClient.delete(`/documents/${id}`);
    console.log(`[API] Document deleted:`, response.data);
    return response.data;
  }
};
