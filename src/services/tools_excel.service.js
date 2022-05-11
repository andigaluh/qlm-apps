import api from "./api";

const getAll = (params) => {
  return api.get(`tools_excel`, {
    params,
  });
};

const create = (data, onUploadProgress) => {
  return api.post(`tools_excel`, data, {
    onUploadProgress,
  });
};

const remove = (id) => {
  return api.delete(`tools_excel/${id}`);
};

const get = (id) => {
  return api.get(`tools_excel/${id}`);
};

export default {
  getAll,
  create,
  remove,
  get,
};
