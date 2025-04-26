import { Metadata } from "next";
import { UserList } from "./components";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý người dùng",
  description: "Theo dõi, quản lý người dùng trong hệ thống",
};

const UserManagement = () => {
  return <UserList />;
};

export default UserManagement;
