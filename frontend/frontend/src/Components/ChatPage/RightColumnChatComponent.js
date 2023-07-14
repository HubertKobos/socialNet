import React, { useState } from "react";
import { useSelector } from "react-redux";
import FriendComponent from "../FriendPage/FriendComponent";

// This component works as a friend list
function RightColumnChatComponent() {
  const { friends } = useSelector((state) => state.authUserData);
  console.log("friends", friends);
  return (
    <div>
      {friends.map((friend) => (
        <FriendComponent
          friend={friend}
          key={friend.id}
          onClickOpenChat={true}
        />
      ))}
    </div>
  );
}

export default RightColumnChatComponent;
