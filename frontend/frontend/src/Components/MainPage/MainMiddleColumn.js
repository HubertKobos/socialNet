import React, { useEffect, useRef, useState } from "react";
import CreatePostComponent from "../PostPage/CreatePostComponent";
import PostComponent from "../PostPage/PostComponent";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { clearPosts, getPosts } from "../../features/postsSlice";

function MainMiddleColumn() {
  const dispatch = useDispatch();
  const offsetRef = useRef(0);
  const limitRef = useRef(20);
  const { posts, loading, error, areAllUserPostsRendered } = useSelector(
    (state) => state.posts
  );
  const loadingRef = useRef(loading);
  const [prevPostsLength, setPrevPostsLength] = useState(0);

  const handleScroll = () => {
    console.log(!areAllUserPostsRendered, "ref", !loadingRef.current, !loading);
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const isScrolledToBottom = scrollTop + clientHeight === scrollHeight;

    // isScrolledToBottom when the backend returns code 204 is not changing it position that's why this function reexecute itself once again
    if (isScrolledToBottom && !areAllUserPostsRendered && !loadingRef.current) {
      offsetRef.current += 20;
      limitRef.current += 20;

      dispatch(
        getPosts({ offset: offsetRef.current, limit: limitRef.current })
      ).then((resp) => {
        setPrevPostsLength(resp.payload.data.length);
      });
    }
  };

  useEffect(() => {
    // Update the loadingRef value whenever loading changes
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const handlePageRefresh = () => {
      // Check if the page was refreshed
      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length && navigationEntries[0].type === "reload") {
        dispatch(clearPosts());
      }
    };
    // Attach the event listener
    window.addEventListener("beforeunload", handlePageRefresh);

    // Clean up the event listener
    return () => {
      window.removeEventListener("beforeunload", handlePageRefresh);
    };
  }, []);

  useEffect(() => {
    if (!areAllUserPostsRendered && !loading) {
      dispatch(
        getPosts({ offset: offsetRef.current, limit: limitRef.current })
      );
    }
    // clear all the posts when component unmounts so whenever i access the post column i'll have updated data from database
    return () => {
      dispatch(clearPosts());
    };
  }, []);

  // const posts = [];
  // const loading = false;
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offsetRef.current, limitRef.current]);

  return (
    <div>
      <CreatePostComponent />
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {posts.map((post) => (
            <PostComponent key={post.id} content={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MainMiddleColumn;
