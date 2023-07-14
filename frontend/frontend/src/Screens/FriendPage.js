import React from "react";
import ColumnLayout from "./ColumnLayout";
import FriendsMiddleColumn from "../Components/FriendPage/FriendsMiddleColumn";

function FriendPage() {
  return (
    <ColumnLayout
      middleColumn={<FriendsMiddleColumn />}
      SearchTagsGroupsExist={false}
    />
  );
}

export default FriendPage;
