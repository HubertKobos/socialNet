import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stylesheets/index.css";
import "./stylesheets/profilePage.css";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainPage from "./Screens/MainPage";
import LoginPage from "./Screens/LoginPage";
import RegisterPage from "./Screens/RegisterPage";
import ProfilePage from "./Screens/ProfilePage";
import PostPage from "./Screens/PostPage";
import TagPage from "./Screens/TagPage";
import GroupPage from "./Screens/GroupPage";
import { useSelector } from "react-redux";
import SpecificGroupPage from "./Screens/SpecificGroupPage";
import ChatSreen from "./Screens/ChatPage";
import FriendPage from "./Screens/FriendPage";
import { WebSocketProvider } from "./Wrappers/WebSocketProvider";
import FavPostsPage from "./Screens/FavPostsPage";

const AppRouter = () => {
  const { isAuthenticated } = useSelector((state) => state.authUserData);
  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? <MainPage /> : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: !isAuthenticated ? <LoginPage /> : <Navigate to="/" />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/friends",
      element: isAuthenticated ? <FriendPage /> : <Navigate to="/login" />,
    },
    {
      path: "/profile",
      element: isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />,
    },
    {
      path: "/profile/:id",
      element: isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />,
    },
    {
      path: "/post/:id",
      element: isAuthenticated ? <PostPage /> : <Navigate to="/login" />,
    },
    {
      path: "/tag/:id",
      element: isAuthenticated ? <TagPage /> : <Navigate to="/login" />,
    },
    {
      path: "/groups",
      element: isAuthenticated ? <GroupPage /> : <Navigate to="/login" />,
    },
    {
      path: "/chat",
      element: isAuthenticated ? <ChatSreen /> : <Navigate to="/login" />,
    },
    {
      path: "/chat/:id",
      element: isAuthenticated ? <ChatSreen /> : <Navigate to="/login" />,
    },
    {
      path: "/fav-posts",
      element: isAuthenticated ? <FavPostsPage /> : <Navigate to="/login" />,
    },
    {
      path: "/group/:id",
      element: isAuthenticated ? (
        <SpecificGroupPage />
      ) : (
        <Navigate to="/login" />
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <WebSocketProvider>
      <AppRouter />

      {/* <App /> */}
    </WebSocketProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
