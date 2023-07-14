import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { createGroupAT } from "../../features/groupsSlice";
import GroupComponent from "./GroupComponent";
import { Row, Col } from "react-bootstrap";
import { getGroupsAT } from "../../features/groupsSlice";
import CreateGroupModal from "./Modals/CreateGroupModal";

function GroupMiddleColumn() {
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.groups);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: add validation - name of the group should be char limitted
    const resp = dispatch(createGroupAT({ name: name, isPrivate: isPrivate }));
    resp.then(function (response) {
      if (response.payload === 200) {
        setShow(false);
        dispatch(getGroupsAT());
      }
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          marginBottom: "10px",
          justifyContent: "right",
          marginRight: "5px",
        }}
      >
        <Button variant="dark" onClick={() => setShow(true)}>
          Create new group
        </Button>
      </div>
      {groups.length !== 0 && Array.isArray(groups) ? (
        <Row>
          {groups?.map((group) => (
            <Col md={6} key={group.id}>
              <GroupComponent key={group.id} data={group} />
            </Col>
          ))}
        </Row>
      ) : (
        <h1
          style={{
            fontSize: "25px",
            marginTop: "20px",
          }}
        >
          You aren't a member of any group ! Would you like to
          <p
            style={{
              fontSize: "25px",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => setShow(true)}
          >
            create your own ?
          </p>
        </h1>
      )}
      <CreateGroupModal
        show={show}
        setShow={setShow}
        setName={setName}
        loading={loading}
        error={error}
        handleSubmit={handleSubmit}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
      />
    </>
  );
}

export default GroupMiddleColumn;
