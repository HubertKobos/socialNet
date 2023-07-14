import React from "react";
import { Alert, Spinner, Form, Button, Modal } from "react-bootstrap";

function CreateGroupModal({
  show,
  setShow,
  setName,
  loading,
  error,
  handleSubmit,
  isPrivate,
  setIsPrivate,
}) {
  return (
    <Modal
      show={show}
      centered={true}
      className="loginModal"
      onHide={() => setShow(false)}
    >
      <Modal.Header style={{ justifyContent: "center" }}>
        <Modal.Title>Create your group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="email">
            <Form.Label className="d-flex justify-content-center">
              Name of the group
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name"
              className="text-center mb-3"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPrivate">
            <Form.Check
              type="checkbox"
              label="Private"
              value={isPrivate}
              className="d-flex justify-content-center"
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          {loading && <Spinner animation="border" />}
          {error && (
            <Alert className="mt-2" variant="danger">
              {error} try later
            </Alert>
          )}
          <Button
            variant="dark"
            style={{ width: "100%" }}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateGroupModal;
