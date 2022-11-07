import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
    return api.get(`${API_URL}outgoing`, {
        params,
    });
};

const create = (data) => {
    return api.post(`${API_URL}outgoing`, data);
};

const get = (id) => {
    return api.get(`${API_URL}outgoing/${id}`);
};

const getByBarcode = (id) => {
  return api.get(`${API_URL}outgoing/barcode/${id}`);
};

const update = (id, data) => {
    return api.put(`${API_URL}outgoing/${id}`, data);
};

const remove = (id) => {
    return api.delete(`${API_URL}outgoing/${id}`);
};

export default {
  getAll,
  create,
  get,
  update,
  remove,
  getByBarcode,
};
