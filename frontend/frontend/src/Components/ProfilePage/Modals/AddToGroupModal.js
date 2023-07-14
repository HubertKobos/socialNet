import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupsBasedOnURL } from "../../../apicalls/api_group_calls";

function AddToGroupModal({ show, hide, handleSubmit }) {
  const { id: user_to_add_id } = useParams();
  const { groups } = useSelector((state) => state.groups);
  const [selectedOption, setSelectedOption] = useState([]);
  const [groupsToRender, setGroupsToRender] = useState([]);

  const handleSelectChange = (event) => {
    const selectedObject = event.target.value;
    setSelectedOption(selectedObject);
  };

  useEffect(() => {
    getGroupsBasedOnURL(user_to_add_id)
      .then((response) => {
        if (response.status === 200) {
          const groups_to_rend = groups.filter((group) => {
            return !response.data.some((item) => item.id === group.id);
          });
          setGroupsToRender(groups_to_rend);
        } else if (response.status === 204) {
          setGroupsToRender(groups);
        }
      })
      .catch((error) => console.log(error));
  }, [user_to_add_id]);

  return (
    <Modal show={show} onHide={() => hide()} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>
          Add member to the group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "black" }}>
        Select group to add new member
        <Form.Select value={selectedOption} onChange={handleSelectChange}>
          <option value="" disabled>
            Choose an option...
          </option>
          {groupsToRender.length !== 0 && groups !== undefined ? (
            groupsToRender.map((group) => (
              <option value={group.id} key={group.id}>
                {group.name}
              </option>
            ))
          ) : (
            <option selected disabled>
              You don't have any created groups
            </option>
          )}
        </Form.Select>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => hide()}>
          Cancel
        </Button>
        {groupsToRender.length !== 0 && groupsToRender !== undefined ? (
          <Button
            variant="success"
            onClick={() =>
              handleSubmit({
                user_to_add_id: user_to_add_id,
                group_id: selectedOption,
              })
            }
          >
            Add member
          </Button>
        ) : (
          <Button variant="success" disabled>
            Add member
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AddToGroupModal;
