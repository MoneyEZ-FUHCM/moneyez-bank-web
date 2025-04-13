import { Metadata } from "next";
import { CategoryList } from "./components";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý danh mục chi tiêu",
  description: "Theo dõi, quản lý danh mục chi tiêu trong hệ thống",
};

const CategoryManagement = () => {
  return <CategoryList />;
};

export default CategoryManagement;
