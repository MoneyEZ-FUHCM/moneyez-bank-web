import { Metadata } from "next";
import { BankManagement } from "./components";

export const metadata: Metadata = {
  title: "MoneyEz | Ngân hàng",
  description: "Ngân hàng demo phục vụ cho hệ thống EzMoney",
};

const BankManagementPage = () => {
  return <BankManagement />;
};

export default BankManagementPage;
