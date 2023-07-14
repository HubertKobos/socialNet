import React, { useEffect, useState } from "react";
import CreateCommentComponent from "./CreateCommentComponent";
import { useParams } from "react-router-dom";
import PostComponent from "../PostPage/PostComponent";
import { Dropdown } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Spinner from "react-bootstrap/Spinner";
import DeleteGroupModal from "./Modals/DeleteGroupModal";
import { deleteGroup, getGroup } from "../../apicalls/api_group_calls";
import { useNavigate } from "react-router-dom";
import { removeGroup } from "../../features/groupsSlice";
import { useDispatch } from "react-redux";

function SpecificGroupComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createdComment, setCreatedComment] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [deleteGroupModal, setDeleteGroupModal] = useState(false);

  const commentCreatedSucessfuly = () => {
    setCreatedComment((prev) => !prev);
  };

  useEffect(() => {
    setLoading(true);
    // handle some loading comp and error message later onnn
    getGroup(id)
      .then((response) => {
        if (response.status === 200) {
          setData(response.data);
          setLoading(false);
        } else if (response.response.status === 403) {
          setLoading(false);
          setPermissionError(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [createdComment]);

  const hideDeleteGroupModal = () => {
    setDeleteGroupModal(false);
  };

  const handleDeleteGroup = () => {
    deleteGroup(id)
      .then((response) => {
        if (response.status === 200) {
          hideDeleteGroupModal();
          dispatch(removeGroup(id));
          navigate("/groups");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {deleteGroupModal && (
        <DeleteGroupModal
          show={deleteGroupModal}
          hide={hideDeleteGroupModal}
          handleDeleteGroup={handleDeleteGroup}
        />
      )}
      {loading ? (
        <Spinner />
      ) : permissionError ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ marginTop: "20px" }}>
            You don't have permission to visit this group!
          </h2>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "25px",
                marginTop: "10px",
                flex: 1,
                textAlign: "center",
              }}
            >
              {data.name}
            </h2>
            {data.is_auth_user_creator_of_group && (
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle
                  split
                  variant="dark"
                  id="dropdown-split-basic"
                />

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setDeleteGroupModal(true)}>
                    Delete group
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          <hr
            style={{ borderColor: "#FFFFFF", height: "10px", margin: "0px" }}
          />
          <div>
            <CreateCommentComponent
              is_mounted_in_group_page={true}
              successCreatedComment={commentCreatedSucessfuly}
            />
          </div>
          <hr />
          <div>
            {data.posts.map((post) => (
              <PostComponent key={post.id} content={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SpecificGroupComponent;
