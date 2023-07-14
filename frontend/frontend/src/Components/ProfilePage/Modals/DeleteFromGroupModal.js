import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getGroupsBasedOnURL } from "../../../apicalls/api_group_calls";
import { useParams } from "react-router-dom";

function DeleteFromGroupModal({ show, hide, handleSubmit }) {
  const { id } = useParams();
  const [groupsToRender, setGroupsToRender] = useState([]);
  const { groups } = useSelector((state) => state.groups);
  const [selectedOption, setSelectedOption] = useState([]);

  const handleSelectChange = (event) => {
    const selectedObject = event.target.value;
    setSelectedOption(selectedObject);
  };

  useEffect(() => {
    getGroupsBasedOnURL(id)
      .then((response) => {
        if (response.status === 200) {
          const duplicates = groups.filter((group) =>
            response.data.some(
              (item) => item.id === group.id && item.name === group.name
            )
          );
          setGroupsToRender(duplicates);
        }
      })
      .catch((error) => console.log(error));
  }, [id]);

  return (
    <Modal show={show} onHide={() => hide()} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>
          Delete member from group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "black" }}>
        Select group to delete member
        <Form.Select value={selectedOption} onChange={handleSelectChange}>
          <option value="" disabled>
            Choose an option...
          </option>
          {groupsToRender.length !== 0 && groupsToRender !== undefined ? (
            groupsToRender.map((group) => (
              <option value={group.id}>{group.name}</option>
            ))
          ) : (
            <option disabled selected>
              You don't have any same groups
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
            variant="danger"
            onClick={() =>
              handleSubmit({
                user_to_delete_id: id,
                group_id: selectedOption,
              })
            }
          >
            Delete member
          </Button>
        ) : (
          <Button variant="danger" disabled>
            Delete member
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteFromGroupModal;
