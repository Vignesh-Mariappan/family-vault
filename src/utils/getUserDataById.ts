import { doc, getDoc, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Assuming 'db' is your Firestore instance

const getUserDataById = async (uid: string): Promise<DocumentData | null> => {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return {
      uid: userDocSnap.id,
      ...userDocSnap.data(),
    };
  } else {
    return null;
  }
};

export { getUserDataById };