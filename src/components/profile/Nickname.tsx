import { db } from "@/firebase/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { User } from "firebase/auth";

const Nickname: React.FC<{
  userNickName: string | null;
  loggedInUser: User | null | undefined;
}> = ({ userNickName, loggedInUser }) => {
  const [editingNickname, setEditingNickname] = useState(false); // 👈 edit mode
  const [nickname, setNickname] = useState(""); // 👈 local state

  useEffect(() => {
    if (userNickName) {
      setNickname(userNickName || "");
    }
  }, [userNickName]);

  // Save nickname to Firestore
  const handleSaveNickname = async () => {
    if (!loggedInUser?.uid) return;
    if (!nickname.trim()) {
      toast.error("Nickname cannot be empty");
      return;
    }
    if (nickname.length > 50) {
      toast.error("Nickname cannot exceed 50 characters");
      return;
    }
    try {
      await updateDoc(doc(db, "users", loggedInUser.uid), {
        nickName: nickname,
      });
      toast.success("Nickname updated successfully!");
      setEditingNickname(false);
    } catch (err) {
      console.error("Error updating nickname:", err);
      toast.error("Error updating nickname. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {editingNickname ? (
        <>
          <label htmlFor="nickname">Nickname</label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={handleSaveNickname} // save on blur
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveNickname();
              if (e.key === "Escape") setEditingNickname(false);
            }}
            maxLength={50}
            className="w-64"
            autoFocus
          />
        </>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="text-md">Nickname</div>
          <div className="flex gap-1 items-center justify-center">
            <div className="text-lg font-medium text-gradient-yellow">
              {nickname || "No nickname set"}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingNickname(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nickname;
