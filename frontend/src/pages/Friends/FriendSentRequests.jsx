import React from 'react'
import { useSelector } from 'react-redux';

const FriendSentRequests = () => {
    const sentRequests = useSelector(state => state.friendRequests.sentRequests)
  return (
    <div className="max-w-lg mt-5 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold bg-gray-200 p-4">Sent Requests</h2>
      <ul className="divide-y divide-gray-200">
        {sentRequests.map((friend) => (
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
}

export default FriendSentRequests