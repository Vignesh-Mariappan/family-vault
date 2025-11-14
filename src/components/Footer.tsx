import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full p-4 text-center flex justify-center items-center text-sm">
    &copy; {new Date().getFullYear()}{" "}
    <strong className="text-white">FamilyVault</strong>. All rights
    reserved.
  </footer>
);

export default Footer;
