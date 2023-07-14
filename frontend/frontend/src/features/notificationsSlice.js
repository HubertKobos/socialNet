import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friendRequests: sessionStorage.getItem("notifications_friend_requests")
    ? sessionStorage.getItem("notifications_friend_requests")
    : [],
  groupRequests: sessionStorage.getItem("notifications_group_requests")
    ? sessionStorage.getItem("notifications_group_requests")
    : [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updateFriendRequestNotifications: (state, payload) => {
      sessionStorage.setItem(
        "notifications_friend_requests",
        JSON.stringify(payload.payload)
      );
      state.friendRequests = payload.payload;
    },
    updateGroupRequestNotifications: (state, payload) => {
      sessionStorage.setItem(
        "notifications_group_requests",
        JSON.stringify(payload.payload)
      );
      state.groupRequests = payload.payload;
    },
    deleteFriendRequestNotification: (state, payload) => {
      const userId = payload.payload;
      const updatedFriendRequestNotifications = state.friendRequests.filter(
        (notification) => notification.id !== userId
      );
      state.friendRequests = updatedFriendRequestNotifications;
      sessionStorage.setItem(
        "notifications_friend_requests",
        state.friendRequests
      );
    },
  },
  extraReducers: {},
});

export const notificationsReducer = notificationsSlice.reducer;
export const {
  updateFriendRequestNotifications,
  updateGroupRequestNotifications,
  deleteFriendRequestNotification,
} = notificationsSlice.actions;
