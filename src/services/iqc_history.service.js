import api from "./api";

const API_URL = process.env.REACT_APP_API;


const getByIqcId = (id) => {
  return api.get(`${API_URL}iqc_history/iqc/${id}`);
};

export default {
  getByIqcId,
};
