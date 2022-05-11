import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}report-wm-check`, {
    params,
  });
};

const create = (data) => {
  return api.post(`${API_URL}report-wm-check`, data);
};

const getPublished = () => {
  return api.get(`${API_URL}report-wm-check/published`);
};

const get = (id) => {
  return api.get(`${API_URL}report-wm-check/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}report-wm-check/${id}`, data);
};

const updateParts = (id, data) => {
  return api.put(`${API_URL}report-wm-check/parts/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}report-wm-check/${id}`);
};

const download = () => {
  return api.get(`${API_URL}report-wm-check/download`);
};

const dashboardOqc = () => {
  return api.get(`${API_URL}report-wm-check/dashboardOqc`);
};

const dashboardHoldOqc = () => {
  return api.get(`${API_URL}report-wm-check/dashboardHoldOqc`);
};

export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
  updateParts,
  download,
  dashboardOqc,
  dashboardHoldOqc,
};
