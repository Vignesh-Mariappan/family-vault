import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./Layout";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Member from "./pages/Member";
import ProtectedRoute from "./utils/ProtectedRoute";
import Personal from "./components/Categories/Personal";
import Educational from "./components/Categories/Educational";
import Health from "./components/Categories/Health";
import Investments from "./components/Categories/Investments";
import Professional from "./components/Categories/Professional";
import HomeCategory from "./components/Categories/HomeCategory";
import { useEffect } from "react";

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

        <Route path="/member/:memberid" element={<Member />}>
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
