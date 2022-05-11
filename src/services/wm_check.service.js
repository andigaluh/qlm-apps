import api from "./api";

const API_URL = process.env.REACT_APP_API;

const create = (data) => {
  return api.post(`${API_URL}wm-check`, data);
};

const update = (id, data) => {
  return api.put(`${API_URL}wm-check/${id}`, data);
};

/* const getAll = (params) => {
  return api.get(`${API_URL}wm-check`, {
    params,
  });
}; */

/* const getPublished = () => {
  return api.get(`${API_URL}wm-check/published`);
};

const get = (id) => {
  return api.get(`${API_URL}wm-check/${id}`);
}; 



const updateParts = (id, data) => {
  return api.put(`${API_URL}wm-check/parts/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}wm-check/${id}`);
};*/

export default {
  create,
  update,
  /* getAll,
  getPublished,
  get,
  remove,
  updateParts, */
};
