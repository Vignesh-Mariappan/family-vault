import CryptoJS from "crypto-js"

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY as string

// Encrypt password
export function encryptPassword(password: string): string {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString()
}

// Decrypt password
export function decryptPassword(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
