import React from 'react'
import UserCard from './UserCard';
import type { DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';

interface IUserCards {
    users: DocumentData[];
    loggedInUser: User | null | undefined;
}

const UserCards: React.FC<IUserCards> = ({
    users,
    loggedInUser
}) => {
  return (
    <div className="flex flex-col gap-4 justify-center flex-wrap">
        {users?.map((member, index) => {
          return (
            <UserCard
              key={member.uid}
              member={member}
              index={index}
              users={users}
              loggedInUser={loggedInUser}
            />
          );
        })}
      </div>
  )
}

export default UserCards