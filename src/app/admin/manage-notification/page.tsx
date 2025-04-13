import { Metadata } from "next";
import { NotificationView } from "./components";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý thông báo",
  description: "Theo dõi, quản lý thông báo hệ thống",
};

const NotificationManagement = () => {
  return <NotificationView />;
};

export default NotificationManagement;
