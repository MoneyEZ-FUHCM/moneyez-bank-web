import { Metadata } from "next";
import GroupDetailView from "../components/GroupDetailView";

export const metadata: Metadata = {
  title: "MoneyEz | Chi tiết danh mục chi tiêu",
  description: "Chi tiết danh mục chi tiêu trong hệ thống",
};

const GroupDetailPage = () => {
  return <GroupDetailView />;
};

export default GroupDetailPage;
