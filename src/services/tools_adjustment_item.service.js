import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}tools_adjustment_item`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}tools_adjustment_item`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}tools_adjustment_item/published`);
};

const get = (id) => {
  return api.get(`${API_URL}tools_adjustment_item/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}tools_adjustment_item/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}tools_adjustment_item/${id}`);
};

const getByToolsId = (id, params) => {
  return api.get(`${API_URL}tools_adjustment_item/tools/${id}`, {params});
};

const download = (id) => {
  return api.get(`${API_URL}tools_adjustment_item/download/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
  getByToolsId,
  download
};
