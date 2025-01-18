import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSentRequests } from "../../redux/slices/friendRequestsSlice";

const FriendRequests = () => {
  const user = useSelector(state => state.user.user)
  const { pendingRequests, loading, error } = useSelector(
    (state) => state.friendRequests
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (pendingRequests === null) {
      dispatch(fetchSentRequests({userID: user.userID, token: user.accessToken}));
    }
  }, [dispatch, pendingRequests, user]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  console.log(pendingRequests)
  return (
    <div className="max-w-lg mt-5 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold bg-gray-200 p-4">Requests</h2>
      <ul className="divide-y divide-gray-200">
        {pendingRequests?.map((friend) => (
          <li
            key={friend._id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {friend.username}
              </p>
              <p className="text-sm text-gray-500">
                Mutual Friends: {friend?.mutualFriendsCount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                Accept
              </button>
              <button
                onClick={() => console.log("Removed")}
                className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;
