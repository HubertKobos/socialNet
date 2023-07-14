import React from "react";
import { Form, Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchFriendForm({ query, handleSearch, results, userData }) {
  const navigate = useNavigate();

  return (
    <div>
      <Form style={{ maxWidth: "400px" }} className="mx-auto mt-3">
        <Form.Control
          type="text"
          placeholder="Look for friends"
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
      <Dropdown>
        {results?.length > 0 &&
          results.map((result, index) => {
            if (result.id !== userData.id) {
              return (
                <Dropdown.Item key={index} style={{ textAlign: "center" }}>
                  <h4 onClick={() => navigate(`/profile/${result.id}`)}>
                    <Image
                      style={{
                        width: "100px",
                        height: "100px",
                        marginRight: "15px",
                      }}
                      src={result.avatar}
                      roundedCircle
                    />
                    {result.first_name} {result.last_name}
                  </h4>
                </Dropdown.Item>
              );
            }
          })}
      </Dropdown>
    </div>
  );
}

export default SearchFriendForm;
