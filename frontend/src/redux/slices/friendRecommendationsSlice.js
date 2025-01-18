import { createSlice } from "@reduxjs/toolkit";

const friendRecommendationSlice = createSlice({
  name: "friendRecommendation",
  initialState: {
    friendRecommendation: [],
  },
  reducers: {
    setFriendRecommendation(state, action) {
      state.friendRecommendation = action.payload;
    },
    removeFrinedRecommendation(state, action) {
      state.friendRecommendation = state.friendRecommendation.filter(
        (request) => request._id != action.payload._id
      );
    },
  },
});

export const { setFriendRecommendation, removeFrinedRecommendation } =
  friendRecommendationSlice.actions;

export default friendRecommendationSlice.reducer;
