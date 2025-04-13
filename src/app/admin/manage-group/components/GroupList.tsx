"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatCurrency } from "@/utils";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { useGroupManagementPage } from "../hooks/useGroupManagementPage";
import { AddGroupModal } from "./AddGroupModal";

const GroupList = () => {
  const { state, handler } = useGroupManagementPage();
  const columns = useMemo(
    () => [
      {
        title: state.TITLE.INDEX,
        dataIndex: state.FORM_NAME.INDEX,
        key: state.FORM_NAME.INDEX,
        width: "5%",
        render: (_: any, _record: any, index: number) =>
          (state.pageIndex - 1) * state.pageSize + index + 1,
      },
      {
        title: state.TITLE.NAME,
        dataIndex: state.FORM_NAME.NAME,
        width: "15%",
      },
      {
        title: state.TITLE.AVATAR,
        dataIndex: state.FORM_NAME.IMAGE_URL,
        width: "10%",
        render: (imageUrl: string, record: any) =>
          imageUrl ? (
            <Image
              src={imageUrl}
              alt={record?.name}
              width={50}
              height={50}
              objectFit="cover"
              className="h-12 w-12 rounded-[100%] transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-medium uppercase text-white">
                {record?.name?.charAt(0)}
              </span>
            </div>
          ),
      },
      {
        title: state.TITLE.DESCRIPTION,
        dataIndex: state.FORM_NAME.DESCRIPTION,
        width: "20%",
      },
      {
        title: state.TITLE.BALANCE,
        dataIndex: state.FORM_NAME.CURRENT_BALANCE,
        width: "10%",
        render: (currentBalance: number) => formatCurrency(currentBalance),
      },
      {
        title: state.TITLE.VISIBILITY,
        dataIndex: state.FORM_NAME.VISIBILITY,
        width: "10%",
        render: (visibility: string) => {
          let visibilityText =
            visibility === "PUBLIC" ? state.TITLE.PUBLIC : state.TITLE.PRIVATE;
          let tagColor = visibility === "PUBLIC" ? "blue" : "orange";
          return <Tag color={tagColor}>{visibilityText}</Tag>;
        },
      },
      {
        title: state.TITLE.STATUS,
        dataIndex: state.FORM_NAME.STATUS,
        width: "10%",
        render: (status: string) => {
          let statusText =
            status === "ACTIVE" ? state.TITLE.ACTIVE : state.TITLE.INACTIVE;
          let tagColor = status === "ACTIVE" ? "green" : "red";
          return <Tag color={tagColor}>{statusText}</Tag>;
        },
      },
      {
        title: state.TITLE.FUNCTIONS,
        dataIndex: COMMON_CONSTANT.EMPTY_STRING,
        width: "6%",
        render: (record: any) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => handler.handleViewDetail(record)}
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
            >
              <EyeOutlined color="blue" className="text-primary" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <TableListLayout title={state.TITLE.MANAGE_GROUP} breadcrumbItems={[]}>
      <SearchAndAdd
        isAddButton={false}
        searchPlaceholder={state.TITLE.SEARCH}
        addButtonText={state.BUTTON.ADD_GROUP}
        onSearch={(value) => handler.setSearchQuery(value)}
        onAddClick={handler.handleOpenModalAdd}
      />
      <TableCustom
        title={state.TITLE.GROUP_LIST}
        columns={columns}
        dataSource={state?.data?.items}
        pagination={{
          current: state.pageIndex,
          total: state?.data?.totalCount,
          pageSize: state.pageSize,
        }}
        onChange={handler.handlePageChange}
        loading={state.isLoadingGroupList}
        rowKey={(record: { id: number }) => record.id}
      />
      <AddGroupModal />
    </TableListLayout>
  );
};

export { GroupList };
