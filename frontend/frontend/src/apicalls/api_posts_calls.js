import axios from "axios";
import Cookies from "js-cookie";

// get all the posts for authenticated user
export const getAllTablePosts = async ({ offset, limit }) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/posts/user-posts/${offset}/${limit}/`,
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

// receive all the posts for authenticated user
export const getPostsForAuthenticatedUser = async () => {
  return await axios({
    method: "get",
    url: "http://127.0.0.1:8000/api/posts/getAllUserPosts/",
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      console.log("there are my posts", response);
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};

// create new answer for the post based on it id and content
export const createAnswerForPost = async (post_id, data) => {
  return await axios({
    method: "post",
    url: `http://127.0.0.1:8000/api/posts/answer/create`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
    data: {
      original_content: data,
      created_by: JSON.parse(Cookies.get("userData"))["id"],
      post: post_id,
    },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

// reveinng all the answers for the post of given id
export const getAnswersForSpecificPost = async (pk, offset, limit) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/posts/${pk}/answers/${offset}/${limit}/`,
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

// liking a post
export const getLikePost = async (user, pk) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/posts/${user}/likes/${pk}`,
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

// disliking a post
export const getDislikePost = async (user, pk) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/posts/${user}/dislikes/${pk}`,
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

// retrieve specific post based on pk from url
export const getPost = async (id) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/posts/get/${id}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};

// endpoint changes favourite status of post depends on the previous state (if it was favourite then it changes to not be)
export const changeFavouriteStatus = async (pk) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/posts/change-favourite-status/${pk}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
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

export const getFavPosts = async () => {
  return await axios({
    method: "GET",
    url: `http://127.0.0.1:8000/api/posts/favourite-posts/`,
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

// create new post by user
export const postNewPost = async (userId, content, groupId = null) => {
  return await axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/posts/create/",
    data: {
      userId: userId,
      content: content,
      groupId: groupId,
    },
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
