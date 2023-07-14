import React, { useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { WebSocketContext } from "../../Wrappers/WebSocketProvider";

function VerticalHeader() {
  const dispatch = useDispatch();
  const socket = useContext(WebSocketContext);

  const logoutHandle = () => {
    dispatch(logout());
    socket.close();
    window.location.reload();
  };

  return (
    <Col className="VerticalHeader">
      <Row className="mb-5 Logo">Social App</Row>
      <Row>
        <p>
          <BsDot size={32} />
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            Home
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link
            to="/fav-posts"
            style={{ textDecoration: "none", color: "white" }}
          >
            Favourite
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link
            to="/friends"
            style={{ textDecoration: "none", color: "white" }}
          >
            Friends
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link to="/chat" style={{ textDecoration: "none", color: "white" }}>
            Messages
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "white" }}
          >
            Profile
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link to="/groups" style={{ textDecoration: "none", color: "white" }}>
            Groups
          </Link>
        </p>
        <p>
          <BsDot size={32} />
          <Link
            onClick={logoutHandle}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            Logout
          </Link>
        </p>
      </Row>
    </Col>
  );
}

export default VerticalHeader;
