import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}defect`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}defect`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}defect/published`);
};

const get = (id) => {
  return api.get(`${API_URL}defect/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}defect/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}defect/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
};
