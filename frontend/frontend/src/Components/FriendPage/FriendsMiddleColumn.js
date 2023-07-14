import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { getUsers } from "../../apicalls/api_search_calls";
import { getFriendsList } from "../../apicalls/api_friends_calls";
import { useDispatch, useSelector } from "react-redux";
import FriendComponent from "./FriendComponent";
import { fetchFriendList } from "../../features/authSlice";
import SearchFriendForm from "./Forms/SearchFriendForm";

function FriendsMiddleColumn() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { userData } = useSelector((state) => state.authUserData);
  const { friends } = useSelector((state) => state.authUserData);

  const onSearch = async (query) => {
    // Make an API call to search for results based on the query
    // and update the results state with the response
    await getUsers(query)
      .then((data) => setResults(data))
      .catch(function (error) {
        throw error;
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== "") {
        onSearch(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    getFriendsList()
      .then((resp) => {
        if (resp.status === 200) {
          dispatch(fetchFriendList(resp.data));
        }
        if (resp.status === 204) {
          dispatch(fetchFriendList(resp.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  return (
    <>
      <SearchFriendForm
        query={query}
        handleSearch={handleSearch}
        results={results}
        userData={userData}
      />
      {friends.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3vh",
          }}
        >
          <p style={{ fontSize: "25px" }}>You have no friends yet!</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3vh",
          }}
        >
          <Row>
            {friends?.map((friend) => (
              <Col md={6} key={friend.id}>
                <FriendComponent friend={friend} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
}

export default FriendsMiddleColumn;
