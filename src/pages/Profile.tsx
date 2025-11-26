import InviteMemberForm from "@/components/InviteMemberForm";
import { DataUsageChart } from "@/components/profile/DataUsage";
import FamilyMembersData from "@/components/profile/FamilyMembersData";
import Nickname from "@/components/profile/Nickname";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/TypographyH2";
import { useFamily } from "@/context/FamilyContext";
import { auth } from "@/firebase/firebase";
import useScrollToTop from "@/hooks/useScrollToTop";
import { logout } from "@/utils/auth";
import { UserRole } from "@/utils/types";
import { LogOut } from "lucide-react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";

const Profile: React.FC = () => {
  const [loggedInUser] = useAuthState(auth);
  const { users, usersLoading, usersError } = useFamily();
  const user = users?.find(
    (currentUser) => currentUser.uid === loggedInUser?.uid
  );

  useScrollToTop();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-10 my-8 p-4"
    >
      {user?.photoURL && (
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          src={user?.photoURL}
          alt={`${user?.displayName}'s profile`}
          width="100"
          height="100"
          className="rounded-md"
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TypographyH2 text={user?.displayName} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full flex flex-col items-center"
      >
        <Nickname userNickName={user?.nickName} loggedInUser={loggedInUser} />
      </motion.div>
      {user?.role === UserRole.Admin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md "
        >
          <InviteMemberForm />
        </motion.div>
      )}{" "}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full flex flex-col justify-center items-center"
      >
        <FamilyMembersData />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full flex justify-center items-center"
      >
        <DataUsageChart />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          className="cursor-pointer"
          variant="destructive"
          onClick={logout}
        >
          Logout
          <LogOut className=" h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
