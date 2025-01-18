const User = require("../models/User");

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("username _id")
      .limit(10); // Paginate results

    res.status(200).json(users);
  } catch (error) {
    console.error("Error while searching users:", error.message);
    res.status(500).json({ error: "An error occurred while searching users" });
  }
};

const sendFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;
  if (!sender || !receiver) {
    return res.status(400).json({ error: "Sender or Reciever data missing!" });
  }

  const senderUser = await User.findOne({ username: sender });
  const receiverUser = await User.findOne({ username: receiver });

  if (!senderUser || !receiverUser) {
    return res.status(404).json({ error: "User(s) not found." });
  }

  if (receiverUser.pendingRequests.includes(senderUser._id)) {
    return res.status(400).json({ error: "Friend request already sent." });
  }

  try {
    receiverUser.pendingRequests.push(senderUser._id);
    await receiverUser.save();

    senderUser.sentRequests.push(receiverUser._id);
    senderUser.save();

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { userId, requesterId } = req.body;

    if (!userId || !requesterId) {
      return res.status(400).json({ error: "Both fields required" });
    }

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(400).json({ error: "User(s) not found" });
    }

    // Users end actions
    user.pendingRequests.pull(requesterId);
    user.friends.push(requesterId);

    // Reqester end actions
    requester.sentRequests.pull(userId);
    requester.friends.push(userId);

    await requester.save();
    await user.save();

    res.status(200).json({ message: "Friend request accepted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while accepting the friend request.",
    });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    if (!userId || !friendId) {
      return res.status(400).json({ error: "Both fields required" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(400).json({ error: "User(s) not found" });
    }

    user.friends.pull(friendId);
    friend.friends.pull(userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { userId, requesterId } = req.body;

    if (!userId || !requesterId) {
      return res.status(400).json({ error: "Both fields required" });
    }

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(400).json({ error: "User(s) not found" });
    }

    // Users end actions
    user.pendingRequests.pull(requesterId);

    requester.sentRequests.pull(userId);

    await requester.save();
    await user.save();

    res.status(200).json({ message: "Friend request rejected successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while accepting the friend request.",
    });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User Id required!" });
    }

    const user = await User.findById(userId).select("friends");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendList = await User.aggregate([
      { $match: { _id: { $in: user.friends } } },
      {
        $project: {
          _id: 1,
          username: 1,
          mutualFriendsCount: {
            $size: {
              $setIntersection: ["$friends", user.friends],
            },
          },
        },
      },
    ]);

    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId; // Authenticated user ID

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const recommendations = await User.aggregate([
      {
        $match: {
          _id: { $ne: user._id }, // Exclude current user
          _id: { $nin: user.friends }, // Exclude existing friends
          _id: { $nin: user.pendingRequests }, // Exclude sent requests
          _id: { $nin: user.sentRequests }, // Exclude received requests
        },
      },
      {
        $lookup: {
          from: "users", // Collection to join
          localField: "friends",
          foreignField: "_id",
          as: "friendDetails",
        },
      },
      {
        $addFields: {
          mutualFriends: {
            $size: {
              $setIntersection: ["$friends", user.friends], // Mutual friend count
            },
          },
        },
      },
      { $sort: { mutualFriends: -1 } }, // Sort by mutual friends descending
      { $limit: 10 }, // Limit results
      {
        $project: {
          username: 1,
          mutualFriends: 1,
          interests: 1, // Include interests for optional features
        },
      },
    ]);

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required!" });
    }

    const user = await User.findById(userId)
      .select("pendingRequests")
      .populate("pendingRequests", "username _id");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If there are no pending requests, return an empty array
    if (!user.pendingRequests || user.pendingRequests.length === 0) {
      return res.status(200).json({ pendingRequests: [] });
    }

    const formattedRequests = user.pendingRequests.map((req) => ({
      id: req._id,
      username: req.username,
    }));

    res.status(200).json({ pendingRequests: formattedRequests });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const getSentRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is required!" });
    }

    // Find the user and populate the sentRequests field with the IDs and usernames
    const user = await User.findById(userId)
      .select("sentRequests")
      .populate("sentRequests", "username _id");

    // If the user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If there are no sent requests, return an empty array
    if (!user.sentRequests || user.sentRequests.length === 0) {
      return res.status(200).json({ sentRequests: [] });
    }

    // Format and send the response
    const formattedRequests = user.sentRequests.map((req) => ({
      id: req._id,
      username: req.username,
    }));

    res.status(200).json({ sentRequests: formattedRequests });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  rejectFriendRequest,
  getFriends,
  getRecommendations,
  getFriendRequests,
  getSentRequests,
};
