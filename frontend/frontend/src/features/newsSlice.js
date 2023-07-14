import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllNews } from "../apicalls/api_news_calls";

const initialState = {
  news: [],
  loading: false,
  error: false,
};

export const getNews = createAsyncThunk("news/get", async () => {
  const response = await getAllNews();
  return response;
});

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: {
    [getNews.pending]: (state) => {
      state.loading = true;
    },
    [getNews.fulfilled]: (state, payload) => {
      state.loading = false;
      state.news = payload.payload;
    },
    [getNews.rejected]: (state, payload) => {
      state.loading = false;
      state.error = payload.error.message;
    },
  },
});

export const getNewsReducer = newsSlice.reducer;
