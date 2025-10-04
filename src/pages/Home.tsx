import UserCards from "@/components/users/UserCards";
import UserLoading from "@/components/users/UserLoading";
import { useFamily } from "@/context/FamilyContext";
import { auth } from "@/firebase/firebase";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Home: React.FC = () => {
  const { family, users } = useFamily();
  const familyData = family?.data;
  const [loggedInUser] = useAuthState(auth);

  if (family?.loading) {
    return (
      <UserLoading />
    );
  }

  if (family?.error) {
    return <p>Error loading family data</p>;
  }

  return (
    <main className="flex flex-col gap-4 items-center justify-center">
      <UserCards users={users} familyData={familyData} loggedInUser={loggedInUser} />
    </main>
  );
};

export default Home;
