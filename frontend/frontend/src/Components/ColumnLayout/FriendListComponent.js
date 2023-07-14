import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { IoPeopleOutline } from "react-icons/io5";
import "../../stylesheets/index.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function FriendListComponent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showFriendList, setShowFriendList] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { friends } = useSelector((state) => state.authUserData);

  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  const toggleFriendList = () => {
    setShowFriendList(!showFriendList);
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "20px",
        backgroundColor: "#333333",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 9999,
      }}
    >
      <div
        className={`friend-list-button ${isHovered ? "hovered" : ""}`}
        onClick={toggleFriendList}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        <Button
          variant="dark"
          style={{
            textDecoration: "none",
            pointerEvents: "none",
          }}
        >
          Friend list
        </Button>
        <IoPeopleOutline
          size={24}
          style={{ marginLeft: "-10px", marginRight: "10px" }}
        />
      </div>
      {showFriendList && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "0px",
            backgroundColor: "#333333",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            width: "200px",
          }}
        >
          {/* Friend List content goes here */}
          <ul>
            {friends !== [] ? (
              friends?.map((friend) => (
                <li key={friend.id}>
                  <h2
                    style={{ fontSize: "18px", cursor: "pointer" }}
                    onClick={() => {
                      if (parseInt(id) !== parseInt(friend.id)) {
                        console.log(id);
                        navigate(`/profile/${friend.id}`);
                      }
                    }}
                  >
                    {friend.first_name} {friend.last_name}
                  </h2>
                </li>
              ))
            ) : (
              <li>You have no friends yet</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FriendListComponent;
