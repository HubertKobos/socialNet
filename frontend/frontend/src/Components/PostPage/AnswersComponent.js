import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import Spinner from "react-bootstrap/Spinner";
import { likeAnswer, dislikeAnswer } from "../../apicalls/api_answers_calls";

function AnswersComponent({ answer }) {
  const navigate = useNavigate();
  const [timeDifference, setTimeDifference] = useState("");
  const [likedAnswer, setLikedAnswer] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const likePostHandler = () => {
    likeAnswer(answer.id)
      .then((resp) => {
        if (resp.status === 200) {
          setNumberOfLikes((prev) => prev + 1);
          setLikedAnswer(true);
        }
      })
      .catch((error) => console.log(error));
  };

  const dislikePostHandler = () => {
    dislikeAnswer(answer.id)
      .then((resp) => {
        if (resp.status === 200) {
          setNumberOfLikes((prev) => prev - 1);
          setLikedAnswer(false);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const now = new Date();
    const postCreatedAt = new Date(answer.created_at);
    const differenceInSeconds = parseInt(
      Math.abs(Math.floor((postCreatedAt - now) / 1000))
    );
    setTimeDifference(differenceInSeconds);
    setLikedAnswer(answer.liked);
    setNumberOfLikes(answer.number_of_likes);
  }, [answer, answer.liked, answer.number_of_likes]);

  useEffect(() => {
    const image = new Image();
    image.src = answer.created_by.avatar;
    image.onload = () => {
      setImageLoaded(true);
    };
  }, [answer.created_by.avatar]);

  const formatTime = (differenceInSeconds) => {
    let convertedTime;
    if (differenceInSeconds < 60) {
      convertedTime = `${differenceInSeconds} seconds`;
    } else if (differenceInSeconds > 60 && differenceInSeconds < 3600) {
      convertedTime = `${Math.floor(differenceInSeconds / 60)} minutes`;
    } else if (differenceInSeconds > 3600 && differenceInSeconds < 86400) {
      convertedTime = `${Math.floor(differenceInSeconds / 3600)} hours`;
    } else if (differenceInSeconds > 86400 && differenceInSeconds < 5184000) {
      convertedTime = `${Math.floor(differenceInSeconds / 86400)} days`;
    } else {
      convertedTime = `${Math.floor(differenceInSeconds / 5184000)} months`;
    }
    return convertedTime;
  };

  return (
    <>
      {imageLoaded ? (
        <div
          key={answer.id}
          style={{
            display: "flex",
            marginTop: "10px",
          }}
        >
          <Col xs={1} sm={1} lg={1} xl={1} xxl={1} md={1}>
            <Row
              style={{
                maxWidth: "90px",
                width: "90px",
                marginRight: "0px",
                marginTop: "5px",
              }}
            >
              <img
                src={answer.created_by.avatar}
                style={{
                  width: "80px",
                  borderRadius: "50%",
                  margin: "10px",
                  marginRight: "0px",
                }}
                onClick={() => navigate(`/user/${answer.created_by.id}`)}
              />
            </Row>
          </Col>
          <Col>
            <Row
              style={{ marginLeft: "20px" }}
              onClick={() => navigate(`/user/${answer.created_by.id}`)}
            >
              <h1
                style={{
                  fontSize: "19px",
                  fontWeight: "400",
                  color: "#1894EE",
                  marginTop: "10px",
                  marginLeft: "7px",
                }}
              >
                {answer.created_by.first_name} {answer.created_by.last_name}{" "}
                <span style={{ fontSize: "14px", color: "#71767B" }}>
                  {answer.created_by.nick_name}
                </span>{" "}
                <BsDot color="white" />
                <span style={{ fontSize: "14px", color: "#71767B" }}>
                  {formatTime(timeDifference)} ago
                </span>
              </h1>
            </Row>
            <Row style={{ marginLeft: "40px", marginRight: "5px" }}>
              {answer.original_content}
            </Row>
            <Row>
              <hr style={{ width: "100px", marginTop: "18px" }} />
            </Row>
            <Row>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {!likedAnswer ? (
                  <div style={{ display: "flex" }}>
                    <h3 style={{ fontSize: "19px", marginRight: "5px" }}>
                      {numberOfLikes}
                    </h3>
                    <AiOutlineHeart
                      size={24}
                      style={{ marginRight: "20px", marginBottom: "10px" }}
                      onClick={() => likePostHandler()}
                    />
                  </div>
                ) : (
                  <div style={{ display: "flex" }}>
                    <h3 style={{ fontSize: "19px", marginRight: "5px" }}>
                      {numberOfLikes}
                    </h3>
                    <AiFillHeart
                      size={24}
                      style={{ marginRight: "20px", marginBottom: "10px" }}
                      onClick={() => dislikePostHandler()}
                    />
                  </div>
                )}
              </div>
              <hr style={{ width: "550px" }} />
            </Row>
          </Col>
          <hr />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default AnswersComponent;
