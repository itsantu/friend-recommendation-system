const express = require("express");
const {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  rejectFriendRequest,
  getFriends,
  getRecommendations,
  getFriendRequests,
  getSentRequests,
} = require("../controller/friendController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/search", searchUsers);

router.post("/friend-request", sendFriendRequest);

router.post("/friend-accept", acceptFriendRequest);

router.delete("/friend-remove", removeFriend);

router.post("/friend-reject", rejectFriendRequest);

router.get("/friends/:userId", getFriends);

router.get("/recommendations/:userId", getRecommendations);

router.get("/friend-requests/:userId", getFriendRequests);

router.get("/sent-friend-request/:userId", getSentRequests);

module.exports = router;
