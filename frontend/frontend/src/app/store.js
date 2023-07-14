import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "../features/authSlice";
import { getNewsReducer } from "../features/newsSlice";
import { getPostsReducer } from "../features/postsSlice";
import { getGroupsATReducer } from "../features/groupsSlice";
import { notificationsReducer } from "../features/notificationsSlice";

export const store = configureStore({
  reducer: {
    authUserData: loginReducer,
    news: getNewsReducer,
    posts: getPostsReducer,
    groups: getGroupsATReducer,
    notifications: notificationsReducer,
  },
});
