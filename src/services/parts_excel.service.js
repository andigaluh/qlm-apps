import api from "./api";

const create = (data, onUploadProgress) => {
  return api.post(`parts_excel`, data, {
    onUploadProgress,
  });
};

export default {
  create,
};
