import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  return api.get(`${API_URL}notif`, {
    params,
  });
};

const getUnread = (params) => {
  return api.get(`${API_URL}notif/unread`, {
    params,
  });
};

const remove = (id) => {
  return api.delete(`${API_URL}notif/${id}`);
};

const get = (id) => {
  return api.get(`${API_URL}notif/${id}`);
};

export default {
  getAll,
  getUnread,
  remove,
  get,
};
