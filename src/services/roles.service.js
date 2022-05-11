import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}role`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}role`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}role/published`);
};

const get = (id) => {
  return api.get(`${API_URL}role/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}role/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}role/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
};
