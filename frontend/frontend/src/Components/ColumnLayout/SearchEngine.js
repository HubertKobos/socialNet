import React, { useState, useEffect } from "react";
import { Form, Dropdown } from "react-bootstrap";
import { getOnSearch } from "../../apicalls/api_search_calls";
import { useNavigate } from "react-router-dom";

function SearchEngine() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const [groups, setGroups] = useState([]);
  const [tags, setTags] = useState([]);

  const onSearch = async (query) => {
    // Make an API call to search for results based on the query
    // and update the results state with the response
    await getOnSearch(query)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.tags) {
            setTags(response.data.tags);
          } else if (response.data.groups) {
            setGroups(response.data.groups);
          }
        }
      })
      .catch(function (error) {
        throw error;
      });
  };

  useEffect(() => {
    if (query === "") {
      setTags([]);
      setGroups([]);
    } else {
      const delayDebounceFn = setTimeout(() => {
        if (query !== "") {
          onSearch(query);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [query]);

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Form style={{ maxWidth: "400px", minWidth: "20vw", marginRight: "7vw" }}>
        <Form.Control
          type="text"
          placeholder="Look for tags and groups"
          className="mr-sm-2 rounded-pill mb-3 text-center"
          style={{
            background: "black",
            borderWidth: "3px",
            color: "whitesmoke",
          }}
          value={query}
          onChange={handleSearch}
        />
      </Form>
      <div
        style={{
          position: "absolute",
          // width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Dropdown style={{ position: "absolute", marginTop: "50px" }}>
          {tags?.length > 0
            ? tags.map((result, index) => (
                <Dropdown.Item
                  key={index}
                  style={{
                    minWidth: "20vw",
                    maxWidth: "400px",
                    backgroundColor: "rgb(31,43,58)",
                    display: "flex",
                    border: "1px solid rgb(111,111,111)",
                    borderRadius: "20px",
                    justifyContent: "center",
                    marginBottom: "3px",
                  }}
                  onClick={() => navigate(`/tag/${result.name}`)}
                >
                  <h4 style={{ fontSize: "20px" }}>
                    #{result.name}{" "}
                    <span style={{ color: "red", fontSize: "17px" }}>
                      {result.number_of_posts} posts
                    </span>
                  </h4>
                </Dropdown.Item>
              ))
            : groups?.length > 0 &&
              groups.map((result, index) => (
                <Dropdown.Item
                  key={index}
                  style={{
                    minWidth: "20vw",
                    maxWidth: "400px",
                    backgroundColor: "rgb(31,43,58)",
                    display: "flex",
                    border: "1px solid rgb(111,111,111)",
                    borderRadius: "20px",
                    justifyContent: "center",
                    marginBottom: "3px",
                  }}
                  onClick={() => navigate(`/group/${result.id}`)}
                >
                  <h4 style={{ fontSize: "20px" }}>{result.name}</h4>
                  <span
                    style={{
                      color: "red",
                      fontSize: "17px",
                      marginLeft: "5px",
                    }}
                  >
                    {result.is_private && "private group"}
                  </span>
                </Dropdown.Item>
              ))}
        </Dropdown>
      </div>
    </div>
  );
}

export default SearchEngine;
