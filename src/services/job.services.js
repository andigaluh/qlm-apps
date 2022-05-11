import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}job`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}job`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}job/published`);
};

const get = (id) => {
  return api.get(`${API_URL}job/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}job/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}job/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
};
