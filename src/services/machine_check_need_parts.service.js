import api from "./api";

const API_URL = process.env.REACT_APP_API;

const getAllByParts = (id) => {
  return api.get(`${API_URL}machine-check-need-parts/find-by-parts/${id}`);
};

export default {
  getAllByParts,
};
