import React from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";

function FriendComponent({ friend, onClickOpenChat = false }) {
  const navigate = useNavigate();
  const { id: authenticated_user_id } = useSelector(
    (state) => state.authUserData.userData
  );

  const componentOnClickHandler = () => {
    if (onClickOpenChat) {
      const userIds = [authenticated_user_id, friend.id];
      const sortedUserIds = userIds.sort();
      const url = `/chat/${sortedUserIds.join("_")}`;
      navigate(url); // this two id's creates conversation id
    } else {
      navigate(`/profile/${friend.id}`);
    }
  };
  return (
    <div style={{ cursor: "pointer" }}>
      <h4 onClick={componentOnClickHandler}>
        <Image
          style={{
            width: "100px",
            height: "100px",
            marginRight: "15px",
          }}
          src={friend.avatar}
          roundedCircle
        />
        {friend.first_name} {friend.last_name}
      </h4>
    </div>
  );
}

export default FriendComponent;
