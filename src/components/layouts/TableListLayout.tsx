"use client";
import { TableProps } from "antd";
import { ReactNode } from "react";
import { BreadScrumb } from "../common/BreadScrumb";

interface CommonTableLayoutProps extends TableProps<any> {
  title: any;
  breadcrumbItems: { href?: string; title: ReactNode }[];
  children?: ReactNode;
}

const TableListLayout = ({
  title,
  breadcrumbItems = [],
  children,
  ...tableProps
}: CommonTableLayoutProps) => {
  return (
    <main>
      {breadcrumbItems.length > 0 && <BreadScrumb items={breadcrumbItems} />}
      <div className="bg-gray-50 p-4 md:p-6">
        {/* <div className="mb-3 mt-3 rounded-xl bg-[#fff] p-5 transition-all duration-500">
          <p className="text-3xl font-bold">{title}</p>
        </div> */}
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-medium text-gray-800">{title}</h1>
        </div>
        <div className="rounded-xl bg-[#fff] p-5">{children}</div>
      </div>
    </main>
  );
};

export { TableListLayout };
