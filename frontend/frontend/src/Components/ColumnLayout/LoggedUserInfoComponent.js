import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiOutlineBell } from "react-icons/ai";
import NotificationComponent from "./NotificationComponent";

function LoggedUserInfoComponent() {
  const { first_name, last_name, nick_name, avatar } = useSelector(
    (state) => state.authUserData.userData
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const image = new Image();
    image.src = avatar;
    image.onload = () => {
      setImageLoaded(true);
    };
  }, [avatar]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div onClick={() => navigate(`/profile`)} style={{ cursor: "pointer" }}>
        <h2 style={{ fontSize: "20px", marginLeft: "5px" }}>
          You are logged as:
        </h2>
        <div style={{ display: "flex" }}>
          {imageLoaded ? (
            <img
              src={avatar}
              style={{
                width: "40px",
                borderRadius: "50%",
                margin: "10px",
                marginRight: "10px",
              }}
            />
          ) : (
            <Spinner />
          )}
          <h2
            style={{
              fontSize: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>
              {first_name} {last_name} <NotificationComponent />
            </div>
            <div>
              <p
                style={{
                  color: "#777777",
                  marginLeft: "0px",
                  fontSize: "17px",
                  marginTop: "3px",
                  marginBottom: "2px",
                }}
              >
                {" "}
                {nick_name}
              </p>
            </div>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default LoggedUserInfoComponent;
