import { useGetWebHookConfigListQuery } from "@/services/webhook";
import { TablePaginationConfig } from "antd";
import { useParams } from "next/navigation";
import { useState } from "react";

const useWebhookConfig = () => {
  const { id } = useParams();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: webHookConfigList } = useGetWebHookConfigListQuery(
    {
      accountId: id,
      PageIndex: pageIndex,
      PageSize: pageSize,
    },
    { skip: !id },
  );

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  return {
    state: {
      pageIndex,
      pageSize,
      webHookConfigList,
    },
    handler: {
      handlePageChange,
    },
  };
};

export { useWebhookConfig };
