import api from "./api";

const getAll = (params) => {
  return api.get(`problem_machine`, {
    params,
  });
};

const create = (data) => {
  return api.post(`problem_machine`, data);
};

const remove = (id) => {
  return api.delete(`problem_machine/${id}`, {});
};

const get = (id) => {
  return api.get(`problem_machine/${id}`);
};

const update = (id, data) => {
  return api.put(`problem_machine/${id}`, data);
};

const download = () => {
  return api.get(`problem_machine/download`);
};

export default {
  getAll,
  create,
  remove,
  get,
  update,
  download
};
