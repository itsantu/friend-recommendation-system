// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-full p-4 hidden lg:block">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <ul>
        <li className="mb-2">
          <Link to="/" className="hover:text-gray-400">Friend List</Link>
        </li>
        <li className="mb-2">
          <Link to="/friend-requests" className="hover:text-gray-400">Friend Requests</Link>
        </li>
        <li className="mb-2">
          <Link to="/friend-recommendation" className="hover:text-gray-400">Friend Recommendations</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;