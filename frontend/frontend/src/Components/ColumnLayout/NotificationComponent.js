import React from "react";
import { AiOutlineBell } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function NotificationComponent() {
  const navigate = useNavigate();
  const friendRequests = useSelector(
    (state) => state.notifications.friendRequests
  );
  const groupRequests = useSelector(
    (state) => state.notifications.groupRequests
  );
  const connectedRequests = friendRequests.concat(groupRequests);

  const popover = (
    <Popover id="popover-basic">
      {Array.isArray(connectedRequests) &&
        connectedRequests.map((item) => (
          <div key={item.id}>
            <Popover.Header as="h4" style={{ color: "black" }}>
              {item.request_type === "friend_request"
                ? "Friend Request"
                : "Group Request"}
            </Popover.Header>
            <Popover.Body style={{ display: "flex" }}>
              <img
                style={{
                  maxWidth: "50px",
                  marginRight: "10px",
                  borderRadius: "20px",
                }}
                src={
                  item.avatar === "default-user-avatar"
                    ? "https://socialappbuckett.s3.amazonaws.com/default-user-avatar?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATDELSGMYQLA4ZNX6%2F20230618%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20230618T201834Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=4f785c5953acbcede9c43729b2b26ca5d9e6fb9496992430b691a98cb30359e1"
                    : item.avatar
                }
              ></img>
              <h2
                style={{
                  fontSize: "20px",
                  marginTop: "10px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/profile/${item.id}`)}
              >
                {item.first_name} {item.last_name}
              </h2>
            </Popover.Body>
          </div>
        ))}
    </Popover>
  );

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <OverlayTrigger trigger="click" placement="right" overlay={popover}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button
            variant="link"
            style={{
              padding: 0,
              border: "none",
              background: "none",
            }}
          >
            <AiOutlineBell size={28} color="grey" />
          </Button>
          {(friendRequests.length > 0 || groupRequests.length > 0) && (
            <div
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "red",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "12px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {friendRequests.length + groupRequests.length}
            </div>
          )}
        </div>
      </OverlayTrigger>
    </div>
  );
}

export default NotificationComponent;
