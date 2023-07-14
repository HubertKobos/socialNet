import React from "react";
import ColumnLayout from "./ColumnLayout";
import ProfileMiddleColumn from "../Components/ProfilePage/ProfileMiddleColumn";

function ProfilePage() {
  return (
    <ColumnLayout
      RightColumnExist={false}
      middleColumn={<ProfileMiddleColumn />}
    />
  );
}

export default ProfilePage;
