import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-md w-full text-black">
      {children}
    </div>
    <footer className="mt-4 text-gray-500 text-sm">
      Generated with AI
    </footer>
  </div>
);

export default Layout;
