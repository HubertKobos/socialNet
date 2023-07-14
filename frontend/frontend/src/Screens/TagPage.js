import React, { useEffect, useState } from "react";
import ColumnLayout from "./ColumnLayout";
import TagMiddleColumn from "../Components/TagPage/TagMiddleColumn";
import { getPostsForSpecificTag } from "../apicalls/api_search_calls";
import { useParams } from "react-router-dom";

function TagPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPostsForSpecificTag(id)
      .then(function (response) {
        setPosts(response);
      })
      .catch(function (error) {
        return error;
      });
  }, []);
  return <ColumnLayout middleColumn={<TagMiddleColumn posts={posts} />} />;
}

export default TagPage;
