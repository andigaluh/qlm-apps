import api from "./api";

const getAll = (params) => {
  return api.get(`schedule_qc_excel`, {
    params,
  });
};

const create = (data, onUploadProgress) => {
  return api.post(`schedule_qc_excel`, data, {
    onUploadProgress,
  });
};

const remove = (id) => {
  return api.delete(`schedule_qc_excel/${id}`);
};

const get = (id) => {
  return api.get(`schedule_qc_excel/${id}`);
};

export default {
  getAll,
  create,
  remove,
  get,
};
