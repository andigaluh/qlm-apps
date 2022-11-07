import api from "./api";

const getAll = (params) => {
    return api.get(`daily_report`, {
    params,
  });
};

const getAllPublic = (params) => {
  return api.get(`daily_report/public`, {
    params,
  });
};

/* const create = (data, onUploadProgress) => {
  return api.post(`daily_report`, data, {
    onUploadProgress,
  });
}; */

const create = (data) => {
  return api.post(`daily_report`, data);
};

const remove = (id) => {
  return api.delete(`daily_report/${id}`, {
  });
};

const get = (id) => {
  return api.get(`daily_report/${id}`);
};

const update = (id, data) => {
  return api.put(`daily_report/${id}`, data);
};

const updateDraft = (id, data) => {
  return api.put(`daily_report/draft/${id}`, data);
};

const updateRelease = (id, data) => {
  return api.put(`daily_report/release/${id}`, data);
};

export default {
  getAll,
  create,
  remove,
  get,
  update,
  updateDraft,
  updateRelease,
  getAllPublic,
};
