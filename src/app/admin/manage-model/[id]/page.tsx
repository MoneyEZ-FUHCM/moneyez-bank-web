import { Metadata } from "next";
import { SpendingModelDetail } from "../components/SpendingModelDetail";

export const metadata: Metadata = {
  title: "MoneyEz | Chi tiết danh mục chi tiêu",
  description: "Chi tiết danh mục chi tiêu trong hệ thống",
};

const SpendingModelDetailPage = () => {
  return <SpendingModelDetail />;
};

export default SpendingModelDetailPage;
