import axiosClient from './axiosClient';

export const getTasksByBoard = (boardId) => axiosClient.get(`/tasks?board=${boardId}`);
export const createTask = (data) => axiosClient.post('/tasks', data);
export const updateTask = (id, data) => axiosClient.put(`/tasks/${id}`, data);
export const deleteTask = (id) => axiosClient.delete(`/tasks/${id}`);