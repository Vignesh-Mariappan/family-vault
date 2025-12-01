import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

interface Document {
  id: string;
  name: string;
  url: string;
  category: string;
  [key: string]: any;
}

interface UserData {
  documents?: {
    [category: string]: Document[];
  };
}

export const useGetFamilyDocuments = (familyMembers: string[]) => {
  const [documents, setDocuments] = useState<FamilyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!familyMembers || familyMembers.length === 0) {
      setDocuments([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Local cache of per-user data
    const familyData: Record<string, UserData> = {};
    let initialLoadedCount = 0;
    const totalMembers = familyMembers.length;
    const unsubscribers: Unsubscribe[] = [];

    const mergeAndSetDocuments = () => {
      const mergedDocs: FamilyDocument[] = Object.values(familyData)
        .flatMap((userData) => {
          if (!userData.documents) return [];

          return Object.entries(userData.documents).flatMap(
            ([categoryKey, docs]) =>
              (docs || []).map((docItem) => ({
                ...docItem,
                category: categoryKey, // inject category for UI
              }))
          );
        });

      setDocuments(mergedDocs);
    };

    familyMembers.forEach((uid) => {
      const userRef = doc(db, "users", uid);

      const unsub = onSnapshot(
        userRef,
        (snap) => {
          // Update cache for this user
          if (snap.exists()) {
            familyData[uid] = snap.data() as UserData;
          } else {
            familyData[uid] = {};
          }

          // Count how many members have been loaded at least once
          if (initialLoadedCount < totalMembers) {
            initialLoadedCount += 1;
          }

          // Only after ALL family members have responded at least once,
          // we do the first "merged" update and stop showing loading.
          if (initialLoadedCount === totalMembers) {
            mergeAndSetDocuments();
            setLoading(false);
          } else {
            // Optional: if you want "progressive" loading, you could also
            // call mergeAndSetDocuments() here; but we wait for all.
          }
        },
        (err) => {
          console.error(`Error listening to user ${uid}:`, err);
          setError("Error fetching family documents.");
          setLoading(false);
        }
      );

      unsubscribers.push(unsub);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [familyMembers]);

  return { documents, loading, error };
};
