"use client";

import { SearchAndAdd, TableCustom, TableListLayout } from "@/components";
import { renderIcon } from "@/components/common/IconRender";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { SubCategory } from "@/types/category.types";
import { formatTimestamp } from "@/utils";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMemo } from "react";
import { useSubCategoryManagementPage } from "../hooks/useSubCategoryManagementPage";
import { FunctionSubCategoryModal } from "./FunctionSubcategoryModal";

const SubCategoryList = () => {
  const { state, handler } = useSubCategoryManagementPage();

  const columns = useMemo(
    () => [
      {
        title: state.TITLE.INDEX,
        dataIndex: state.FORM_NAME.INDEX,
        key: state.FORM_NAME.INDEX,
        width: "2%",
        render: (_: any, _record: any, index: number) =>
          (state.pageIndex - 1) * state.pageSize + index + 1,
      },
      {
        title: state.TITLE.CODE,
        dataIndex: state.FORM_NAME.CODE,
        width: "15%",
      },
      {
        title: state.TITLE.ICON,
        dataIndex: state.FORM_NAME.ICON,
        width: "7%",
        render: (icon: string) => (
          <div className="text-primary">{renderIcon(icon)}</div>
        ),
      },
      {
        title: state.TITLE.NAME,
        dataIndex: state.FORM_NAME.NAME,
        width: "20%",
      },
      {
        title: state.TITLE.DESCRIPTION,
        dataIndex: state.FORM_NAME.DESCRIPTION,
        width: "36%",
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
        render: (_: any, record: SubCategory) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              size="small"
              className="flex items-center justify-center !border-none !bg-transparent !shadow-none"
              onClick={() => handler.handleOpenModalEdit(record)}
            >
              <EditOutlined className="text-primary" />
            </Button>
            <Button
              onClick={() => handler.handleDeleteSubCategory(record.id)}
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
    [handler, state.pageIndex, state.pageSize],
  );

  return (
    <TableListLayout
      title={state.TITLE.MANAGE_SUB_CATEGORY}
      breadcrumbItems={[]}
    >
      <SearchAndAdd
        searchPlaceholder={state.TITLE.SEARCH_SUB}
        addButtonText={state.BUTTON.ADD_SUB_CATEGORY}
        onSearch={(value) => handler.setSearchQuery(value)}
        onAddClick={handler.handleOpenModalAdd}
      />
      <TableCustom
        title={state.TITLE.SUB_CATEGORY_LIST}
        columns={columns}
        dataSource={state.data?.items}
        pagination={{
          current: state.pageIndex,
          total: state.data?.totalCount,
          pageSize: state.pageSize,
        }}
        onChange={handler.handlePageChange}
        loading={state.isLoadingCategoryList}
        rowKey={(record: { id: number }) => record.id}
      />
      <FunctionSubCategoryModal />
    </TableListLayout>
  );
};

export { SubCategoryList };
