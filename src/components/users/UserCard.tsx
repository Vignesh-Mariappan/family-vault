import { getUserName } from '@/utils/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { motion } from 'framer-motion'
import { Vault, KeyRound, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card, CardContent, CardTitle } from '../ui/card'
import type { DocumentData } from 'firebase/firestore'

interface IUserCard {
    member: DocumentData;
    index: number;
    users: DocumentData[];
    loggedInUser: User | null | undefined;
}

const UserCard: React.FC<IUserCard> = ({ member, index, users, loggedInUser}) => {
  return (
    <motion.div
              key={member.uid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
              className="w-full min-w-72 sm:min-w-84 max-w-96"
            >
              <Card className="w-full liquid-glass-ui">
                <CardContent className="flex flex-col items-center p-2">
                  <Avatar className="rounded-full w-20 h-20 mb-2 border-2 border-white  flex items-center justify-center">
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
                  <CardTitle className="text-lg">
                    {member?.nickName || member?.displayName}
                  </CardTitle>
                  <div className="flex flex-col w-full justify-center items-center">
                  <Link to={`/categories/${member.uid}/`} state={{
                    userDisplayName: getUserName(member.uid, users)
                  }} className="mt-4">
                    <Button
                      variant="default"
                      className="cursor-pointer w-42"
                    >
                      Document Vault <Vault size={24} />
                    </Button>
                  </Link>
                  {
                    member.uid === loggedInUser?.uid && (
                      <Link to={`/password-vault/${member.uid}`} state={{
                        userDisplayName: getUserName(member.uid, users),
                      }} className="mt-4">
                        <Button
                          variant="secondary"
                          className="cursor-pointer w-42"
                        >
                          Password Vault <KeyRound size={24} />
                        </Button>
                      </Link>
                    )
                  }
                  </div>
                </CardContent>
              </Card>
            </motion.div>
  )
}

export default UserCard