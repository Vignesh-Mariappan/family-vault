import type { DocumentData } from 'firebase/firestore';
import { motion } from 'framer-motion';
import React from 'react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Plus, User, Vault } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface IFamilyCard {
    users: DocumentData[];
    familyData: DocumentData | null | undefined;
}

const FamilyCard: React.FC<IFamilyCard> = ({
    users,
    familyData
}) => {
  return (
    <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: users.length * 0.2 }}
          >
            <Card className="w-full bg-transparent max-w-84">
              <CardContent className="flex flex-col items-center p-2">
                <div
                  className=" h-20 relative"
                  style={{
                    width: `160px`,
                  }}
                >
                  {users?.slice(0, 2).map((member, index) => {
                    return (
                      <Avatar
                        key={member?.uid}
                        style={{ left: `${index * 40}px` }}
                        className={`rounded-full w-20 h-20 mb-2 absolute border-2 border-white `}
                      >
                        {member.photoURL && (
                          <AvatarImage
                            className="rounded-full w-full h-full"
                            src={member.photoURL}
                            alt={member.displayName}
                          />
                        )}
                        <AvatarFallback>
                          <User className="w-8 h-8 text-white" />
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                  {users?.length >= 1 && (
                    <div
                      style={{ left: `${80}px` }}
                      className={`rounded-full w-20 h-20 mb-2 absolute border-2 border-white flex items-center justify-center bg-background`}
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
                    variant="outline"
                    className="cursor-pointer text-white"
                  >
                    Full Family Access <Vault size={24} className="mr-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
    </motion.div>
  )
}

export default FamilyCard