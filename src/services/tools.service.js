import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}tools`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}tools`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}tools/published`);
};

const get = (id) => {
  return api.get(`${API_URL}tools/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}tools/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}tools/${id}`);
};

const download = () => {
  return api.get(`${API_URL}tools/download`);
};

const getByCode = (code) => {
  return api.get(`${API_URL}tools/code/${code}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
  download,
  getByCode,
};
