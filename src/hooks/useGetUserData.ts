import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase/firebase';
import { doc, type DocumentData, DocumentReference, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UseGetUserDataResult {
  userData: DocumentData | null;
  loading: boolean;
  error?: Error;
}

const useGetUserRef = (): UseGetUserDataResult => {
  const [user, loadingUser, errorUser] = useAuthState(auth);
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      // reset state if no user
      setUserData(null);
      setLoadingData(false);
      return;
    }

    const userRef: DocumentReference = doc(db, 'users', user.uid);

    // Subscribe to live updates
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.data());
        } else {
          setUserData(null);
        }
        setLoadingData(false);
      },
      (error) => {
        console.error("Error listening to user document:", error);
        setErrorData(error);
        setLoadingData(false);
      }
    );

    // Cleanup listener on unmount or user change
    return () => unsubscribe();
  }, [user]);

  return {
    userData,
    loading: loadingUser || loadingData,
    error: errorUser || errorData,
  };
};

export default useGetUserRef;
