import { Metadata } from "next";
import { ChartView } from "./components";

export const metadata: Metadata = {
  title: "MoneyEz | Thống kê",
  description: "Thống kê quá trình hoạt động của hệ thống theo tuần",
};

const ChartPage = () => {
  return <ChartView />;
};

export default ChartPage;
