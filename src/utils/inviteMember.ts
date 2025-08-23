import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

// 2. Invite a member by email
export const inviteMember = async (email: string, familyId: string) => {
  if (!email || !familyId) throw new Error("Email is required");
  if (!auth.currentUser) throw new Error("User not authenticated");

  // Get the family where this user is Admin
  const familyRef = doc(db, "families", familyId);

  // Update invites array
  await updateDoc(familyRef, {
    invites: arrayUnion(email.toLowerCase())
  });

  console.log(`✅ Invite sent to ${email} for family ${familyId}`);
};
