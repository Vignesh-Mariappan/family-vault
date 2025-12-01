import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const useCategoryDocuments = (uid: string, category: string) => {
  const [docs, setDocs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !category) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          setDocs([]);
          return;
        }

        const data = snap.data();
        const docs = data?.documents?.[category] ?? [];

        setDocs(docs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [uid, category]);

  return { docs, loading, error };
};
