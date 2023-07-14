import axios from "axios";
import Cookies from "js-cookie";

// sending login and password to get user data with JWT tokens
export const userLogin = async (login, password) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/users/login/",
    data: {
      email: login,
      password: password,
    },
    // responseType: "json",
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

// register user
export const registerUser = async (data) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/users/register/",
    data: data,
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};

// get user informations
export const getProfile = async (id = null) => {
  let url = `http://127.0.0.1:8000/api/users/profile/`;
  if (id) {
    url += `${id}/`;
  }
  return await axios({
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};

// check if the JWT access token is valid
export const isTokenValid = async (access_token) => {
  return await axios({
    method: "post",
    url: `http://127.0.0.1:8000/api/users/token/verify/`,
    data: {
      token: access_token,
    },
  })
    .then(function (response) {
      console.log(response.data);
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

export const editProfile = async (data) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/users/edit/",
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
    data: data,
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};
