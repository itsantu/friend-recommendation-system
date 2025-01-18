import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
  friendList: [],
  loading: false,
  error: null,
};

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async ({userId, token}, { rejectWithValue }) => {
    // console.log(userId)
    try {
      const response = await axiosInstance.get(`/users/friends/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log(response)
      return response.data; // Assuming API returns an array of friends
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends(state, action) {
      state.friendList = [...state.friendList, ...action.payload];
    },
    addFriend(state, action) {
      const friendExists = state.friendList.some(
        (friend) => friend._id === action.payload._id
      );
      if (!friendExists) {
        state.friendList.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friendList = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFriends, addFriend } = friendsSlice.actions;

export default friendsSlice.reducer;
