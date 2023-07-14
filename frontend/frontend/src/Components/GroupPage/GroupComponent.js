import React from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function GroupComponent({ data }) {
  const { id: userId } = useSelector((state) => state.authUserData.userData);
  const navigate = useNavigate();

  return (
    <div
      className="group-component"
      style={{
        border: "2px solid ",
        borderColor: "#333333",
        padding: "10px",
        borderRadius: "10%",
        marginTop: "5px",
        marginBottom: "5px",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/group/${data.id}`)}
    >
      <h2>{data.name}</h2>
      <h2 style={{ fontSize: "18px" }}>owner - {data.created_by_name}</h2>
      <p style={{ margin: "5px" }}>
        {data.number_of_participants} participants
      </p>
      {data.is_private && (
        <p style={{ fontSize: "15px", margin: "0px" }}>
          This group is <span style={{ color: "red" }}>private</span>
        </p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "5px",
        }}
      >
        {userId !== data.created_by_id &&
          data.is_auth_user_member_of === false && (
            <Button variant="primary" style={{ color: "white" }}>
              Join
            </Button>
          )}
      </div>
    </div>
  );
}

export default GroupComponent;
