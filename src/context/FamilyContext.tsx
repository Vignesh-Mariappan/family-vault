
import { db } from "@/firebase/firebase";
import useGetFamilyData, { type FamilyDataState } from "@/hooks/useGetFamilyData";
import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import React, { createContext, useState, useContext } from "react";

interface FamilyContextType {
  family: FamilyDataState | null;
  users: DocumentData[];
  usersLoading: boolean;
  usersError: any;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const familyDataFromFirebase = useGetFamilyData();

  const [family, setFamily] = useState<FamilyDataState | null>(null);
  const [users, setUsers] = useState<DocumentData[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<any>(null);

  React.useEffect(() => {
      if (familyDataFromFirebase) {
        setFamily(familyDataFromFirebase);
      }
    }, [familyDataFromFirebase, setFamily]);

  React.useEffect(() => {
      if (!family) return;
  
      // clear old state when family changes
      setUsers([]);
      setUsersLoading(true);
      setUsersError(null);
  
      const unsubscribes = family?.data?.members.map((memberId: string) => {
        try {
          const userDocRef = doc(db, "users", memberId);
  
        return onSnapshot(userDocRef, (docSnap) => {
          setUsers((prev) => {
            if (!docSnap.exists()) return prev;
  
            return [
              ...prev.filter((user) => user.uid !== docSnap.id),
              {
                uid: docSnap.id,
                ...docSnap.data(),
              },
            ];
          });
          setUsersLoading(false);
        });
        } catch (error) {
          setUsersError(error);
        }

      });
  
      // cleanup subscriptions when unmounting or family changes
      return () => {
        unsubscribes?.forEach((unsub) => unsub());
      };
    }, [family, setUsers]);

  return (
    <FamilyContext.Provider value={{ family, users, usersLoading, usersError }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
};
