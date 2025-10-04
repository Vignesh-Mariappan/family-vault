import InviteMemberForm from "@/components/InviteMemberForm";
import { DataUsageChart } from "@/components/profile/DataUsage";
import FamilyMembersData from "@/components/profile/FamilyMembersData";
import Nickname from "@/components/profile/Nickname";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useFamily } from "@/context/FamilyContext";
import { auth } from "@/firebase/firebase";
import { logout } from "@/utils/auth";
import { UserRole } from "@/utils/types";
import { LogOut } from "lucide-react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile: React.FC = () => {
  const [loggedInUser] = useAuthState(auth);
  const { users, usersLoading, usersError } = useFamily();
  const user = users?.find(currentUser => currentUser.uid === loggedInUser?.uid)

  if (usersLoading) {
    return (
      <div className="flex flex-col items-center gap-4 my-8 p-4 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-stone-800 animate-pulse w-[100px] h-[100px]" />
          <div className="h-6 w-32 bg-stone-800 rounded animate-pulse" />
        </div>
        <div className="w-full m-6">
          <div className="h-5 w-24 bg-stone-800 rounded animate-pulse mx-auto mb-2" />
          <div className="border rounded-lg p-4 mx-4">
            <div className="flex flex-row justify-between mb-2">
              <div className="h-4 w-20 bg-stone-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-stone-800 rounded animate-pulse" />
            </div>
            <div className="flex flex-row justify-between">
              <div className="h-4 w-20 bg-stone-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-stone-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="w-full m-6">
          <div className="h-5 w-24 bg-stone-800 rounded animate-pulse mx-auto mb-2" />
          <div className="border rounded-lg p-4  mx-4">
            <div className="h-4 w-32 bg-stone-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-stone-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 w-32 bg-stone-800 rounded animate-pulse m-6" />
      </div>
    );
  }

  if (usersError) return <div>Error loading profile</div>;

  return (
    <div className="flex flex-col items-center gap-10 my-8 p-4">
      {user?.photoURL && (
        <img
          src={user?.photoURL}
          alt={`${user?.displayName}'s profile`}
          width="100"
          height="100"
          className="rounded-md"
        />
      )}
      <TypographyH2 text={user?.displayName} />
      {/* Nickname section */}
      <Nickname userNickName={user?.nickName} loggedInUser={loggedInUser} />
      {user?.role === UserRole.Admin && <InviteMemberForm />}{" "}
      <FamilyMembersData />
      <DataUsageChart />
      <Button className="cursor-pointer" variant="destructive" onClick={logout}>
        Logout
        <LogOut className=" h-4 w-4" />
      </Button>
    </div>
  );
};

export default Profile;
