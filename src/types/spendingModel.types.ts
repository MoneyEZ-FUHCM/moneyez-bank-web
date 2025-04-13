import { Category } from "./category.types";
import { BaseEntity } from "./common.type";

export interface SpendingModel extends BaseEntity {
  name: string;
  description: string;
  isTemplate: boolean;
  spendingModelCategories: SpendingModelCategory[];
}

export interface SpendingModelDetailProps {
  data: {
    name: string;
    nameUnsign: string;
    description: string;
    isTemplate: boolean;
    spendingModelCategories: SpendingModelCategory[];
    id: string;
    createdDate: string;
    createdBy: string | null;
    updatedDate: string | null;
    updatedBy: string | null;
    isDeleted: boolean;
  };
}

export interface CategoryCardProps {
  spendingModelId: string;
  category: Category;
  percentageAmount: number;
  onRemove: () => void;
}

export interface Subcategory {
  name: string;
  description: string;
  icon: string;
  id: string;
}

export interface SpendingModelCategory {
  categoryId: string;
  spendingModelId: string;
  percentageAmount: number;
  category: Category;
}
