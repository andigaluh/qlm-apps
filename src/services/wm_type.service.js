import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}wm_type`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}wm_type`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}wm_type/published`);
};

const get = (id) => {
  return api.get(`${API_URL}wm_type/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}wm_type/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}wm_type/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
};
