/* import axios from "axios";
import authHeader from "./auth-header"; */

import api from "./api";

//const API_URL = process.env.REACT_APP_API;

const getAll = (params) => {
  /* return axios.get(`${API_URL}doc_inspection`, {
    headers: authHeader(), */
  return api.get(`doc_inspection`, {
    /* headers: authHeader(), */
    params,
  });
};

const create = (data, onUploadProgress) => {
  /* return axios.post(`${API_URL}doc_inspection`, data, { */
  return api.post(`doc_inspection`, data, {
    /* headers: authHeader(), */
    onUploadProgress,
  });
};

const remove = (id) => {
  /* return axios.delete(`${API_URL}doc_inspection/${id}`, { */
  return api.delete(`doc_inspection/${id}`, {
    /* headers: authHeader(), */
  });
};

const get = (id) => {
  /* return axios.get(`${API_URL}doc_inspection/${id}`, {
    headers: authHeader(),
  }); */
  return api.get(`doc_inspection/${id}`);
};

const update = (id, data) => {
  /* return axios.put(`${API_URL}doc_inspection/${id}`, data, {
    headers: authHeader(),
  }); */
  return api.put(`doc_inspection/${id}`, data);
};

export default {
  getAll,
  create,
  remove,
  get,
  update,
};
