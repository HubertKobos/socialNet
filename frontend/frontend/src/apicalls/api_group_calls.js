import axios from "axios";
import Cookies from "js-cookie";

// creating new group
export const createGroup = async ({ data }) => {
  console.log("data", data);
  return await axios({
    method: "post",
    url: `http://127.0.0.1:8000/api/group/create/`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
    data: {
      name: data.name,
      isPrivate: data.isPrivate,
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

// return specific group informations based on given id
export const getGroup = async (pk) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/group/get-group/${pk}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

// add user to the group list of members
export const addNewGroupMember = async (data) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/group/add-member/",
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
    data: data,
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw error;
    });
};

// remove user from the group list of members
export const deleteGroupMember = async (data) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/group/delete-member/",
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
    data: data,
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw error;
    });
};

// delete group based on it pk
export const deleteGroup = async (pk) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/group/delete-group/${pk}/`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw error;
    });
};

// get list of groups that user of id=pk is member of
export const getGroupsBasedOnURL = async (pk) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/group/get-groups/${pk}/`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw error;
    });
};

// receiving all the groups for the authenticated user
export const getGroups = async () => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/group/get-groups/`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      console.log(response.data);
      console.log("returned");
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error.response.data;
    });
};
