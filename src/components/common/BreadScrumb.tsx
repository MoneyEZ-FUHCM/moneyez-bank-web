"use client";
import React, { memo } from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";

interface BreadcrumbItem {
  href?: string;
  title: React.ReactNode;
}

interface BreadScrumbProps {
  items: BreadcrumbItem[];
}

const BreadScrumb = memo(({ items }: BreadScrumbProps) => {
  const breadcrumbItems = [
    {
      href: "/admin/statistic",
      title: <HomeOutlined />,
    },
    ...items,
  ];

  return (
    <Breadcrumb>
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item key={index}>
          {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
});

export { BreadScrumb };
