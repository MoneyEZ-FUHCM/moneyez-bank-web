import { Metadata } from "next";
import { QuizCreator } from "./components";

export const metadata: Metadata = {
  title: "MoneyEz | Quản lý câu hỏi",
  description: "Tạo và quản lý câu hỏi cho hệ thống",
};

const UserManagement = () => {
  return <QuizCreator />;
};

export default UserManagement;
