import { BaseEntity } from "./common.type";

export interface Category extends BaseEntity {
  id: string;
  name: string;
  nameUnsign: string;
  description: string;
  subcategories?: SubCategory[];
  code: string;
  icon: string;
  type: "EXPENSE" | "INCOME";
}

export interface SubCategory extends Category {}
