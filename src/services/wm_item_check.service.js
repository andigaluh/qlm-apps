import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}wm_item_check`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}wm_item_check`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}wm_item_check/published`);
};

const get = (id) => {
  return api.get(`${API_URL}wm_item_check/${id}`);
};

const getByCategory = (id) => {
  return api.get(`${API_URL}wm_item_check/findByCategory/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}wm_item_check/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}wm_item_check/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
  getByCategory,
};
