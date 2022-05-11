import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}schedule_qc`, {
    params,
  });
};

const create = (data, onUploadProgress) => {
  return api.post(`${API_URL}schedule_qc`, data, {
    onUploadProgress,
  });
};

const remove = (id) => {
  return api.delete(`${API_URL}schedule_qc/${id}`, {});
};

const get = (id) => {
  return api.get(`${API_URL}schedule_qc/${id}`);
};

const update = (id, data) => {
  return api.put(`${API_URL}schedule_qc/${id}`, data);
};

const download = () => {
  return api.get(`${API_URL}schedule_qc/download`);
};

export default {
  getAll,
  create,
  remove,
  get,
  update,
  download,
};
