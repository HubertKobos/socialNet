import axios from "axios";
import Cookies from "js-cookie";

// send invite to friends list
export const inviteFriend = async (user_id) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/request/friend/invite/${user_id}/`,
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

// accept invite to friends list
export const acceptFriendInvitation = async (user_id) => {
  return await axios({
    method: "get",
    url: `http://127.0.0.1:8000/api/request/friend/accept/${user_id}/`,
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
