"use client";

import { TableListLayout } from "@/components";
import { renderIcon } from "@/components/common/IconRender";
import { CommonForm } from "@/components/common/table/CommonForm";
import { ButtonCustom } from "@/components/ui/button";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { useGetCategoryByIdQuery } from "@/services/admin/category";
import { useGetSubCategoryListQuery } from "@/services/admin/subCategory";
import { formatTimestamp } from "@/utils";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Form,
  Modal,
  Select,
  Spin,
  Table,
  Tag,
} from "antd";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { TEXT_TRANSLATE } from "../category.translate";
import { useCategoryManagementPage } from "../hooks/useCategoryManagementPage";

const CategoryDetail = () => {
  const { id } = useParams();
  const { TITLE, BUTTON } = TEXT_TRANSLATE;
  const { state, handler } = useCategoryManagementPage();

  const {
    data: category,
    isLoading,
    refetch,
  } = useGetCategoryByIdQuery(id as string);
  const { data: allSubcategories } = useGetSubCategoryListQuery({
    PageIndex: 1,
    PageSize: 50,
    search: "",
  });

  const breadcrumbItems = [
    {
      href: "/admin/manage-category",
      title: TITLE.MANAGE_CATEGORY,
    },
    {
      title: TITLE.CATEGORY_DETAIL,
    },
  ];

  const subCategoryColumns = useMemo(
    () => [
      {
        title: TITLE.INDEX,
        key: "index",
        width: "2%",
        render: (_: any, __: any, index: number) => index + 1,
      },
      {
        title: TITLE.CODE,
        dataIndex: "code",
        width: "12%",
      },
      {
        title: TITLE.ICON,
        dataIndex: "icon",
        width: "5%",
        render: (icon: string) => (
          <div className="text-primary">{renderIcon(icon)}</div>
        ),
      },
      {
        title: TITLE.NAME,
        dataIndex: "name",
        width: "15%",
      },
      {
        title: TITLE.DESCRIPTION,
        dataIndex: "description",
        width: "35%",
      },
      {
        title: TITLE.CREATED_AT,
        dataIndex: "createdDate",
        width: "10%",
        render: (date: string) => formatTimestamp(date),
      },
      {
        title: TITLE.ACTION,
        key: "action",
        width: "6%",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() =>
                handler.handleRemoveSubcategory(
                  refetch,
                  category?.data?.id as string,
                  record.id,
                )
              }
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
    [category?.data?.code, handler, refetch],
  );

  const availableSubcategories = useMemo(() => {
    if (!allSubcategories?.items || !category?.data?.subcategories) return [];
    const assignedCodes = new Set(
      category.data.subcategories.map((sub) => sub.code),
    );
    return allSubcategories.items.filter((sub) => !assignedCodes.has(sub.code));
  }, [allSubcategories?.items, category?.data?.subcategories]);

  const subcategoryFields = [
    {
      name: "subcategoryCodes",
      label: TITLE.SELECT_SUBCATEGORIES,
      component: (
        <Select
          mode="multiple"
          placeholder={TITLE.SELECT_SUBCATEGORIES}
          loading={isLoading}
          optionLabelProp="label"
          options={availableSubcategories.map((sub) => ({
            label: (
              <div className="flex gap-2">
                <span className="text-primary">{renderIcon(sub.icon)}</span>
                <span>{sub.name}</span>
              </div>
            ),
            value: sub.code,
          }))}
          optionRender={(option) => option.label}
        />
      ),
      rules: [
        { required: true, message: "Bạn phải chọn ít nhất một danh mục con" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spin />
      </div>
    );
  }

  return (
    <TableListLayout
      title={TITLE.CATEGORY_DETAIL}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {TITLE.MAIN_CATEGORY_INFO}
          </h2>
          <Descriptions bordered column={1}>
            <Descriptions.Item label={TITLE.CODE}>
              {category?.data?.code || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.ICON}>
              {category?.data?.icon
                ? renderIcon(category?.data?.icon)
                : COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.NAME}>
              {category?.data?.name || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.DESCRIPTION}>
              {category?.data?.description || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.TYPE}>
              {category?.data?.type ? (
                <Tag
                  color={category?.data?.type === "INCOME" ? "green" : "red"}
                >
                  {category?.data?.type === "INCOME" ? "Thu nhập" : "Chi tiêu"}
                </Tag>
              ) : (
                COMMON_CONSTANT.EMPTY_STRING
              )}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.CREATED_AT}>
              {category?.data?.createdDate
                ? formatTimestamp(category?.data?.createdDate)
                : COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.CREATED_BY}>
              {category?.data?.createdBy || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.UPDATED_AT}>
              {category?.data?.updatedDate
                ? formatTimestamp(category?.data?.updatedDate)
                : COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
            <Descriptions.Item label={TITLE.UPDATED_BY}>
              {category?.data?.updatedBy || COMMON_CONSTANT.EMPTY_STRING}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className="rounded-xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{TITLE.SUBCATEGORIES}</h2>
            <ButtonCustom
              className="bg-primary text-white"
              onClick={handler.handleOpenModalAdd}
            >
              <PlusOutlined className="mr-1" />
              {BUTTON.ADD_SUB_CATEGORY}
            </ButtonCustom>
          </div>
          <Table
            columns={subCategoryColumns}
            dataSource={category?.data?.subcategories || []}
            pagination={false}
            rowKey="id"
          />
        </div>

        <Modal
          title={
            <p className="text-lg font-bold text-primary">
              {TITLE.ADD_SUB_CATEGORY_TO_CATEGORY}
            </p>
          }
          open={state.isOpen}
          onOk={() =>
            handler.handleAssignCategory(
              refetch,
              category?.data?.code as string,
            )
          }
          onCancel={handler.handleCancel}
          okText={BUTTON.ADD_SUB_CATEGORY}
          cancelText={BUTTON.CANCEL}
          okButtonProps={{ className: "custom-ok-button" }}
        >
          <CommonForm
            colSpan={24}
            form={state.form}
            fields={subcategoryFields}
          />
        </Modal>
      </div>
    </TableListLayout>
  );
};

export { CategoryDetail };
