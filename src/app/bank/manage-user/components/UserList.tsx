"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { VALID_ROLE } from "@/helpers/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { useUserManagementPage } from "../hooks/useUserManagementPage";
import { AddUserModal } from "./AddUserModal";
import { UserDetailModal } from "./UserDetailModel";

const UserList = () => {
  const { state, handler } = useUserManagementPage();
  const columns = useMemo(
    () => [
      {
        title: state.TITLE.INDEX,
        dataIndex: state.FORM_NAME.INDEX,
        key: state.FORM_NAME.INDEX,
        render: (_: any, _record: any, index: number) =>
          (state.pageIndex - 1) * state.pageSize + index + 1,
      },
      {
        title: state.TITLE.EMAIL,
        dataIndex: state.FORM_NAME.EMAIL,
        width: "35%",
      },
      {
        title: state.TITLE.AVATAR,
        dataIndex: state.FORM_NAME.AVATAR,
        width: "10%",
        render: (avatar: string, record: any) =>
          avatar ? (
            <Image
              src={avatar}
              alt={record?.fullName}
              width={50}
              height={50}
              objectFit="cover"
              className="h-12 w-12 rounded-[100%] transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-medium uppercase text-white">
                {record?.fullName?.charAt(0)}
              </span>
            </div>
          ),
      },
      {
        title: state.TITLE.FULLNAME,
        dataIndex: state.FORM_NAME.FULLNAME,
        width: "20%",
      },
      {
        title: state.TITLE.PHONE_NUMBER,
        dataIndex: state.FORM_NAME.PHONE_NUMBER,
        width: "15%",
      },
      {
        title: state.TITLE.ROLE,
        dataIndex: state.FORM_NAME.ROLE,
        width: "10%",
        render: (role: string) => {
          let roleText = COMMON_CONSTANT.EMPTY_STRING;
          let tagColor = COMMON_CONSTANT.EMPTY_STRING;
          switch (role) {
            case VALID_ROLE.USER:
              roleText = state.TITLE.USER;
              tagColor = "blue";
              break;
            case VALID_ROLE.ADMIN:
              roleText = state.TITLE.ADMIN;
              tagColor = "pink";
              break;
            default:
              break;
          }
          return <Tag color={tagColor}>{roleText}</Tag>;
        },
      },
      {
        width: "10%",
        title: state.TITLE.FUNCTIONS,
        dataIndex: COMMON_CONSTANT.EMPTY_STRING,
        render: (record: any) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => handler.handleViewDetail(record)}
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
            >
              <EyeOutlined color="blue" className="text-primary" />
            </Button>
            <Button
              onClick={() => handler.handleDeleteUser(record.id)}
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
    [],
  );

  return (
    <TableListLayout
      subTitle={state.TITLE.SUB_TITLE}
      title={state.TITLE.MANAGE_USER}
      breadcrumbItems={[]}
    >
      <SearchAndAdd
        searchPlaceholder={state.TITLE.SEARCH}
        addButtonText={state.BUTTON.ADD_USER}
        onSearch={(value) => handler.setSearchQuery(value)}
        onAddClick={handler.handleOpenModalAdd}
      />
      <TableCustom
        title={state.TITLE.USER_LIST}
        columns={columns}
        dataSource={state?.data?.items}
        pagination={{
          current: state.pageIndex,
          total: state?.data?.totalCount,
          pageSize: state.pageSize,
        }}
        onChange={handler.handlePageChange}
        loading={state.isLoadingUserList}
        rowKey={(record: { id: number }) => record.id}
      />
      <AddUserModal />
      <UserDetailModal
        visible={state.isDetailModalVisible}
        onClose={handler.handleCloseDetailModal}
        userData={state.selectedUser as any}
      />
    </TableListLayout>
  );
};

export { UserList };
