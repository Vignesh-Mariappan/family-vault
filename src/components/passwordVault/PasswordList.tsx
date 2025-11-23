import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, db } from '@/firebase/firebase';
import { decryptPassword } from '@/utils/crypto';
import type { PasswordType } from '@/utils/types';
import clsx from 'clsx';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Copy, Eye, EyeOff, Globe, LockKeyhole, Trash2 } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';

interface PasswordListProps {
  passwords: PasswordType[];
}

const PasswordList: FC<PasswordListProps> = ({ passwords }) => {
  const [loggedInUser] = useAuthState(auth)
  const [selectedPassword, setSelectedPassword] = useState<PasswordType | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (passwords && passwords.length > 0) {
      setSelectedPassword(passwords[0])
    } else {
      setSelectedPassword(null)
    }
  }, [passwords])

  const handlePasswordSelect = (password: PasswordType) => {
    setSelectedPassword(password);
    setIsPasswordVisible(false); // hide password
    if (isMobile) setIsDialogOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  function formatFirestoreDate(ts: any): string {
    const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1_000_000)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  async function deletePassword(userId: string | undefined, passwordId: string | undefined) {
    if (!userId || !passwordId) {
      return;
    }
   try {
    const userRef = doc(db, "users", userId)
    const snap = await getDoc(userRef)
    if (!snap.exists()) return
    const data = snap.data()
    const updatedPasswords = (data.passwords || []).filter((p: any) => p.id !== passwordId)
    await updateDoc(userRef, { passwords: updatedPasswords });
    toast.success('Deleted password from the vault successfully!')
   } catch(error) {
    toast.error('Error deleting password from the vault')
   }
  }

  const DeletePassword = () => (
    <Button variant="destructive" size="icon" onClick={() => deletePassword(loggedInUser?.uid, selectedPassword?.id)}>
          <Trash2 className="h-5 w-5" />
        </Button>
  );

  const PasswordDetails = () => (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  <Card className={`bg-transparent ${isMobile && "border-none shadow-none p-2"}`}>
    <CardHeader className={`${isMobile && "p-0"}`}>
      <CardTitle className='flex items-center justify-between'>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block p-3 bg-transparent rounded-md">
            <LockKeyhole className="h-6 w-6 text-white" />
          </div>
          <span className="text-white">{selectedPassword?.website}</span>
        </div>
        <DeletePassword />
      </CardTitle>
    </CardHeader>

    <CardContent className={`space-y-6 bg-transparent ${isMobile && "p-0"}`}>
        <div className="space-y-2">
          <Label htmlFor="username">Username / Email / Phone number</Label>
          <div className="flex items-center gap-2">
            <div className='text-sm flex-1 text-muted-foreground select-none p-2.5 bg-[oklab(1_0_0_/_0.045)] rounded-md' id="username">{selectedPassword?.username}</div>
            <Button variant="outline" className='cursor-pointer' size="icon" onClick={() => handleCopy(selectedPassword?.username || '')}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="flex items-center gap-2">
          <div
            id="password"
            className="text-sm flex-1 text-muted-foreground select-none p-2.5 bg-[oklab(1_0_0_/_0.045)] rounded-md"
          >
            {selectedPassword
              ? (isPasswordVisible
                  ? decryptPassword(selectedPassword.password)
                  : '••••••••')
              : ''}
          </div>

            <Button variant="outline"  className='cursor-pointer' size="icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="outline"  className='cursor-pointer' size="icon" onClick={() => handleCopy(selectedPassword ? decryptPassword(selectedPassword.password) : '')}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedPassword?.notes && (
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <p id="notes" className='text-sm flex-1 text-muted-foreground p-2.5 bg-[oklab(1_0_0_/_0.045)] rounded-md'>{selectedPassword.notes}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Last Updated</Label>
          <p className="text-sm text-muted-foreground">{selectedPassword?.updatedAt && formatFirestoreDate(selectedPassword.updatedAt)}</p>
        </div>
    </CardContent>
  </Card>
</motion.div>
  );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
      {/* Left Column: Password List */}
      <motion.div initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }} className="sm:col-span-1 flex flex-col gap-2">
        {passwords.map((p) => (
          <Card
            key={p.website + p.username}
            className={clsx('cursor-pointer transition-all py-3 bg-transparent', {
              // 'bg-background': isMobile,
              'border-white bg-muted/10': !isMobile && selectedPassword?.website === p.website && selectedPassword?.username === p.username,
              'hover:bg-muted/20': !isMobile && selectedPassword?.website !== p.website || selectedPassword?.username !== p.username,
            })}
            onClick={() => handlePasswordSelect(p)}
          >
            <CardContent className="flex items-center gap-4 px-3">
              <div className={`${isMobile ? 'p-3' : 'p-2' } bg-transparent rounded-md`}>
                <Globe className={`${isMobile ? 'h-6 w-6' : 'h-5 w-5' } text-white`} />
              </div>
              <div className='truncate'>
                <p className={`font-semibold ${!isMobile && 'text-sm'} truncate`}>{p.website}</p>
                <p className="text-xs text-muted-foreground truncate">{p.username}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Right Column (Desktop only) */}
      {!isMobile && (
        <div className="sm:col-span-2">
          {selectedPassword ? <PasswordDetails /> : (
            <Card className='h-full flex items-center justify-center bg-transparent p-8'>
              <div className='text-center'>
                <p className='text-muted-foreground'>Select a password to view details</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Dialog for mobile */}
      {isMobile && selectedPassword && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
        <DialogContent className="p-2 [&>button]:hidden bg-blur-image">
          <PasswordDetails />
        </DialogContent>
      </Dialog>
      )}
    </section>
  );
};

export default PasswordList;
