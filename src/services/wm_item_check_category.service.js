import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}wm_item_check_category`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}wm_item_check_category`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}wm_item_check_category/published`);
};

const get = (id) => {
  return api.get(`${API_URL}wm_item_check_category/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}wm_item_check_category/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}wm_item_check_category/${id}`);
};

const getByWmType = (id) => {
  return api.get(`${API_URL}wm_item_check_category/findByWmType/${id}`);
};

const getByWmTypeId = (id) => {
  return api.get(`${API_URL}wm_item_check_category/findByWmTypeId/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
  getByWmType,
  getByWmTypeId,
};
