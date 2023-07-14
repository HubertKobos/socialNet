import axios from "axios";
import Cookies from "js-cookie";

// like the specific answer
export const likeAnswer = async (pk) => {
  console.log(pk);
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/answers/${pk}/like`,
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

// dislike the specific answer
export const dislikeAnswer = async (pk) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/answers/${pk}/dislike`,
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
