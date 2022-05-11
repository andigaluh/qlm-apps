import api from "./api";

const getAll = (params) => {
  return api.get(`parts`, {
    params,
  });
};

const create = (data) => {
  return api.post(`parts`, data);
};

const getPublished = () => {
  return api.get(`parts/published`);
};

const get = (id) => {
  return api.get(`parts/${id}`);
};

const getBySupplier = (id) => {
  return api.get(`parts/supplier/${id}`);
};

const update = (id, data) => {
  return api.put(`parts/${id}`, data);
};

const remove = (id) => {
  return api.delete(`parts/${id}`);
};

const download = () => {
  return api.get(`parts/download`);
};


export default {
  getAll,
  create,
  getPublished,
  get,
  update,
  remove,
  download,
  getBySupplier,
};
