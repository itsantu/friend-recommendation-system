import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLogout } from "../../hooks/useLogout";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import {
  RiUserReceived2Fill,
  RiUserSharedFill,
  RiSparkling2Fill,
} from "react-icons/ri";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const { logout } = useLogout();
  const [search, setSearch] = useState("");
  const [showSearchBtn, setShowSearchBtn] = useState(!search.length === 0);

  const handleLogout = async () => {
    await logout();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // Optional: Trigger a search API or local filtering
  };

  return (
    <nav className="flex flex-col gap-2 items-center p-4 bg-gray-800 text-white">
      {/* Top Section */}
      <div className="flex justify-between items-center w-full max-w-6xl">
        <div className="text-2xl font-bold">MyApp</div>

        {user && (
          <div className="hidden sm:flex items-center w-full max-w-md mx-4">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="w-full h-10 pl-4 pr-8 rounded-md border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSearchBtn && <button>Search</button>}
          </div>
        )}

        <div className="flex items-center">
          {user ? (
            <>
              <span className="mr-4 hidden sm:inline">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <span className="text-gray-400">Not logged in</span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      {user && (
        <div className="p-4 w-full max-w-6xl">
          <ul className="flex flex-wrap justify-between">
            <li className="mb-2">
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-gray-400"
              >
                <FaUserFriends className="text-lg" />
                <span className="hidden md:block">Friends</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/friend-requests"
                className="flex items-center gap-2 hover:text-gray-400"
              >
                <RiUserReceived2Fill className="text-lg" />
                <span className="hidden md:block">Friend Requests</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/sent-requests"
                className="flex items-center gap-2 hover:text-gray-400"
              >
                <RiUserSharedFill className="text-lg" />
                <span className="hidden md:block">Sent Requests</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/friend-recommendation"
                className="flex items-center gap-2 hover:text-gray-400"
              >
                <RiSparkling2Fill className="text-lg" />
                <span className="hidden md:block">Friend Recommendation</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Mobile Search Bar */}
      {user && (
        <div className="sm:hidden w-full px-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="w-full h-10 pl-4 pr-8 rounded-md border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
