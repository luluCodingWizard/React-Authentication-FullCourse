import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
      <p className="mb-6">You do not have permission to view this page.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
