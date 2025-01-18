import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Async thunk to fetch pending friend requests
export const fetchPendingRequests = createAsyncThunk(
  "friendRequests/fetchPending",
  async ({userID, token}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/friend-requests/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("called")
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSentRequests = createAsyncThunk(
  "friendRequests/fetchSent",
  async ({userID, token}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/sent-friend-request/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const friendRequestsSlice = createSlice({
  name: "friendRequests",
  initialState: {
    pendingRequests: null,
    sentRequests: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPendingRequests(state, action) {
      state.pendingRequests = action.payload;
    },
    setSentRequests(state, action) {
      state.sentRequests = action.payload;
    },
    addSentRequest(state, action) {
      state.sentRequests.push(action.payload);
    },
    removePendingRequest(state, action) {
      state.pendingRequests = state.pendingRequests.filter(
        (request) => request._id !== action.payload._id
      );
    },
    // Additional reducers for accepting/rejecting requests can be added here
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSentRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.sentRequests = action.payload;
      })
      .addCase(fetchSentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setPendingRequests,
  setSentRequests,
  addSentRequest,
  removePendingRequest,
} = friendRequestsSlice.actions;

export default friendRequestsSlice.reducer;
