import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import FriendList from "./pages/Friends/FriendList";
import FriendRequests from "./pages/Friends/FriendRequests";
import FriendRecommendation from "./pages/Friends/FriendRecommendation";
import Navbar from "./components/Navbar/Navbar";
import FriendSentRequests from "./pages/Friends/FriendSentRequests";
import { useEffect } from "react";
import { fetchFriends } from "./redux/slices/friendsSllice";
import { setUser } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user);
  // console.log(user); 

  useEffect(() => {
    const userInLocalStorage = JSON.parse(localStorage.getItem("authData"));
    if (userInLocalStorage && !user) {
      dispatch(setUser(userInLocalStorage));
    }
    if (user && user.accessToken) {
      dispatch(fetchFriends({userId: user.userID, token: user.accessToken})); // Fetch friends when user is available
    }
  }, [user, dispatch]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FriendList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friend-requests"
            element={
              <ProtectedRoute>
                <FriendRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sent-requests"
            element={
              <ProtectedRoute>
                <FriendSentRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friend-recommendation"
            element={
              <ProtectedRoute>
                <FriendRecommendation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
