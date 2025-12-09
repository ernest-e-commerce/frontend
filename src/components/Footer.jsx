import React from "react";

const Footer = () => (
  <footer className="bg-gray-900 text-white mt-12 ">
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
      <div>© {new Date().getFullYear()} MyStore. All rights reserved.</div>
      <div className="text-sm text-gray-300 mt-2 md:mt-0">
        Secure payments • Free returns
      </div>
    </div>
  </footer>
);

export default Footer;
