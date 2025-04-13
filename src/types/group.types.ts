import { BaseEntity } from "./common.type";
import { UserInfo } from "./user.types";

export interface Group extends BaseEntity {
  id: string;
  name: string;
  nameUnsign: string;
  description: string | null;
  currentBalance: number;
  status: "ACTIVE" | "INACTIVE";
  visibility: "PUBLIC" | "PRIVATE";
  imageUrl: string | null;
  groupMembers: GroupMembers[];
}

export interface GroupMembers {
  groupId: string;
  userId: string;
  contributionPercentage: number;
  role: string;
  status: string;
  userInfo: UserInfo;
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}
