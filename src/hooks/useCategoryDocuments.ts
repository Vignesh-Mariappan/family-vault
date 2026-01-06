import { useEffect, useState } from "react";
import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const useCategoryDocuments = (uid: string | undefined, category: string) => {
  const [docs, setDocs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (!uid || !category) {
      setDocs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        setLoading(false);
        if (snap.exists()) {
          const data = snap.data();
          const docs = data?.documents?.[category] ?? [];
          setDocs(docs);
          setUserData(data);
        } else {
          setDocs([]);
          setUserData(null);
        }
      },
      (err: any) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [uid, category]);

  return { docs, loading, error, userData };
};
