import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGroups, createGroup } from "../apicalls/api_group_calls";

const initialState = {
  groups: sessionStorage.getItem("groups")
    ? JSON.parse(sessionStorage.getItem("groups"))
    : [],
  loading: false,
  error: false,
};

export const getGroupsAT = createAsyncThunk("groups/get", async () => {
  const response = await getGroups();
  return response;
});

export const createGroupAT = createAsyncThunk(
  "groups/create",
  async (data, thunkAPI) => {
    try {
      const response = await createGroup({ data: data });
      return response.status;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    removeGroup: (state, payload) => {
      const group_id = payload.payload;
      const groups = [...state.groups];
      const updated_groups = groups.filter((group) => group.id !== group_id);
      sessionStorage.setItem("groups", JSON.stringify(updated_groups));
      return {
        ...state,
        groups: updated_groups,
      };
    },
  },
  extraReducers: {
    [getGroupsAT.pending]: (state) => {
      state.loading = true;
    },
    [getGroupsAT.fulfilled]: (state, payload) => {
      console.log("fulfilled");
      state.loading = false;
      state.groups = payload.payload;
      sessionStorage.setItem("groups", JSON.stringify(payload.payload));
    },
    [getGroupsAT.rejected]: (state, payload) => {
      state.loading = false;
      state.error = payload.error.message;
    },
  },
});
export const { removeGroup } = groupsSlice.actions;
export const getGroupsATReducer = groupsSlice.reducer;
