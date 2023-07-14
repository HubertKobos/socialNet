import axios from "axios";
import Cookies from "js-cookie";

// get friend list of authenticated user
export const getFriendsList = async () => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/friends/friend-list`,
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

export const deleteFriend = async (pk) => {
  return await axios({
    method: "delete",
    url: `http://127.0.0.1:8000/api/friends/delete/${pk}`,
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
