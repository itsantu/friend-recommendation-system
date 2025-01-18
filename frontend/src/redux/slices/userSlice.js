import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            return state
        },
        logout: (state) => {
            state.user = null
        },
        setNewToken: (state, action) => {
            state.user.accessToken = action.payload
        }
    }
})

export const { setUser, logout, setNewToken } = userSlice.actions;

export default userSlice.reducer;