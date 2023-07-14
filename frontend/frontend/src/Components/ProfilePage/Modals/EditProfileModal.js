import { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { editProfile } from "../../../apicalls/api_users_calls";
import { updateUserData } from "../../../features/authSlice";
import { useDispatch } from "react-redux";

function EditProfileModal({ hide, show, userInfo }) {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showBirth, setShowBirth] = useState(userInfo.date_of_birth);
  const [nickName, setNickName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("first_name", firstName);
    data.append("last_name", lastName);
    data.append("nick_name", nickName);
    data.append("bio", bio);
    data.append("date_of_birth", dateOfBirth);
    data.append("avatar", avatar);
    editProfile(data)
      .then((response) => {
        if (response.status === 200) {
          const serialized_data = {};
          for (let [key, value] of data.entries()) {
            if (value !== "") {
              serialized_data[key] = value;
            }
          }

          if (response.data.hasOwnProperty("updated_avatar_url")) {
            serialized_data["avatar"] = response.data["updated_avatar_url"];
            dispatch(updateUserData(serialized_data));
          } else {
            dispatch(updateUserData(serialized_data));
          }
          hide();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal show={show} centered={true} onHide={() => hide()}>
      <Modal.Header style={{ justifyContent: "center" }}>
        <Modal.Title style={{ color: "black" }}>Edit your profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="firstName">
            <Form.Label style={{ color: "black" }}>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder={userInfo.first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="lastName">
            <Form.Label style={{ color: "black" }}>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder={userInfo.last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="nickname">
            <Form.Label style={{ color: "black" }}>Nickname</Form.Label>
            <Form.Control
              type="text"
              name="nickname"
              placeholder={userInfo.nick_name}
              onChange={(e) => setNickName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="bio">
            <Form.Label style={{ color: "black" }}>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              placeholder={userInfo.bio ? userInfo.bio : ""}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="dob">
            <Form.Label style={{ color: "black" }}>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={showBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);
                setShowBirth(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group controlId="avatar">
            <Form.Label style={{ color: "black" }}>Avatar</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
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
          <Button
            variant="dark"
            onClick={handleSubmit}
            style={{ width: "100%" }}
          >
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProfileModal;
