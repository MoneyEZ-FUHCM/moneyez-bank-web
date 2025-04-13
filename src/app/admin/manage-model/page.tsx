import { Metadata } from "next";
import { SpendingModelList } from "./components/SpendingModelList";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý mô hình chi tiêu",
  description: "Theo dõi, quản lý mô hình chi tiêu trong hệ thống",
};

const UserManagement = () => {
  return <SpendingModelList />;
};

export default UserManagement;
