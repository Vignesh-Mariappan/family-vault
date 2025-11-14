import { db } from "@/firebase/firebase";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  getDoc,
  doc,
  updateDoc,
  arrayRemove,
  type DocumentData,
} from "firebase/firestore";
import { MailPlus, Trash2 } from "lucide-react";
// import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TypographyH4 } from "../ui/TypographyH4";
import { useFamily } from "@/context/FamilyContext";

const FamilyMembersData: React.FC = () => {
  const { family, users: familyMembersData } = useFamily();

  const handleDeleteInvite = async (email: string) => {
    const familyId = family?.data?.uid;
    if (!familyId) return;
    try {
      await updateDoc(doc(db, "families", familyId), {
        invites: arrayRemove(email),
      });

      toast.success("Invite removed successfully!");
    } catch (err) {
      console.error("Error removing invite:", err);
      toast.error("Error removing invite. Please try again.");
    }
  };

  const renderInvitedMembers = (invitedMembers: string[]) => (
    <div className="text-center w-full max-w-md p-4">
      <TypographyH4 text={"Vault Invites"} />
      {invitedMembers.length === 0 ? (
        <div className="flex mt-4 flex-col items-center justify-center py-8 bg-transparent rounded-lg border border-dashed border-gray-300">
          <MailPlus className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-base font-medium">
            No invitations sent yet. Invite your loved ones to join
          </p>
        </div>
      ) : (
        <Table className="w-full ">
          <TableBody>
            {invitedMembers?.map((email, index) => (
              <TableRow key={email ?? index}>
                <TableCell className="flex items-center justify-between">
                  <span>{email}</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete Invite"
                        className="z-1"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 shadow-md rounded-md border z-10 bg-background">
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-sm text-center">
                          Are you sure you want to remove the invitation?
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteInvite(email)}
                          >
                            Yes
                          </Button>
                          <PopoverClose asChild>
                            <Button
                              className="cursor-pointer"
                              variant="outline"
                              size="sm"
                            >
                              No
                            </Button>
                          </PopoverClose>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  const renderFamilyMembers = (
    familyMembersData: (DocumentData | undefined)[]
  ) => {
    const tableHeads = ["Member", "Email", "Nickname", "Documents"];

    return (
      <div className="w-full max-w-4xl p-4 overflow-x-auto">
        <TypographyH4 text={"Vault Members"} additionalClasses="text-center" />
        <Table className="w-full mt-4 border">
          <TableHeader>
            <TableRow>
              {tableHeads.map((head, index) => (
                <TableHead
                  key={head}
                  className={`text-center text-semibold text-white`}
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyMembersData?.map((member, index) => (
              <TableRow key={member?.uid ?? index}>
                <TableCell
                  className={
                    "text-center"
                  }
                >
                  {member?.displayName}
                </TableCell>
                <TableCell className="text-center">{member?.email}</TableCell>
                <TableCell className="text-center">
                  {member?.nickName}
                </TableCell>
                <TableCell className="text-center">
                  {Object.keys(member?.documents || {}).reduce(
                    (acc, key) => acc + (member?.documents[key] || []).length,
                    0
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <>
      {renderFamilyMembers(familyMembersData)}
      {family?.data?.invites && renderInvitedMembers(family.data.invites)}
    </>
  );
};

export default FamilyMembersData;
