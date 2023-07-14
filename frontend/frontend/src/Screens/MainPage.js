import React from "react";
import ColumnLayout from "./ColumnLayout";
import MainMiddleColumn from "../Components/MainPage/MainMiddleColumn";

function MainPage() {
  return <ColumnLayout middleColumn={<MainMiddleColumn />} />;
}

export default MainPage;
