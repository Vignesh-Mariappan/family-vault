import { doc, type DocumentData, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import useGetUserData from './useGetUserData';

interface FamilyDataState {
  data: DocumentData | null;
  loading: boolean;
  error: any; // Consider using a more specific type for error
}

const useGetFamilyData = (): FamilyDataState => {
  const [familyData, setFamilyData] = useState<FamilyDataState>({
    data: null,
    loading: true,
    error: null,
  });
  const { userData, loading: userLoading, error: userError } = useGetUserData();

  useEffect(() => {
    let unsubscribe: () => void;
    if (userData && userData.familyId) {
      const familyId = userData.familyId;
          const familyDocRef = doc(db, 'families', familyId);
      unsubscribe = onSnapshot(familyDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setFamilyData({ data: docSnap.data(), loading: false, error: null });
        } else {
        setFamilyData({ data: null, loading: false, error: null });
      }
    })
    }

    
    return () => unsubscribe && unsubscribe();
  }, [userData]);

  return familyData
};

export default useGetFamilyData;
