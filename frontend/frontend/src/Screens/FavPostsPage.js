import React, { useEffect, useState } from "react";
import { getFavPosts } from "../apicalls/api_posts_calls";
import ColumnLayout from "./ColumnLayout";
import PostComponent from "../Components/PostPage/PostComponent";
import { Spinner } from "react-bootstrap";

function FavPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFavPosts()
      .then((response) => {
        if (response.status === 200) {
          setPosts(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <ColumnLayout
      middleColumn={
        <div
          style={{
            marginTop: "3vh",
            fontSize: "25px",
          }}
        >
          {loading ? (
            <Spinner />
          ) : (
            posts.length === 0 && (
              <p>You don't have any favourite posts yet !</p>
            )
          )}
          {posts?.map((post) => (
            <PostComponent key={post.id} content={post} />
          ))}
        </div>
      }
    />
  );
}

export default FavPostsPage;
