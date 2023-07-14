import React from "react";
import { Form, Button } from "react-bootstrap";

function CreatePostForm({ content, setContent, submitHandler }) {
  return (
    <Form>
      <Form.Group
        className="mb-3"
        controlId="exampleForm.ControlTextarea1"
        style={{ display: "flex", alignItems: "flex-end" }}
      >
        <Form.Control
          className="create-post-form"
          style={{
            backgroundColor: "rgb(28,42,58)",
            color: "white",
            // border: "white",
          }}
          as="textarea"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Form.Group>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="dark"
          size="md"
          className="mt-0"
          onClick={submitHandler}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default CreatePostForm;
