import { Metadata } from "next";
import { CategoryDetail } from "../components/CategoryDetail";

export const metadata: Metadata = {
  title: "MoneyEz | Chi tiết nhóm",
  description: "Chi tiết nhóm trong hệ thống",
};

const CategoryDetailPage = () => {
  return <CategoryDetail />;
};

export default CategoryDetailPage;
