import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";
import React, { useEffect, Suspense } from "react";
import Categories from "./pages/Categories";
import PasswordVaultSkeleton from "./components/passwordVault/PasswordVaultSkeleton";

const PasswordVault = React.lazy(() => import("./pages/PasswordVault"));
const Personal = React.lazy(() => import("./components/categories/Personal"));
const Educational = React.lazy(() => import("./components/categories/Educational"));
const Professional = React.lazy(() => import("./components/categories/Professional"));
const Health = React.lazy(() => import("./components/categories/Health"));
const Investments = React.lazy(() => import("./components/categories/Investments"));
const HomeCategory = React.lazy(() => import("./components/categories/HomeCategory"));

function App() {
  useEffect(() => {
    document.title = "FamilyVault";

    const getTheme = () => {
      // Check localStorage for theme preference
      const storedTheme = localStorage.getItem("theme");

      if (storedTheme) {
        return storedTheme === "dark"; // true if dark, false if light
      }

      // If no theme in localStorage, check if html already has dark class
      return document.documentElement.classList.contains("dark");
    };

    const isDark = getTheme();
    const html = document.documentElement;

    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout></Layout>
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/password-vault/:memberid"
          element={
            <Suspense fallback={<PasswordVaultSkeleton />}>
              <PasswordVault />
            </Suspense>
          }
        ></Route>
        <Route path="/categories/:memberid/" element={<Categories />}>
          {/* Nested Category Routes */}
          <Route path="personal" element={<Personal />} />
          <Route path="educational" element={<Educational />} />
          <Route path="professional" element={<Professional />} />
          <Route path="health" element={<Health />} />
          <Route path="investments" element={<Investments />} />
          <Route path="home" element={<HomeCategory />} />
        </Route>
      </Route>
    </Routes>
  );
}
export default App;
