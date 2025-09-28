export enum UserRole {
  Admin = 'Admin',
  Member = 'Member',
}

export enum Categories {
  PERSONAL = 'PERSONAL',
  PROFESSIONAL = 'PROFESSIONAL',
  HEALTH = 'HEALTH',
  INVESTMENTS = 'INVESTMENTS',
  EDUCATIONAL = 'EDUCATIONAL',
  HOME = 'HOME',
}

export type PasswordType = {
  id: string;
  website: string;
  username: string;
  password: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
