import React, { useEffect } from "react";
import ColumnLayout from "./ColumnLayout";
import { getGroupsAT } from "../features/groupsSlice";
import { useDispatch } from "react-redux";
import GroupMiddleColumn from "../Components/GroupPage/GroupMiddleColumn";

function GroupPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGroupsAT());
  }, []);

  return <ColumnLayout middleColumn={<GroupMiddleColumn />} />;
}

export default GroupPage;
