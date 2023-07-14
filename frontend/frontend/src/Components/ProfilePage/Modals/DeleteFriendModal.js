import React from "react";
import { Button, Modal } from "react-bootstrap";
import { deleteFriend } from "../../../apicalls/api_friends_calls";
import { deleteFriendReducer } from "../../../features/authSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

function DeleteFriendModal({ hide, show, setIsFriend }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const deleteFriendHandle = () => {
    deleteFriend(id)
      .then((response) => {
        if (response.status === 204) {
          dispatch(deleteFriendReducer(id));
          setIsFriend(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    hide();
  };

  return (
    <Modal show={show} onHide={() => hide()} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "black" }}>
        Are you sure you want to delete this friend?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => hide()}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => deleteFriendHandle()}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteFriendModal;
