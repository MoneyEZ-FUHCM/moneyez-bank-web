"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { formatTimestamp } from "@/utils";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import { useMemo } from "react";
import { useSpendingModelManagementPage } from "../hooks/useSpendingModelManagementPage";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { AddSpendingModelModal } from "./AddSpendingModelModal";
import { useRouter } from "next/navigation";
import parse from "html-react-parser";

const SpendingModelList = () => {
  const { state, handler } = useSpendingModelManagementPage();
  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        title: state.TITLE.INDEX,
        dataIndex: state.FORM_NAME.INDEX,
        key: state.FORM_NAME.INDEX,
        render: (_: any, _record: any, index: number) => index + 1,
        width: "2%",
      },
      {
        title: state.TITLE.NAME,
        dataIndex: state.FORM_NAME.NAME,
        width: "29%",
      },
      {
        title: state.TITLE.DESCRIPTION,
        dataIndex: state.FORM_NAME.DESCRIPTION,
        width: "34%",
        render: (description: string) => parse(description),
      },
      {
        title: state.TITLE.TYPE,
        dataIndex: state.FORM_NAME.ISTEMPLATE,
        width: "13%",
        render: (status: boolean) => {
          let statusText = status ? "Mặc định" : "Tùy chỉnh";
          let tagColor = status ? "green" : "red";
          return <Tag color={tagColor}>{statusText}</Tag>;
        },
      },
      {
        title: state.TITLE.CREATED_AT,
        dataIndex: state.FORM_NAME.CREATED_DATE,
        width: "12%",
        render: (date: string) =>
          date ? formatTimestamp(date) : COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: state.TITLE.FUNCTIONS,
        dataIndex: COMMON_CONSTANT.EMPTY_STRING,
        width: "10%",
        render: (record: any) => (
          <div className="flex items-center gap-2">
            <Button
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
              onClick={() => handler.handleViewDetail(record)}
            >
              <EyeOutlined color="blue" className="text-primary" />
            </Button>
            <Button
              onClick={() => handler.handleDeleteModel(record.id)}
              danger
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
            >
              <DeleteOutlined />
            </Button>
          </div>
        ),
      },
    ],
    [handler, router],
  );

  return (
    <TableListLayout title={state.TITLE.MANAGE_MODEL} breadcrumbItems={[]}>
      <SearchAndAdd
        searchPlaceholder={state.TITLE.SEARCH}
        addButtonText={state.BUTTON.ADD_MODEL}
        onSearch={(value) => console.log("Tìm kiếm...", value)}
        onAddClick={handler.handleOpenModalAdd}
      />
      <TableCustom
        title={state.TITLE.MODEL_LIST}
        columns={columns}
        dataSource={state?.data?.items}
        pagination={{
          current: state.pageIndex,
          total: state?.data?.totalCount,
          pageSize: state.pageSize,
        }}
        onChange={handler.handlePageChange}
        loading={state.isLoadingModelList}
        rowKey={(record: { id: number }) => record.id}
      />
      <AddSpendingModelModal />
    </TableListLayout>
  );
};

export { SpendingModelList };
