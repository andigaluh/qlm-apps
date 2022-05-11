import api from "./api";

const create = (data, onUploadProgress) => {
  return api.post(`supplier_excel`, data, {
    onUploadProgress,
  });
};

export default {
  create,
};
