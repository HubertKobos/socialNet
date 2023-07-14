import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import {
  getPost,
  createAnswerForPost,
  getDislikePost,
  getLikePost,
  getAllTablePosts,
} from "../apicalls/api_posts_calls";

const initialState = {
  posts: sessionStorage.getItem("posts")
    ? JSON.parse(sessionStorage.getItem("posts"))
    : [],
  loading: false,
  error: false,
  areAllUserPostsRendered: sessionStorage.getItem("areAllUserPostsRendered")
    ? JSON.parse(sessionStorage.getItem("areAllUserPostsRendered"))
    : false,
};

export const getPosts = createAsyncThunk(
  "post/get",
  async (offsetLimitParams) => {
    const response = await getAllTablePosts(offsetLimitParams);
    return { data: response.data, status: response.status };
  }
);

export const getSpecificPost = createAsyncThunk(
  "post/getSpecific",
  async (id) => {
    const response = await getPost(id);
    return response;
  }
);

export const likePost = createAsyncThunk(
  "post/like",
  async (postId, thunkAPI) => {
    try {
      const response = await getLikePost(
        JSON.parse(Cookies.get("userData"))["id"],
        postId
      );
      if (response.status === 200) {
        const posts = JSON.parse(sessionStorage.getItem("posts"));
        const postToUpdate = posts.find((post) => post.id === postId);
        postToUpdate.liked = true;
        postToUpdate.number_of_likes += 1;
        const updatedPosts = posts.map((p) =>
          p.id === postToUpdate.id ? postToUpdate : p
        );
        sessionStorage.setItem("posts", JSON.stringify(updatedPosts));
        return updatedPosts;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const dislikePost = createAsyncThunk(
  "post/dislike",
  async (postId, thunkAPI) => {
    try {
      const response = await getDislikePost(
        JSON.parse(Cookies.get("userData"))["id"],
        postId
      );
      if (response.status === 200) {
        const posts = JSON.parse(sessionStorage.getItem("posts"));
        const postToUpdate = posts.find((post) => post.id === postId);
        postToUpdate.liked = false;
        postToUpdate.number_of_likes -= 1;
        const updatedPosts = posts.map((p) =>
          p.id === postToUpdate.id ? postToUpdate : p
        );
        sessionStorage.setItem("posts", JSON.stringify(updatedPosts));
        return updatedPosts;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const createAnswer = createAsyncThunk(
  "post/createAnswer",
  async (data, thunkAPI) => {
    try {
      const response = await createAnswerForPost(
        data.post_id.id,
        data.original_content
      );
      if (response.status === 200) {
        const posts = JSON.parse(sessionStorage.getItem("posts"));
        const postToUpdate = posts.find((post) => post.id === data.post_id.id);
        postToUpdate.number_of_answers = postToUpdate.number_of_answers + 1;
        const updatedPosts = posts.map((p) =>
          p.id === postToUpdate.id ? postToUpdate : p
        );
        sessionStorage.setItem("posts", JSON.stringify(updatedPosts));
        return { updatedPosts: updatedPosts, id: response.data.id };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addNewPost: (state, action) => {
      const { first_name, last_name, nick_name, avatar } = JSON.parse(
        Cookies.get("userData")
      );
      const newPost = {
        id: action.payload.id, // generating random id
        created_by: {
          first_name: first_name,
          last_name: last_name,
          nick_name: nick_name,
          avatar: avatar,
        },
        created_at: Date.now(),
        content: action.payload.content,
        number_of_likes: 0,
        number_of_answers: 0,
        liked: false,
        isFavourite: false,
      };
      state.posts = [newPost, ...state.posts];
      sessionStorage.setItem("posts", JSON.stringify(state.posts));
    },
    clearPosts: (state, action) => {
      state.posts = [];
      state.areAllUserPostsRendered = false;
      sessionStorage.removeItem("posts");
      sessionStorage.removeItem("areAllUserPostsRendered");
    },
  },
  extraReducers: {
    [getPosts.pending]: (state) => {
      state.loading = true;
    },
    [getPosts.fulfilled]: (state, payload) => {
      state.loading = false;
      if (payload.payload.status === 204) {
        state.areAllUserPostsRendered = true;
        sessionStorage.setItem(
          "areAllUserPostsRendered",
          state.areAllUserPostsRendered
        );
      }
      if (payload.payload.data.length !== 0 && !state.areAllUserPostsRendered) {
        if (sessionStorage.getItem("posts") !== null) {
          if (
            JSON.stringify(payload.payload.data[0].id) !==
              JSON.stringify(
                JSON.parse(sessionStorage.getItem("posts"))[0].id
              ) &&
            JSON.stringify(
              payload.payload.data[payload.payload.data.length - 1].id
            ) !==
              JSON.stringify(
                JSON.parse(sessionStorage.getItem("posts"))[
                  JSON.parse(sessionStorage.getItem("posts")).length - 1
                ].id
              )
          ) {
            state.posts = [...state.posts, ...payload.payload.data];
            sessionStorage.setItem("posts", JSON.stringify(state.posts));
          }
        } else {
          state.posts = payload.payload.data;
          sessionStorage.setItem("posts", JSON.stringify(state.posts));
        }
      }
    },
    [getPosts.rejected]: (state, payload) => {
      state.loading = false;
      state.error = payload.error.message;
    },
    [getSpecificPost.pending]: (state) => {
      state.loading = true;
    },
    [getSpecificPost.fulfilled]: (state, payload) => {
      state.loading = false;
      state.posts = [...state.posts, payload.payload];
      sessionStorage.setItem("posts", JSON.stringify(state.posts));
    },
    [getSpecificPost.rejected]: (state, payload) => {
      state.loading = false;
      state.error = payload.error.message;
    },
    [likePost.fulfilled]: (state, payload) => {
      state.posts = payload.payload;
    },
    [dislikePost.fulfilled]: (state, payload) => {
      state.posts = payload.payload;
    },
    [createAnswer.fulfilled]: (state, payload) => {
      state.posts = payload.payload.updatedPosts;
    },
  },
});

export const { addNewPost, clearPosts } = postSlice.actions;
export const getPostsReducer = postSlice.reducer;
