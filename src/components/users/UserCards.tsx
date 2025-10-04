import React from 'react'
import UserCard from './UserCard';
import FamilyCard from './FamilyCard';
import type { DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';

interface IUserCards {
    users: DocumentData[];
    familyData: DocumentData | null | undefined;
    loggedInUser: User | null | undefined;
}

const UserCards: React.FC<IUserCards> = ({
    users,
    familyData,
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

        {users.length > 0 && (
          <FamilyCard familyData={familyData} users={users} />
        )}
      </div>
  )
}

export default UserCards