import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md w-full">
      {children}
    </div>
  </div>
);

export default Layout;
