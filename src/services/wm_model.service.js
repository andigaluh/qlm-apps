import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}wm_model`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}wm_model`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}wm_model/published`);
};

const get = (id) => {
  return api.get(`${API_URL}wm_model/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}wm_model/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}wm_model/${id}`);
};

const getByWmType = (id) => {
  return api.get(`${API_URL}wm_model/findByWmType/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
  getByWmType,
};
