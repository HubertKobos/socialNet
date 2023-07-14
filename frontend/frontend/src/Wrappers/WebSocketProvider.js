import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  updateFriendRequestNotifications,
  updateGroupRequestNotifications,
} from "../features/notificationsSlice";
import { useDispatch } from "react-redux";

const WebSocketContext = createContext();
// Define a WebSocketProvider component
const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const { access } = useSelector((state) => state.authUserData.userData);

  useEffect(() => {
    // Create a new WebSocket instance
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/notifications/ws/?token=${access}`
    );
    setSocket(socket);

    // Event handler for successful connection
    socket.onopen = (event) => {
      console.log("Websocket connection established");
    };

    // Event handler for receiving messages from the server
    socket.onmessage = (event) => {
      console.log("newsocket!", event.data);
      const data = JSON.parse(event.data);
      if (data["friend_requests_notifications"]) {
        console.log("inside provider: ", data["friend_requests_notifications"]);
        dispatch(
          updateFriendRequestNotifications(
            data["friend_requests_notifications"]
          )
        );
      }
      if (data["group_requests_notifications"]) {
        console.log("inside provider:", data["group_requests_notifications"]);
        dispatch(
          updateGroupRequestNotifications(data["group_requests_notifications"])
        );
      }
    };

    // Event handler for WebSocket errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Event handler for WebSocket connection closure

    socket.onclose = () => {
      // setReceivedMessages([]);
      console.log("WebSocket connection closed");
    };

    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      socket.close();
    };
  }, [access]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
