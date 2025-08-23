import { signInWithPopup, signOut } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/firebase";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { email } from "zod";


export const getUserFamily = async (uid: string, familyId: string = '') => {
  if (!familyId) {
    return null;
  }

  const familyRef = doc(db, "families", familyId);
  const familySnap = await getDoc(familyRef);

  if (familySnap.exists()) {
    return familySnap.data();
  } else {
    return null;
  }
};

export const loginWithGoogle = async () => {
  try {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  if (!user.email) throw new Error("No email returned from Google Auth");

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const familiesSnap = await getDocs(collection(db, "families"));
        console.log('familiesSnap ', familiesSnap)

  // If user already exists, just return
  if (userSnap.exists() ) return;

  // Check if email is invited to any family

      if (user && user.email !== null) {
        // const familiesSnap = await getDocs(collection(db, "families"));
        // console.log('familiesSnap ', familiesSnap)
    // Find family where this email is invited
  const q = query(
    collection(db, "families"),
    where("invites", "array-contains", user?.email)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    const familyId = uuidv4();
  
   // Create user record as Admin, including photoURL if available
      await setDoc(userRef, {
        email: user.email.toLowerCase(),
        displayName: user.displayName || "",
        role: "Admin",
   ...(user.photoURL && { photoURL: user.photoURL }),
        familyId
      });
  
      await setDoc(doc(db, "families", familyId), {
        createdBy: user.uid,
        members: [user.uid],
        invites: []
      });
  }

  const familyDoc = snap.docs[0];
  const familyRef = doc(db, "families", familyDoc.id);
  const familySnap = await getDoc(familyRef);
  const isFamilySnapExists = familySnap.exists()

  if (isFamilySnapExists) {
    const familyId = familySnap.id;
    console.log(familyId);
     // Claim the invite: move from invites[] → members[]
  await updateDoc(familyRef, {
    members: arrayUnion(user.uid),
    invites: arrayRemove(user.email)
  });

        console.log('After updating')

        // Create user record with Member role, including photoURL if available
      await setDoc(userRef, {
        email: user.email.toLowerCase(),
        displayName: user.displayName || "",
        role: "Member",
 familyId: familyId,
 ...(user.photoURL && { photoURL: user.photoURL }),
      });
  }

 

      console.log('after setting Doc')
      }
      


//   if (famData) {
//     const familyRef = doc(db, "families", userData?.familyId);
//     if (famData.invites?.includes(user.email.toLowerCase())) {
//       joinedFamilyId = familyRef.id;

//       // Add user to members
//       await updateDoc(familyRef, {
//         members: arrayUnion(user.uid),
//         invites: arrayRemove(user.email.toLowerCase())
//       });

//       // Create user record with Member role, including photoURL if available
//       await setDoc(userRef, {
//         email: user.email.toLowerCase(),
//         displayName: user.displayName || "",
//         role: "Member",
//  familyId: joinedFamilyId,
//  ...(user.photoURL && { photoURL: user.photoURL }),
//       });

//     }
//   }
  } catch (error) {
    console.log('Firebase error ', error)
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout error:", err);
  }
};
