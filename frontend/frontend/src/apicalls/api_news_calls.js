import axios from "axios";
import Cookies from "js-cookie";

// get news from backend to display in News component
export const getAllNews = async () => {
  return await axios({
    method: "get",
    url: "http://127.0.0.1:8000/api/polish-news",
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
