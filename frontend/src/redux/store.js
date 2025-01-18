import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import friendsReducer from "./slices/friendsSllice"
import friendRequestsReducer from "./slices/friendRequestsSlice"
import friendRecommendationReducer from "./slices/friendRecommendationsSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        friends: friendsReducer,
        friendRequests: friendRequestsReducer,
        friendRecommendation: friendRecommendationReducer
    }
})