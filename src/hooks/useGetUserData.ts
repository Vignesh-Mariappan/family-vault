import { auth, db } from '../firebase/firebase';
import { doc, type DocumentData, DocumentReference, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UseGetUserDataResult {
  userData: DocumentData | null;
  loading: boolean;
  error?: Error;
}

/**
 * Fetches user data for the given uid.
 * @param uid User's UID (string)
 */
const useGetUserRef = (uid?: string): UseGetUserDataResult => {
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!uid) {
      setUserData(null);
      setLoadingData(false);
      return;
    }

    const userRef: DocumentReference = doc(db, 'users', uid);

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

    return () => unsubscribe();
  }, [uid]);

  return {
    userData,
    loading: loadingData,
    error: errorData,
  };
};

export default useGetUserRef;
