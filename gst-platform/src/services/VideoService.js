import api from './api';

export const fetchVideos = () => api.get('/learning/videos');
export const addVideo = (youtube_url) => api.post('/learning/videos', { youtube_url });
export const updateVideo = (id, youtube_url) => api.put(`/learning/videos/${id}`, { youtube_url });
export const deleteVideo = (id) => api.delete(`/learning/videos/${id}`);
