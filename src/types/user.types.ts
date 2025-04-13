import { BaseEntity } from "./common.type";

export interface User extends BaseEntity {
  email: string;
  confirmEmail: string | null;
  avatar: string | null;
  fullName: string;
  unsignFullName: string | null;
  address: string | null;
  phoneNumber: string;
  dob: string | null;
  gender: number;
  role: "ADMIN" | "USER" | "OTHER";
}

export interface UserInfo {
  fullName: string;
  nameUnsign: string;
  email: string;
  dob: string | null;
  gender: string | null;
  address: string | null;
  phoneNumber: string;
  avatarUrl: string | null;
  googleId: string | null;
  isVerified: boolean;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  id: string;
  createdDate: string;
  createdBy: string | null;
  updatedDate: string;
  updatedBy: string | null;
  isDeleted: boolean;
}
