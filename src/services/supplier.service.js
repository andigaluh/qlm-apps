import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}supplier`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}supplier`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}supplier/published`);
};

const get = (id) => {
  return api.get(`${API_URL}supplier/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}supplier/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}supplier/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
};
