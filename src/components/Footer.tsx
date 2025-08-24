import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full p-4 text-center flex justify-center items-center text-sm">
    &copy; {new Date().getFullYear()}{" "}
    <strong className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
      FamilyVault
    </strong>
    . All rights reserved.
  </footer>
);

export default Footer;
