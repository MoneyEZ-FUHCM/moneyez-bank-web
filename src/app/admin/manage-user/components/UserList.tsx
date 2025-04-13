"use client";

import Avatar from "@/assets/images/logo/avatar_user.jpg";
import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { VALID_ROLE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatTimestamp } from "@/utils";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { useUserManagementPage } from "../hooks/useUserManagementPage";
import { AddUserModal } from "./AddUserModal";

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
        width: "15%",
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
        width: "15%",
      },
      {
        title: state.TITLE.PHONE_NUMBER,
        dataIndex: state.FORM_NAME.PHONE_NUMBER,
        width: "10%",
      },
      {
        title: state.TITLE.DOB,
        dataIndex: state.FORM_NAME.DOB,
        width: "7%",
        render: (dob: string) =>
          dob ? formatTimestamp(dob) : COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: state.TITLE.ADDRESS,
        dataIndex: state.FORM_NAME.ADDERSS,
        width: "13%",
        render: (address: string) => address || COMMON_CONSTANT.EMPTY_STRING,
      },
      {
        title: state.TITLE.ROLE,
        dataIndex: state.FORM_NAME.ROLE,
        width: "7%",
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
        title: state.TITLE.STATUS,
        dataIndex: state.FORM_NAME.STATUS,
        render: (status: boolean) => {
          let statusText = status ? state.TITLE.ACTIVE : state.TITLE.BLOCKED;
          let tagColor = status ? "green" : "red";
          return <Tag color={tagColor}>{statusText}</Tag>;
        },
        width: "2%",
      },
      {
        title: state.TITLE.FUNCTIONS,
        dataIndex: COMMON_CONSTANT.EMPTY_STRING,
        render: (record: any) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
            >
              <EyeOutlined color="blue" className="text-primary" />
            </Button>
            <Button
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
            >
              <EditOutlined color="blue" className="text-primary" />
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
    <TableListLayout title={state.TITLE.MANAGE_USER} breadcrumbItems={[]}>
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
    </TableListLayout>
  );
};

export { UserList };
