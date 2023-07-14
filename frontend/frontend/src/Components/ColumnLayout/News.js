import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNews } from "../../features/newsSlice";
import Card from "react-bootstrap/Card";
import { Spinner } from "react-bootstrap";

function News() {
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector((state) => state.news);

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        news["articles"] &&
        news["articles"]?.map((article) => (
          <Card
            className="mb-3"
            key={article.url}
            bg="dark"
            text="light"
            style={{ cursor: "pointer" }}
            onClick={() => window.open(article.url, "_blank")}
          >
            <Card.Img variant="top" src={article.urlToImage} />
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default News;
