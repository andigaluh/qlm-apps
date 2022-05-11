import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}tools_type`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}tools_type`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}tools_type/published`);
};

const get = (id) => {
  return api.get(`${API_URL}tools_type/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}tools_type/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}tools_type/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
};
