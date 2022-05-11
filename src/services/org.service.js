import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}org`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}org`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}org/published`);
};

const get = (id) => {
  return api.get(`${API_URL}org/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}org/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}org/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
};
