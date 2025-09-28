import { TypographyH4 } from "../components/ui/TypographyH4"
import { ChevronLeft, KeyRound } from "lucide-react";
import AddPasswordDrawer from '../components/passwordVault/AddPasswordDrawer';
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PasswordList from "@/components/passwordVault/PasswordList";
import { useFamily } from "@/context/FamilyContext";
import { getUserPasswords } from "@/utils/utils";
import { InfoComponent } from "@/components/ui/InfoComponent";
import { motion } from "framer-motion";

const PasswordVault = () => {
  const { memberid } = useParams<{ memberid: string }>();
  const { users } = useFamily();
  const passwords = getUserPasswords(memberid, users)
  const navigate = useNavigate();
  return (
    <div className="m-4 flex flex-col gap-4">
      <Button
            variant='outline'
            onClick={() => navigate('/')}
            className='self-start cursor-pointer'

          >
            <ChevronLeft className='h-4 w-4' />
            Back to Home
            {/* Using X as a back arrow, you might replace this */}
          </Button>
        {/* <TypographyH4 text={userDisplayName} additionalClasses="text-center" /> */}
        <motion.header initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}  className="flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-md">
                  <KeyRound className="h-3 w-3 sm:h-6 sm:w-6" />
              </div>
              <div className="flex flex-col">
                  <TypographyH4 text={"Password Vault"}></TypographyH4>
                  <p className="hidden sm:inline-flex text-sm text-muted-foreground">Manage your passwords securely</p>
              </div>
          </div>
          <AddPasswordDrawer />
        </motion.header>

        {
          passwords.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-12">
              <InfoComponent title="No Passwords Saved" description="Add your first password to get started." />
            </div>
            
          )
        }

        {
          passwords.length > 0 && (
            <PasswordList passwords={passwords} />
          )
        }
    </div>
  )
}

export default PasswordVault;


