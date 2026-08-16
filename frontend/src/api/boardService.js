import axiosClient from './axiosClient';

export const getBoards = () => axiosClient.get('/boards');
export const getBoardById = (id) => axiosClient.get(`/boards/${id}`);
export const createBoard = (data) => axiosClient.post('/boards', data);
export const updateBoard = (id, data) => axiosClient.put(`/boards/${id}`, data);
export const deleteBoard = (id) => axiosClient.delete(`/boards/${id}`);