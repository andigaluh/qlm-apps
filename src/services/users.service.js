import api from "./api";

const API_URL = process.env.REACT_APP_API + "auth";

const getAll = (params) => {
  //console.log(params);
  return api.get(`${API_URL}/all`, {
    params,
  });
};

const get = (id) => {
  return api.get(`${API_URL}/detail/${id}`);
};

const create = (data) => {
  return api.post(`${API_URL}/signup`, data);
};

const update = (id, data) => {
  return api.put(`${API_URL}/update/${id}`, data);
};

const remove = (id) => {
  return api.delete(`${API_URL}/remove/${id}`);
};

const removeAll = () => {
  return api.delete(`/user`);
};

const findByTitle = (title) => {
  return api.get(`/user?title=${title}`);
};

const resetPassword = (id, data) => {
  return api.put(`${API_URL}/change-password/${id}`, data);
};

const Userservice = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
  resetPassword,
};

export default Userservice;
