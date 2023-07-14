import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
import { GoComment } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import CreateCommentComponent from "../SpecificGroupPage/CreateCommentComponent";
import AnswersComponent from "./AnswersComponent";
import { likePost } from "../../features/postsSlice";
import { useDispatch } from "react-redux";
import { dislikePost } from "../../features/postsSlice";
import { useSelector } from "react-redux";
import { getSpecificPost } from "../../features/postsSlice";
import { BsBookmarkStar } from "react-icons/bs";
import { BsBookmarkStarFill } from "react-icons/bs";
import { changeFavouriteStatus } from "../../apicalls/api_posts_calls";

function PostComponent({
  content,
  renderComments,
  answersToRender,
  handleNewAnswer,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeDifference, setTimeDifference] = useState("");
  const [likedPost, setLikedPost] = useState(0); // changed it to be based on sent content to component
  const [numberOfAnswers, setNumberOfAnswers] = useState(0);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { avatar, id: auth_user_id } = useSelector(
    (state) => state.authUserData.userData
  );
  const [isAuthUserPost, setIsAuthUserPost] = useState(false); // does post belongs to auth user

  const postClickHandler = () => {
    dispatch(getSpecificPost(content.id));
    navigate(`/post/${content.id}`);
  };

  useEffect(() => {
    if (content.created_by.id === auth_user_id) {
      setIsAuthUserPost(true);
    } else {
      setIsAuthUserPost(false);
    }
  }, [auth_user_id, content.created_by.id]);

  useEffect(() => {
    const image = new Image();
    if (isAuthUserPost) {
      image.src = avatar;
    } else {
      image.src = content.created_by.avatar;
    }
    image.onload = () => {
      setImageLoaded(true);
    };
  }, [content.created_by.avatar, avatar]);

  useEffect(() => {
    setNumberOfAnswers(content.number_of_answers);
    setNumberOfLikes(content.number_of_likes);
    setLikedPost(content.liked);
    setIsFavourite(content.isFavourite);

    const now = new Date();
    const postCreatedAt = new Date(content.created_at);
    const differenceInSeconds = parseInt(
      Math.abs(Math.floor((postCreatedAt - now) / 1000))
    );
    setTimeDifference(differenceInSeconds);
  }, [content]);

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
        <>
          <div
            style={{
              display: "flex",
              borderStyle: "solid",
              borderWidth: "1px",
              marginTop: "10px",
              borderColor: "#333333",
              borderRadius: "10px",
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
                  src={isAuthUserPost ? avatar : content.created_by.avatar}
                  style={{
                    width: "80px",
                    borderRadius: "50%",
                    margin: "10px",
                    marginRight: "0px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/profile/${content.created_by.id}`)}
                />
              </Row>
            </Col>
            <Col>
              <Row
                style={{ marginLeft: "20px" }}
                onClick={() => navigate(`/profile/${content.created_by.id}`)}
              >
                <div style={{ display: "flex" }}>
                  <h1
                    style={{
                      fontSize: "19px",
                      fontWeight: "400",
                      color: "#1894EE",
                      marginTop: "10px",
                      marginLeft: "7px",
                      cursor: "pointer",
                    }}
                  >
                    {content.created_by.first_name}{" "}
                    {content.created_by.last_name}{" "}
                    <span style={{ fontSize: "14px", color: "#71767B" }}>
                      {content.created_by.nick_name}
                    </span>{" "}
                    <BsDot color="white" />
                    <span style={{ fontSize: "14px", color: "#71767B" }}>
                      {formatTime(timeDifference)} ago
                    </span>
                    {content.group_name !== null && (
                      <span>
                        <BsDot color="white" />
                        <span style={{ fontSize: "14px", color: "#71767B" }}>
                          {content.group_name}
                        </span>
                      </span>
                    )}
                  </h1>
                  <Button
                    style={{
                      marginLeft: "auto",
                      marginRight: "10px",
                      marginTop: "10px",
                      background: "none",
                      border: "none",
                    }}
                    onClick={(e) => {
                      changeFavouriteStatus(content.id).then(function (
                        response
                      ) {
                        if (response.status === 200) {
                          setIsFavourite((prev) => !prev);
                        }
                      });
                      e.stopPropagation();
                    }}
                  >
                    {isFavourite ? (
                      <BsBookmarkStarFill size={24} />
                    ) : (
                      <BsBookmarkStar size={24} />
                    )}
                  </Button>
                </div>
              </Row>
              <Row
                style={{
                  marginLeft: "35px",
                  marginRight: "5px",
                }}
                onClick={() => postClickHandler()}
              >
                <div style={{ display: "inline-flex" }}>
                  <h2 style={{ fontSize: "16px" }}>{content.content}</h2>
                  {content.tags?.map((tag) => (
                    <h2
                      key={tag.id}
                      style={{
                        fontSize: "16px",
                        marginLeft: "5px",
                        color: "#1894EE",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tag/${tag.name}`);
                      }}
                    >
                      #{tag.name}
                    </h2>
                  ))}
                </div>
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
                  {!likedPost ? (
                    <div style={{ display: "flex" }}>
                      <h3 style={{ fontSize: "19px", marginRight: "5px" }}>
                        {numberOfLikes}
                      </h3>
                      <AiOutlineHeart
                        size={24}
                        style={{ marginRight: "20px", marginBottom: "10px" }}
                        onClick={() => {
                          setLikedPost((prev) => !prev);
                          setNumberOfLikes((prev) => (prev = prev + 1));
                          dispatch(likePost(content.id));
                        }}
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
                        onClick={() => {
                          setLikedPost((prev) => !prev);
                          setNumberOfLikes((prev) => (prev = prev - 1));
                          dispatch(dislikePost(content.id));
                        }}
                      />
                    </div>
                  )}
                  <div style={{ display: "flex" }}>
                    <GoComment
                      size={24}
                      style={{ marginLeft: "20px", marginBottom: "10px" }}
                      onClick={() => postClickHandler()}
                    />
                    <h3 style={{ fontSize: "19px", marginLeft: "5px" }}>
                      {numberOfAnswers}
                    </h3>
                  </div>
                </div>
              </Row>
            </Col>
          </div>
          {/* Comment section  */}
          {/* lets create an answer component and there calculate time difference */}
          {renderComments && (
            <>
              <CreateCommentComponent handleNewAnswer={handleNewAnswer} />
              <h2
                style={{
                  marginTop: "10px",
                  fontSize: "15px",
                  marginLeft: "10px",
                }}
              >
                {answersToRender?.length} answers
              </h2>
              {answersToRender?.map((answer, index) => (
                <AnswersComponent answer={answer} key={index} />
              ))}
            </>
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Spinner />
        </div>
      )}
    </>
  );
}

export default PostComponent;
