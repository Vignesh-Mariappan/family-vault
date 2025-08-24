import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useGetFamilyData from "@/hooks/useGetFamilyData";
import { getUserDataById } from "@/utils/getUserDataById";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Plus, Vault } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const familyData = useGetFamilyData();

  const [familyUsersData, setFamilyUsersData] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (familyData.data) {
      Promise.all(
        familyData.data.members.map((memberId: string) =>
          getUserDataById(memberId)
        )
      ).then((usersData) => {
        setFamilyUsersData(usersData);
      });
    }
  }, [familyData.data]);

  // console.log("family ", familyData?.data, familyUsersData);

  if (familyData.loading) {
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

  if (familyData.error) {
    return <p>Error loading family data</p>;
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-row gap-4 justify-center flex-wrap">
        {familyUsersData?.map((member) => {
          return (
            <Card key={member.uid} className="w-full max-w-84">
              <CardContent className="flex flex-col items-center p-2">
                <Avatar className="rounded-full w-20 h-20 mb-2 border-4 border-yellow-500">
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
                <Link to={`/member/${member.uid}`} className="mt-4">
                  <Button
                    variant="default"
                    className="cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
                  >
                    Open Vault <Vault size={24} className="mr-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}

        {familyUsersData.length > 0 && (
          <Card className="w-full max-w-84">
            <CardContent className="flex flex-col items-center p-2">
              <div
                className=" h-20 relative"
                style={{
                  width: `${(80 / 2) * (familyUsersData?.length + 2)}px`,
                }}
              >
                {familyUsersData?.slice(0, 2).map((member, index) => {
                  return (
                    <Avatar
                      key={member?.uid}
                      style={{ left: `${index * 40}px` }}
                      className={`rounded-full w-20 h-20 mb-2 absolute border-4 border-yellow-500 `}
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
                {familyUsersData?.length >= 1 && (
                  <div
                    style={{ left: `${80}px` }}
                    className={`rounded-full w-20 h-20 mb-2 absolute border-4 border-yellow-500 flex items-center justify-center bg-background`}
                  >
                    <Plus className="w-16" />
                  </div>
                )}
              </div>
              <CardTitle className="text-lg mt-4">Family</CardTitle>
              <Link
                to={`/family/${familyData?.data?.uid}`}
                state={{ familyData: familyData?.data, familyUsersData }}
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
        )}
      </div>
    </div>
  );
};

export default Home;
