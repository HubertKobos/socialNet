import React from "react";
import ColumnLayout from "./ColumnLayout";
import SpecificGroupComponent from "../Components/SpecificGroupPage/SpecificGroupComponent";

function SpecificGroupPage() {
  return (
    <div>
      <ColumnLayout middleColumn={<SpecificGroupComponent />} />
    </div>
  );
}

export default SpecificGroupPage;
