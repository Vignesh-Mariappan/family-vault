import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import Header from "./components/Header"; // Adjust the import path as needed

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div
      className={`max-w-3xl mx-auto border-l border-r h-[100dvh] overflow-hidden flex flex-col`}
    >
      <Toaster position="top-right" richColors />
      <Header />
      <div className={`border-b`} />
      <main className="flex-1 overflow-auto my-4">
        {/* Main content will be rendered here */}
        <Outlet />
      </main>
      <div className={`border-b`} />
      <Footer />
    </div>
  );
};

export default Layout;
