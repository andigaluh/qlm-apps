import api from "./api";
import TokenService from "./token.service";

const API_URL = process.env.REACT_APP_API + "auth/";

const register = (username, email, password) => {
  //return axios.post(API_URL + "signup", {
  return api.post("auth/signup", {
    username,
    email,
    password,
  });
};

const getUnread = (params) => {
  /* return axios.get(`${process.env.REACT_APP_API}notif/unread`, {
    headers: authHeader(), */
  return api.get(`/notif/unread`, {
    params,
  });
};

const login = (username, password) => {
  /* return axios
    .post(API_URL + "signin", { */
  return api
    .post("auth/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        //localStorage.setItem("user", JSON.stringify(response.data));
        TokenService.setUser(response.data);
        getUnread({user_id: response.data.id}).then(
          (inbox) => {
            localStorage.setItem("totalNotif", inbox.data.length);
          }
        )
      }

      return response.data;
    });
};

const loginBarcode = (username) => {
  /* return axios
    .post(API_URL + "signinBarcode", { */
  return api
    .post("auth/signinBarcode", {
      username,
    })
    .then((response) => {
      if (response.data.accessToken) {
        /* localStorage.setItem("user", JSON.stringify(response.data)); */
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = () => {
  /* localStorage.removeItem("user"); */
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getTotalInboxUser = () => {
  return localStorage.getItem("totalNotif");
}

const authService = {
  register,
  login,
  logout,
  loginBarcode,
  getCurrentUser,
  getTotalInboxUser,
};

export default authService;
