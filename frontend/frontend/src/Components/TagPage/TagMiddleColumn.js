import React from "react";
import PostComponent from "../PostPage/PostComponent";

function TagMiddleColumn({ posts }) {
  return (
    <>
      {posts?.map((post) => (
        <PostComponent content={post} />
      ))}
    </>
  );
}

export default TagMiddleColumn;
