import axios from "axios";
import Cookies from "js-cookie";

// receiver all the tags or groups based on quesry search
export const getOnSearch = async (query) => {
  // '#' means we are lookig for a tags
  if (query[0] === "#") {
    return await axios({
      method: "get",
      url: `http://127.0.0.1:8000/api/search/tags_groups/q=_${query.substring(
        1
      )}`,
      headers: {
        Authorization: `Bearer ${
          JSON.parse(Cookies.get("userData"))["access"]
        }`,
      },
    })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        throw error;
      });
  } else if (query[0] !== " " && query[0] !== undefined) {
    return await axios({
      method: "get",
      url: `http://127.0.0.1:8000/api/search/tags_groups/q=${query}`,
      headers: {
        Authorization: `Bearer ${
          JSON.parse(Cookies.get("userData"))["access"]
        }`,
      },
    })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        throw error;
      });
  }
};

// receive all the users from database based on query search
export const getUsers = async (query) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/search/users/q=${query}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(Cookies.get("userData"))["access"]}`,
    },
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

// getting all the posts for the passed tag name
export const getPostsForSpecificTag = async (tag_name) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/search/tags_posts/q=${tag_name}`,
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
