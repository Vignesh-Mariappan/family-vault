import React from "react";
import { FaVault } from "react-icons/fa6";
import useGetUserData from "@/hooks/useGetUserData";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { TypographyH4 } from "./ui/TypographyH4";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

const Header: React.FC = () => {
  const [loggedInUser] = useAuthState(auth);
  const { userData: user } = useGetUserData(loggedInUser?.uid || "");

  return (
    <header className="flex justify-between items-center p-4">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Link to="/">
          <FaVault className="h-8 w-8 text-primary" />
        </Link>
      </div>

      <TypographyH4
        text="FamilyVault"
        additionalClasses="text-white max-[500px]:hidden"
      />

      <div className="flex gap-4 items-center justify-center">
        <div className="flex items-center h-10 w-10 gap-4">
          <Link to="/profile">
            <Avatar className="rounded-full cursor-pointer">
              {user?.photoURL !== null && (
                <AvatarImage
                  src={user?.photoURL}
                  className="h-full w-full rounded-full"
                />
              )}
              <AvatarFallback>{user?.displayName?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
