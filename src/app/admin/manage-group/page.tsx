import { Metadata } from "next";
import { GroupList } from "./components/GroupList";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý nhóm",
  description: "Theo dõi, quản lý nhóm trong hệ thống",
};

const GroupManagement = () => {
  return <GroupList />;
};

export default GroupManagement;
