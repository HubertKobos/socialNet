import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function MessageComponent({ data }) {
  const { id } = useSelector((state) => state.authUserData.userData);
  const [isMyMessage, setIsMyMessage] = useState(false);
  useEffect(() => {
    if (data.owner === id) {
      setIsMyMessage(true);
    }
  }, [data.owner, id]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMyMessage ? "row-reverse" : "row",
        marginBottom: "10px",
        marginRight: "10px",
        marginLeft: "10px",
      }}
    >
      <div
        style={{
          backgroundColor: isMyMessage ? "#29a1f2" : "#e5e5e5",
          color: isMyMessage ? "#fff" : "#000",
          padding: "10px",
          borderRadius: "5px",
          maxWidth: "80%",
          overflowWrap: "break-word",
        }}
      >
        {data.message}
      </div>
    </div>
  );
}

export default MessageComponent;
