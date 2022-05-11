import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}iqc`, {
    params,
  });
};

const create = (data, onUploadProgress) => {
  return api.post(`${API_URL}iqc`, data, {
    onUploadProgress,
  });
};

const get = (id) => {
  return api.get(`${API_URL}iqc/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}iqc/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}iqc/${id}`);
};

const getAllHold = (params) => {
  return api.get(`${API_URL}iqc/hold`, {
    params,
  });
};

const updateHold = (id, data) => {
  return api.put(`${API_URL}iqc/hold/${id}`, data);
};

const dashboardIqc = () => {
  return api.get(`${API_URL}iqc/dashboardIqc`);
};

const dashboardHold = () => {
  return api.get(`${API_URL}iqc/dashboardHold`);
};

export default {
  getAll,
  create,
  get,
  update,
  remove,
  getAllHold,
  updateHold,
  dashboardIqc,
  dashboardHold,
};
