import React from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteGroupModal({ show, hide, handleDeleteGroup }) {
  return (
    <Modal show={show} onHide={() => hide()} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "black" }}>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "black" }}>
        Are you sure you want to delete this group?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => hide()}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => handleDeleteGroup()}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteGroupModal;
