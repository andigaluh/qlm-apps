import api from "./api";

const API_URL = process.env.REACT_APP_API + "test/";

const getPublicContent = () => {
  return api.get(API_URL + "all");
};

const getOperatorBoard = () => {
  return api.get(API_URL + "operator");
};

const getEngineerBoard = () => {
  return api.get(API_URL + "engineer");
};

const getSupervisorBoard = () => {
  return api.get(API_URL + "supervisor");
};

const getAdminBoard = () => {
  return api.get(API_URL + "admin");
};

export default {
  getPublicContent,
  getOperatorBoard,
  getEngineerBoard,
  getSupervisorBoard,
  getAdminBoard,
};
