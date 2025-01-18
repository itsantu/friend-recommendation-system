import React from "react";
import { useSelector } from "react-redux";
import { CiStar } from "react-icons/ci";
import { AiOutlineUserDelete } from "react-icons/ai";

const FriendList = () => {
  const { friendList, loading, error } = useSelector((state) => state.friends);
  
  const handleRemoveFriend = () => {};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-lg mt-5 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold bg-gray-200 p-4">Friends ({friendList?.length})</h2>
      <ul className="divide-y divide-gray-200">
        {friendList?.map((friend) => (
          <li
            key={friend._id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {friend.username}
              </p>
              <p className="text-sm text-gray-500">
                Mutual Friends: {friend.mutualFriendsCount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xl font-bold p-1 border-[1px] border-blue-500 text-blue-500 rounded-md hover:border-blue-800 hover:text-blue-800">
                <CiStar />
              </button>
              <button
                onClick={() => handleRemoveFriend(friend._id)}
                className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <AiOutlineUserDelete className="mr-2" />
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
