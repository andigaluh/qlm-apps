import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}machine`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}machine`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}machine/published`);
};

const get = (id) => {
  return api.get(`${API_URL}machine/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}machine/${id}`, data);
};

const updateParts = (id, data) => {
  return api.put(`${API_URL}machine/parts/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}machine/${id}`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
  updateParts,
};
