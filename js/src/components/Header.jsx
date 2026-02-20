import React from "react";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-8 py-5 shadow-lg flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-bold tracking-wide">
          Asset Management Dashboard
        </h1>
        <p className="text-blue-100 text-sm">
          Track and manage your IT assets efficiently
        </p>
      </div>

      <div className="bg-white/20 px-4 py-2 rounded-lg text-sm">
        Asset Module
      </div>

    </div>
  );
};

export default Header;
