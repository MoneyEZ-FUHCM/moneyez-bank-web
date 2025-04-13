import { Metadata } from "next";
import { SubCategoryList } from "./components/SubCategoryList";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý danh mục chi tiêu",
  description: "Theo dõi, quản lý danh mục chi tiêu trong hệ thống",
};

const SubCategoryManagement = () => {
  return <SubCategoryList />;
};

export default SubCategoryManagement;
