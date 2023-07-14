import React, { useState, useEffect } from "react";
import { postNewPost } from "../../apicalls/api_posts_calls";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addNewPost } from "../../features/postsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import CreatePostForm from "./Forms/CreatePostForm";

function CreatePostComponent() {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const { avatar } = useSelector((state) => state.authUserData.userData);

  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const image = new Image();
    image.src = avatar;
    image.onload = () => {
      setImageLoaded(true);
    };
  }, [avatar]);

  const submitHandler = () => {
    if (content !== "" && content !== null) {
      postNewPost(JSON.parse(Cookies.get("userData"))["id"], content).then(
        function (response) {
          if (response.status === 201) {
            setContent("");
            dispatch(addNewPost({ content: content, id: response.data.id }));
          }
        }
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {imageLoaded ? (
        <img
          src={avatar}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            margin: "10px",
            marginRight: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/profile")}
        />
      ) : (
        <Spinner />
      )}

      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CreatePostForm
          content={content}
          setContent={setContent}
          submitHandler={submitHandler}
        />
      </div>
    </div>
  );
}

export default CreatePostComponent;
