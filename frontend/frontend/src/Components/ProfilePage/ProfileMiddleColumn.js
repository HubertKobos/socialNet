import React, { useEffect, useContext, useState } from "react";
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { BsGear } from "react-icons/bs";
import PostComponent from "../PostPage/PostComponent";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import EditProfileModal from "./Modals/EditProfileModal";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { acceptFriendInvite } from "../../features/authSlice";
import DeleteFriendModal from "./Modals/DeleteFriendModal";
import { deleteFriendRequestNotification } from "../../features/notificationsSlice";
import { WebSocketContext } from "../../Wrappers/WebSocketProvider";
import AddToGroupModal from "./Modals/AddToGroupModal";
import DeleteFromGroupModal from "./Modals/DeleteFromGroupModal";
import {
  addNewGroupMember,
  deleteGroupMember,
} from "../../apicalls/api_group_calls";
import {
  acceptFriendInvitation,
  inviteFriend,
} from "../../apicalls/api_request_calls";
import { getProfile } from "../../apicalls/api_users_calls";

function ProfileMiddleColumn() {
  const dispatch = useDispatch();
  const {
    id: auth_user_id,
    first_name,
    last_name,
    nick_name,
    bio,
    date_of_birth,
    avatar,
  } = useSelector((state) => state.authUserData.userData);
  const socket = useContext(WebSocketContext);
  const { id } = useParams();
  const [deleteModal, setDeleteModal] = useState(false);
  const [data, setData] = useState();
  const [spinner, setSpinner] = useState(true);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [friendInvitationExists, setFriendInvitationExists] = useState(false); // if the authenticated currenlty user already sent the friend request
  const [
    friendInvitationFromRequestedUserExists,
    setFriendInvitationFromRequestedUserExists,
  ] = useState(false); // if the authenticated user has sent the friend request to the user currently looking on
  const [isFriend, setIsFriend] = useState(false); // if the autenticated user is friend already with user currently looking on
  const [authenticatedUserPage, setAuthenticatedUserPage] = useState(false); // is the id in url params belongs to auth user
  const [addMemberToGroupModal, setAddMemberToGroupModal] = useState(false);
  const [deleteMemberFromGroup, setDeleteMemberFromGroup] = useState(false);

  const { id: authenticated_user_id } = useSelector(
    (state) => state.authUserData.userData
  );

  useState(() => {
    if (id === auth_user_id || id === "" || id === undefined) {
      setAuthenticatedUserPage(true);
    } else {
      setAuthenticatedUserPage(false);
    }
  }, [id]);

  const inviteHandler = () => {
    inviteFriend(id).then(function (response) {
      if (response.status === 201) {
        setFriendInvitationExists(true);
        if (socket) {
          socket.send(
            JSON.stringify({ type: "friend_request", to_user_id: id })
          );
        }
      }
    });
  };

  const acceptInvitationHandler = () => {
    acceptFriendInvitation(id).then((response) => {
      if (response.status === 200) {
        dispatch(acceptFriendInvite(response.data));
        setIsFriend(true);
        dispatch(deleteFriendRequestNotification(id));
      }
    });
  };

  const closeModal = () => {
    setEditProfileModal(false);
  };

  const closeDeleteFriendModal = () => {
    setDeleteModal(false);
  };

  const closeAddGroupModal = () => {
    setAddMemberToGroupModal(false);
  };

  const handleAddToGroupSubmit = (group_user_data) => {
    addNewGroupMember(group_user_data).then((response) => {
      if (response.status === 201) {
        setAddMemberToGroupModal(false);
      }
    });
  };

  const closeDeleteGroupModal = () => {
    setDeleteMemberFromGroup(false);
  };

  const handleDeleteFromGroupSubmit = (group_user_data) => {
    deleteGroupMember(group_user_data).then((response) => {
      if (response.status === 200) {
        setDeleteMemberFromGroup(false);
      }
    });
  };

  // handle 404 code
  useEffect(() => {
    getProfile(id)
      .then((data) => {
        if (data !== undefined) {
          setData(data);
          setFriendInvitationExists(data.friend_invitation_exists);
          setFriendInvitationFromRequestedUserExists(
            data.friend_invitation_from_requested_user_exists
          );
          setIsFriend(data.is_friend);
          setSpinner(false);
        }
      })
      .catch(function (error) {
        throw error;
      });
  }, [id]);

  return spinner ? (
    <Spinner />
  ) : (
    <Container>
      {deleteModal && (
        <DeleteFriendModal
          hide={closeDeleteFriendModal}
          show={deleteModal}
          setIsFriend={setIsFriend}
        />
      )}
      {editProfileModal && (
        <EditProfileModal
          hide={() => closeModal()}
          show={editProfileModal}
          userInfo={data}
        />
      )}
      {addMemberToGroupModal && (
        <AddToGroupModal
          hide={() => closeAddGroupModal()}
          show={addMemberToGroupModal}
          handleSubmit={(group_user_data) =>
            handleAddToGroupSubmit(group_user_data)
          }
        />
      )}
      {deleteMemberFromGroup && (
        <DeleteFromGroupModal
          hide={() => closeDeleteGroupModal()}
          show={deleteMemberFromGroup}
          handleSubmit={(group_user_data) =>
            handleDeleteFromGroupSubmit(group_user_data)
          }
        />
      )}
      <Row
        style={{
          backgroundColor: "black",
          height: "25vh",
          position: "relative",
        }}
      >
        <Row
          style={{
            backgroundColor: "#0e1111",
            height: "15vh",
            position: "relative",
          }}
        >
          <div style={{ display: "flex" }}>
            {!isFriend &&
              !data.authenticated_user &&
              !friendInvitationExists &&
              !friendInvitationFromRequestedUserExists && (
                <Button
                  style={{
                    marginLeft: "83%",
                    maxWidth: "10vw",
                    maxHeight: "3vw",
                    marginTop: "8px",
                  }}
                  variant="dark"
                  onClick={() => {
                    inviteHandler();
                  }}
                >
                  Invite a friend
                </Button>
              )}
            {friendInvitationExists &&
              !isFriend &&
              !friendInvitationFromRequestedUserExists && (
                <p
                  style={{
                    marginLeft: "83%",
                    maxWidth: "10vw",
                    maxHeight: "3vw",
                    marginTop: "5px",
                  }}
                >
                  Friend invitation already sent
                </p>
              )}
            {friendInvitationFromRequestedUserExists &&
              !isFriend &&
              !friendInvitationExists && (
                <Button
                  style={{
                    marginLeft: "83%",
                    maxWidth: "8vw",
                    maxHeight: "4vw",
                    marginTop: "5px",
                  }}
                  variant="dark"
                  onClick={() => {
                    acceptInvitationHandler();
                  }}
                >
                  Accept friend request
                </Button>
              )}
            {data.id === authenticated_user_id && (
              <Button
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "3%",
                  maxWidth: "10px",
                  backgroundColor: "#0e1111",
                  border: "none",
                }}
              >
                <BsGear
                  size={24}
                  onClick={() => setEditProfileModal((prev) => !prev)}
                />
              </Button>
            )}
          </div>
        </Row>

        <Row>
          <Col style={{ maxWidth: "22vh", maxHeight: "22vh" }}>
            <Image
              style={{
                position: "absolute",
                bottom: "0",
                maxHeight: "22vh",
                maxWidth: "22vh",
                borderRadius: "10%",
              }}
              src={authenticatedUserPage ? avatar : data.avatar}
            />
          </Col>
          <Col>
            <h2
              className="ProfileName"
              style={{
                color: "white",
                position: "absolute",
                top: "5vh",
              }}
            >
              {authenticatedUserPage
                ? `${first_name} ${last_name}`
                : `${data.first_name} ${data.last_name}`}
              {!data.authenticated_user && isFriend && (
                <Dropdown as={ButtonGroup} style={{ marginLeft: "7px" }}>
                  <Dropdown.Toggle
                    split
                    variant="dark"
                    id="dropdown-split-basic"
                  />

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => setAddMemberToGroupModal(true)}
                    >
                      Add member to group
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setDeleteMemberFromGroup(true)}
                    >
                      Delete member from group
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setDeleteModal(true)}>
                      Delete Friend
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <p className="ProfileCity" style={{ marginTop: "7px" }}>
                {data.country.code !== "" &&
                  data.country.code !== undefined &&
                  data.country.code !== null &&
                  (data.city, data.country.code)}
              </p>
            </h2>
            <Row
              style={{ justifyContent: "right" }}
              xxl={12}
              lg={12}
              md={3}
              sm={1}
            >
              <Col className="ProfilePostsColumn">
                <Row>
                  <h2 style={{ textAlign: "center" }}>Posts</h2>
                </Row>
                <Row>
                  <h2 style={{ textAlign: "center" }}>
                    {data.number_of_posts}
                  </h2>
                </Row>
              </Col>
              <Col className="ProfileFollowersColumn">
                <Row>
                  <h2 style={{ textAlign: "center" }}>Groups</h2>
                </Row>
                <Row>
                  <h2 style={{ textAlign: "center" }}>
                    {data.number_of_groups}
                  </h2>
                </Row>
              </Col>
              <Col className="ProfileFollowingColumn">
                <Row>
                  <h2 style={{ textAlign: "center" }}>Friends</h2>
                </Row>
                <Row>
                  <h2 style={{ textAlign: "center" }}>
                    {data.number_of_friends}
                  </h2>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
      <Row style={{ backgroundColor: "#0e1111", marginTop: "3vw" }}>
        <h1 style={{ marginTop: "1vw", marginLeft: "1vw", fontSize: "32px" }}>
          About:
        </h1>
        <h3
          style={{
            marginTop: "1vh",
            marginLeft: "1vw",
            fontSize: "22px",
            marginBottom: "3vh",
          }}
        >
          {authenticatedUserPage ? bio : data.bio}
        </h3>
      </Row>
      <Row style={{ backgroundColor: "#0e1111", marginTop: "3vw" }}>
        <h1
          style={{
            marginTop: "1vw",
            marginLeft: "1vw",
            marginBottom: "2vw",
            fontSize: "32px",
          }}
        >
          Recent activity
        </h1>

        {data.posts.map((post) => (
          <PostComponent key={post.id} content={post} renderComments={false} />
        ))}
      </Row>
    </Container>
  );
}

export default ProfileMiddleColumn;
