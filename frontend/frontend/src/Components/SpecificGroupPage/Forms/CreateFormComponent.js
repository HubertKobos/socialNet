import React from "react";
import { Form, Button } from "react-bootstrap";

function CreateFormComponent({ setAnswer, submitHandler }) {
  return (
    <Form style={{ marginTop: "10px" }}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Control
          style={{ backgroundColor: "rgb(28,42,58)", color: "white" }}
          as="textarea"
          rows={3}
          placeholder="Write an answer..."
          onChange={(e) => setAnswer(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="dark"
            size="md"
            className="mt-2"
            onClick={() => submitHandler()}
          >
            Submit
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}

export default CreateFormComponent;
