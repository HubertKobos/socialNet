import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userLogin } from "../apicalls/api_users_calls";
import Cookies from "js-cookie";

const initialState = {
  userData: Cookies.get("userData") ? JSON.parse(Cookies.get("userData")) : [],
  friends: sessionStorage.getItem("friends")
    ? JSON.parse(sessionStorage.getItem("friends"))
    : [],
  friends_invitation: sessionStorage.getItem("socialApp")
    ? JSON.parse(sessionStorage.getItem("socialApp"))["friends_invitation"]
    : [],
  group_invitation: sessionStorage.getItem("socialApp")
    ? JSON.parse(sessionStorage.getItem("socialApp"))["group_invitation"]
    : [],
  loading: false,
  error: false,
  isAuthenticated: Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))["isAuthenticated"]
    : false,
};

export const login = createAsyncThunk("users/login", async (loginData) => {
  const response = await userLogin(loginData.login, loginData.password);
  return response;
});

export const loginSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = "";
      document.cookie =
        "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      sessionStorage.removeItem("friends");
      sessionStorage.removeItem("friends_invitation");
      sessionStorage.removeItem("group_invitation");
      sessionStorage.removeItem("groups");
      sessionStorage.removeItem("posts");
      sessionStorage.removeItem("notifications_group_requests");
      sessionStorage.removeItem("notifications_friend_requests");
    },
    acceptFriendInvite: (state, payload) => {
      state.friends = [...state.friends, payload.payload];
      sessionStorage.setItem("friends", JSON.stringify(state.friends));
    },
    deleteFriendReducer: (state, payload) => {
      const friendId = payload.payload;
      const updatedFriends = state.friends.filter(
        (friend) => friend.id !== friendId
      );
      state.friends = updatedFriends;
      sessionStorage.setItem("friends", JSON.stringify(state.friends));
    },
    fetchFriendList: (state, payload) => {
      if (payload.payload === "" || payload.payload === []) {
        state.friends = [];
      } else {
        state.friends = payload.payload;
      }
    },
    updateUserData: (state, payload) => {
      const updatedUserData = payload.payload;
      const stateUserData = { ...state.userData };
      for (let key in updatedUserData) {
        if (updatedUserData.hasOwnProperty(key)) {
          stateUserData[key] = updatedUserData[key];
        }
      }
      state.userData = { ...stateUserData };
      Cookies.set("userData", JSON.stringify(state.userData));
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, payload) => {
      const data = payload.payload;
      const data_to_session_storage = {
        friends: data.friends,
        friends_invitation: data.friends_invitation,
        group_invitation: data.group_invitation,
      };
      sessionStorage.setItem("friends", JSON.stringify(data.friends));
      sessionStorage.setItem(
        "friends_invitation",
        JSON.stringify(data.friends_invitation)
      );
      sessionStorage.setItem(
        "group_invitation",
        JSON.stringify(data.group_invitation)
      );
      const keysToDelete = [
        "friends",
        "friends_invitation",
        "group_invitation",
      ];
      state.friends = data.friends;
      state.friends_invitation = data.friends_invitation;
      state.group_invitation = data.group_invitation;

      keysToDelete.forEach((key) => {
        delete data[key];
      });
      Cookies.set("userData", JSON.stringify(data));

      state.userData = data;
      state.loading = false;
      state.isAuthenticated = true;
    },
    [login.rejected]: (state, payload) => {
      state.loading = false;
      state.error = payload.error.message;
    },
  },
});

export const {
  logout,
  acceptFriendInvite,
  deleteFriendReducer,
  fetchFriendList,
  updateUserData,
} = loginSlice.actions;

export const loginReducer = loginSlice.reducer;
