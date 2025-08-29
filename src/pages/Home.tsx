import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Plus, Vault } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useFamily } from "@/context/FamilyContext";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const { family, users } = useFamily();
  const familyData = family?.data;

  const getUserName = (userId: string) => {
    return users.find(user => user?.uid === userId)?.nickName || users.find(user => user?.uid === userId)?.displayName || '';
  }

  if (family?.loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-row gap-4 justify-center flex-wrap">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="w-full max-w-84">
              <CardContent className="flex flex-col items-center p-2">
                <Skeleton className="rounded-full w-20 h-20 mb-2" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (family?.error) {
    return <p>Error loading family data</p>;
  }

  console.log('Users ', users);

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-4 justify-center flex-wrap">
        {users?.map((member, index) => {
          return (
            <motion.div
              key={member.uid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
              className="w-full min-w-72 sm:min-w-84 max-w-96"
            >
              <Card className="w-full">
                <CardContent className="flex flex-col items-center p-2">
                  <Avatar className="rounded-full w-20 h-20 mb-2 border-2 border-yellow-500">
                    {member.photoURL && (
                      <AvatarImage
                        className="rounded-full w-full h-full"
                        src={member.photoURL}
                        alt={member.displayName}
                      />
                    )}
                    <AvatarFallback>
                      {member.displayName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">
                    {member?.nickName || member?.displayName}
                  </CardTitle>
                  <Link to={`/member/${member.uid}`} state={{
                    userDisplayName: getUserName(member.uid)
                  }} className="mt-4">
                    <Button
                      variant="default"
                      className="cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
                    >
                      Open Vault <Vault size={24} className="mr-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {users.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: users.length * 0.2 }}
          >
            <Card className="w-full max-w-84">
              <CardContent className="flex flex-col items-center p-2">
                <div
                  className=" h-20 relative"
                  style={{
                    width: `${(80 / 2) * (users?.length + 2)}px`,
                  }}
                >
                  {users?.slice(0, 2).map((member, index) => {
                    return (
                      <Avatar
                        key={member?.uid}
                        style={{ left: `${index * 40}px` }}
                        className={`rounded-full w-20 h-20 mb-2 absolute border-2 border-yellow-500 `}
                      >
                        {member.photoURL && (
                          <AvatarImage
                            className="rounded-full w-full h-full"
                            src={member.photoURL}
                            alt={member.displayName}
                          />
                        )}
                        <AvatarFallback>
                          {member.displayName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                  {users?.length >= 1 && (
                    <div
                      style={{ left: `${80}px` }}
                      className={`rounded-full w-20 h-20 mb-2 absolute border-2 border-yellow-500 flex items-center justify-center bg-background`}
                    >
                      <Plus className="w-16" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg mt-4">Family</CardTitle>
                <Link
                  to={`/family/${familyData?.uid}`}
                  state={{
                    familyData,
                    familyUsersData: users,
                  }}
                  className="mt-4"
                >
                  <Button
                    variant="default"
                    className="cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
                  >
                    Full Family Access <Vault size={24} className="mr-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
