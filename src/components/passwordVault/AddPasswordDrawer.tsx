"use client"

import { useState, type ChangeEvent } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Eye, EyeOff, Save, X } from "lucide-react"
import { encryptPassword } from "@/utils/crypto"
import { auth, db } from "@/firebase/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { toast } from "sonner"
import type { PasswordType } from "@/utils/types"

type PasswordForm = {
  website: string
  username: string
  password: string
  notes: string
}

export default function AddPasswordDrawer() {
  const [loggedInUser] = useAuthState(auth)
  const [open, setOpen] = useState<boolean>(false)
  const [form, setForm] = useState<PasswordForm>({
    website: "",
    username: "",
    password: "",
    notes: "",
  })
  const [showPassword, setShowPassword] = useState<boolean>(false) // <-- new state

  const isValid = Boolean(form.website && form.username && form.password)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    if (!loggedInUser) {
      toast.error("You must be logged in to save a password.")
      return
    }

    const encryptedPassword = encryptPassword(form.password)

    const newPassword: PasswordType = {
      id: uuidv4(),
      website: form.website,
      username: form.username,
      password: encryptedPassword,
      notes: form.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      const userDocRef = doc(db, "users", loggedInUser.uid)
      await updateDoc(userDocRef, {
        passwords: arrayUnion(newPassword),
      })

      toast.success("Password saved successfully!")
      resetForm()
      setOpen(false)
      setShowPassword(false) // reset visibility
    } catch (error) {
      console.error(error)
      toast.error("Failed to save password. Please try again.")
    }
  }

  const resetForm = (): void => {
    setForm({
      website: "",
      username: "",
      password: "",
      notes: "",
    })
    setShowPassword(false)
  }

  const handleCancel = (): void => {
    resetForm()
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Plus className="m-0 md:mr-1" />
          <span className="hidden md:inline-flex">Save Password</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-3xl mx-auto bg-blur-image">
        <DrawerHeader>
          <DrawerTitle>Save Your Password</DrawerTitle>
          <DrawerDescription>
            Store your login details securely.
          </DrawerDescription>
        </DrawerHeader>

        <div className="grid gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="website">Website Address</Label>
            <Input
              id="website"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Enter the website address..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username / Email / Phone number</Label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter the username / email / phone number..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // <-- toggle type
                value={form.password}
                onChange={handleChange}
                placeholder="Enter the password..."
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Max 300 characters..."
              maxLength={300}
            />
          </div>
        </div>

        <DrawerFooter className="flex flex-row gap-4">
          <Button className="cursor-pointer" variant={'outline'} onClick={handleSubmit} disabled={!isValid}>
          <Save />
            Save
          </Button>
          <DrawerClose asChild>
            <Button className="cursor-pointer" variant="destructive" onClick={handleCancel}>
              <X />
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
