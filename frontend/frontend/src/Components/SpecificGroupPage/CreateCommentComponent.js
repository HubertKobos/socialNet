import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { createAnswer } from "../../features/postsSlice";
import { useDispatch } from "react-redux";
import { postNewPost } from "../../apicalls/api_posts_calls";
import { useSelector } from "react-redux";
import CreateFormComponent from "./Forms/CreateFormComponent";

function CreateCommentComponent({
  handleNewAnswer,
  is_mounted_in_group_page = false,
  successCreatedComment,
}) {
  const dispatch = useDispatch();
  const post_id = useParams();
  const [answer, setAnswer] = useState();
  const { id: userId, avatar } = useSelector(
    (state) => state.authUserData.userData
  );

  function submitHandler() {
    if (!is_mounted_in_group_page) {
      console.log("alsohere");
      dispatch(createAnswer({ post_id, original_content: answer })).then(
        (resp) => {
          console.log("asdasd", resp);
          const { first_name, last_name, nick_name } = JSON.parse(
            Cookies.get("userData")
          );
          const newAnswer = {
            id: resp.payload.id,
            created_by: {
              first_name: first_name,
              last_name: last_name,
              nick_name: nick_name,
              avatar: avatar,
            },
            number_of_likes: 0,
            liked: false,
            created_at: Date.now(),
            original_content: answer,
          };
          handleNewAnswer(newAnswer);
        }
      );
    } else {
      // creating new post but for specific group
      postNewPost(userId, answer, post_id.id).then((response) => {
        if (response.status === 201) {
          successCreatedComment();
        }
      });
    }
  }

  return (
    <CreateFormComponent setAnswer={setAnswer} submitHandler={submitHandler} />
  );
}
export default CreateCommentComponent;
