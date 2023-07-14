import React, { useEffect, useState, useRef } from "react";
import ColumnLayout from "./ColumnLayout";
import PostComponent from "../Components/PostPage/PostComponent";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAnswersForSpecificPost } from "../apicalls/api_posts_calls";

function PostPage() {
  const [answers, setAnswers] = useState([]);

  const { id } = useParams();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const offsetRef = useRef(0);
  const limitRef = useRef(20);
  const [isMoreAnswersInDb, setIsMoreAnswersInDb] = useState(false);

  const post = posts?.find((post) => post.id == id);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const isScrolledToBottom = scrollTop + clientHeight === scrollHeight;
    console.log(isScrolledToBottom);
    if (isScrolledToBottom && !isMoreAnswersInDb) {
      offsetRef.current += 20;
      limitRef.current += 20;

      getAnswers();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offsetRef.current, limitRef.current]);

  const getAnswers = async () => {
    await getAnswersForSpecificPost(id, offsetRef.current, limitRef.current)
      .then((response) => {
        if (response.status === 200) {
          setAnswers((prev) => [...prev, ...response.data]);
        } else if (response.status === 204) {
          setIsMoreAnswersInDb(true);
        }
      })
      .catch((error) => console.log(error));
  };
  const handleNewAnswer = (new_answer) => {
    setAnswers((prev) => [new_answer, ...prev]);
  };

  useEffect(() => {
    getAnswers();
  }, []);
  return (
    <>
      {!loading && (
        <ColumnLayout
          RightColumnExist={true}
          middleColumn={
            <PostComponent
              content={post}
              renderComments={true}
              answersToRender={answers}
              handleNewAnswer={handleNewAnswer}
            />
          }
        />
      )}
    </>
  );
}

export default PostPage;
