import { useState, useEffect, isValidElement } from "react";
import { Form, Button, Modal, FormGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { registerUser } from "../apicalls/api_users_calls";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const { userData, loading, error } = useSelector(
    (state) => state.authUserData
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickName, setNickName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isAdult, setIsAdult] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setWrongPassword(false);
      const resp = await registerUser({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        nick_name: nickName,
        date_of_birth: birthDate,
      });
      if (!axios.isAxiosError(resp)) {
        navigate("/login");
      } else {
        if (resp.response.data.detail) {
          setErrorMessage(resp.response.data.detail);
        } else setErrorMessage(resp.message);
      }
    } else {
      setWrongPassword(true);
      setPassword("");
      setConfirmPassword("");
    }
  };
  useEffect(() => {
    setNickName(firstName + lastName);
    // check if the user is over 18 (based on years)
    if (
      Math.abs(
        new Date(birthDate).getUTCFullYear() - new Date().getUTCFullYear()
      ) <= 18
    ) {
      setIsAdult(false);
    } else {
      setIsAdult(true);
    }
  }, [firstName, lastName, birthDate]);

  return (
    <>
      <Modal show={show} centered={true} className="loginModal">
        <Modal.Header style={{ justifyContent: "center" }}>
          <Modal.Title>Create new account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
              </Form.Group>

              <Form.Group as={Col} className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                />
              </Form.Group>
            </Row>
            <Row>
              <FormGroup className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup as={Col} className="mb-3">
                <Form.Label>Nick name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>@</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="NickName"
                    onChange={(e) => setNickName(e.target.value)}
                    value={nickName}
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup as={Col} className="mb-3">
                <Form.Label>Date of birth</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  isInvalid={!isAdult}
                />
                {isValidElement && (
                  <Form.Control.Feedback type="invalid">
                    You must be at least 18 years old.
                  </Form.Control.Feedback>
                )}
              </FormGroup>
            </Row>

            <div style={{ display: "flex" }}>
              <Button variant="dark" type="submit" style={{ width: "100%" }}>
                Register
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>Already have an account ?</p>
            <p
              style={{
                textDecoration: "underline",
                marginLeft: "4px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Log in
            </p>
          </div>
          <div>
            {wrongPassword && (
              <Alert variant="danger">Passwords aren't the same!</Alert>
            )}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {!isAdult && (
              <Alert variant="danger">You have to be an adult!</Alert>
            )}
          </div>
          {/* <div>TODO: Pottential error</div> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginPage;
