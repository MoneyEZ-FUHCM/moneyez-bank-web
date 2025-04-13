"use client";

import { TableListLayout } from "@/components";
import { renderIcon } from "@/components/common/IconRender";
import { ButtonCustom } from "@/components/ui/button";
import { useGetCategoryListQuery } from "@/services/admin/category";
import {
  useGetSpendingModelIdQuery,
  useUpdateSpendingModelContentMutation,
  useUpdateSpendingModelMutation,
} from "@/services/admin/spendingModel";
import {
  EditOutlined,
  FileTextOutlined,
  PercentageOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { CATEGORY_TYPE_TEXT, TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { getRandomColor } from "@/helpers/libs/utils";
import { showToast } from "@/hooks/useShowToast";
import { useSpendingModelManagementPage } from "../hooks/useSpendingModelManagementPage";
import { MANAGE_MODEL_CONSTANT } from "../model.constant";
import { TEXT_TRANSLATE } from "../model.translate";
import { CategoryCard } from "./CategoryCard";

const { Title, Text, Paragraph } = Typography;

interface Category {
  id: string;
  name: string;
  icon: string;
  type: string;
}

interface SpendingModelCategory {
  categoryId: string;
  percentageAmount: number;
  category: Category;
}

interface SpendingModel {
  id: string;
  name: string;
  description: string;
  isTemplate: boolean;
  spendingModelCategories: SpendingModelCategory[];
}

interface BudgetItem {
  color: string;
  percent: number;
  name: string;
  icon: string;
}

interface CategoryFormListProps {
  form: any;
  availableCategories: Category[];
  hasExistingCategories?: boolean; // Added the missing property
}

const CategoryFormList: React.FC<CategoryFormListProps> = ({
  form,
  availableCategories,
  hasExistingCategories = false, // New prop to check if there are existing categories
}) => {
  return (
    <Form form={form} layout="vertical" name="categoryFormList">
      <Form.List name="categories">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div
                key={key}
                className="relative mb-4 rounded border p-4 shadow-sm"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Item
                    {...restField}
                    name={[name, "categoryId"]}
                    label="Danh mục"
                    rules={[
                      { required: true, message: "Vui lòng chọn danh mục" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      optionLabelProp="label"
                      showSearch
                      className="w-full"
                      filterOption={(input, option) =>
                        (
                          option?.label?.props?.children[1]?.props?.children ||
                          ""
                        )
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={availableCategories.map((cat) => ({
                        label: (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center text-primary">
                              {renderIcon(cat.icon)}
                            </span>
                            <span>{cat.name}</span>
                            <Tag
                              color={
                                cat.type === CATEGORY_TYPE_TEXT.INCOME
                                  ? "green"
                                  : "red"
                              }
                            >
                              {cat.type === CATEGORY_TYPE_TEXT.INCOME
                                ? "Thu nhập"
                                : "Chi tiêu"}
                            </Tag>
                          </div>
                        ),
                        value: cat.id,
                      }))}
                      optionRender={(option) => option.label}
                    />
                  </Form.Item>
                  {!hasExistingCategories && (
                    <Form.Item
                      {...restField}
                      name={[name, "percentageAmount"]}
                      label="Phần trăm"
                      rules={[
                        { required: true, message: "Vui lòng nhập phần trăm" },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        className="w-full"
                        formatter={(value) => `${value}%`}
                        addonAfter={<PercentageOutlined />}
                      />
                    </Form.Item>
                  )}
                </div>
                {fields.length > 1 && (
                  <Button
                    type="link"
                    danger
                    className="absolute right-2 top-2"
                    onClick={() => remove(name)}
                  >
                    Xoá
                  </Button>
                )}
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm danh mục
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

const SpendingModelDetail = () => {
  const { id } = useParams();
  const { TITLE } = TEXT_TRANSLATE;
  const { state, handler } = useSpendingModelManagementPage();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [editingPercentages, setEditingPercentages] = useState<
    Record<string, number>
  >({});
  const [isEditingAll, setIsEditingAll] = useState(false);
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE } = MANAGE_MODEL_CONSTANT;

  const {
    data: spendingModel,
    isLoading,
    refetch,
  } = useGetSpendingModelIdQuery(id as string);
  const [updateSpendingModel] = useUpdateSpendingModelMutation();
  const [updateSpendingModelContent] = useUpdateSpendingModelContentMutation();

  const { data: categories } = useGetCategoryListQuery({
    PageIndex: 1,
    PageSize: 50,
    search: "",
  });

  useEffect(() => {
    if (state.isOpen) {
      state.form.setFieldsValue({
        categories: [{ categoryId: undefined, percentageAmount: undefined }],
      });
    }
  }, [state.isOpen]);

  useEffect(() => {
    if (spendingModel?.data?.spendingModelCategories) {
      const total = spendingModel.data.spendingModelCategories.reduce(
        (sum, item) => sum + item.percentageAmount,
        0,
      );
      setTotalPercentage(total);
    }
  }, [spendingModel?.data?.spendingModelCategories]);

  useEffect(() => {
    if (isEditingAll) {
      const total = Object.values(editingPercentages).reduce(
        (sum, value) => sum + (value || 0),
        0,
      );
      setTotalPercentage(total);
    }
  }, [editingPercentages, isEditingAll]);

  const filteredCategories =
    spendingModel?.data?.spendingModelCategories.filter(
      (category) =>
        state.selectedType === "ALL" ||
        category.category.type === state.selectedType,
    );

  const availableCategories = useMemo(() => {
    if (!categories?.items || !spendingModel?.data?.spendingModelCategories)
      return [];

    const existingCategoryIds = new Set(
      spendingModel.data.spendingModelCategories.map((item) => item.categoryId),
    );

    return categories.items.filter(
      (category) => !existingCategoryIds.has(category.id),
    );
  }, [categories?.items, spendingModel?.data?.spendingModelCategories]);

  const categoryFields = [
    {
      name: "categoryId",
      label: "Danh mục",
      component: (
        <Select
          placeholder="Chọn danh mục"
          optionLabelProp="label"
          className="w-full"
          showSearch
          filterOption={(input, option) =>
            (option?.label?.props?.children[1]?.props?.children || "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={availableCategories.map((cat) => ({
            label: (
              <div className="flex items-center gap-2">
                <span className="flex items-center text-primary">
                  {renderIcon(cat.icon)}
                </span>
                <span>{cat.name}</span>
                <Tag
                  color={
                    cat.type === CATEGORY_TYPE_TEXT.INCOME ? "green" : "red"
                  }
                >
                  {cat.type === CATEGORY_TYPE_TEXT.INCOME
                    ? "Thu nhập"
                    : "Chi tiêu"}
                </Tag>
              </div>
            ),
            value: cat.id,
          }))}
          optionRender={(option) => option.label}
        />
      ),
      rules: [{ required: true, message: "Vui lòng chọn danh mục" }],
    },
    {
      name: "percentageAmount",
      label: "Phần trăm",
      component: (
        <InputNumber
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          className="w-full"
          addonAfter={<PercentageOutlined />}
        />
      ),
      rules: [{ required: true, message: "Vui lòng nhập phần trăm" }],
    },
  ];

  const breadcrumbItems = [
    {
      href: "/admin/manage-model",
      title: TITLE.MANAGE_MODEL,
    },
    {
      title: TITLE.MANAGE_MODEL_DETAIL,
    },
  ];

  useEffect(() => {
    if (spendingModel?.data) {
      form.setFieldsValue({
        name: spendingModel.data.name,
        description: spendingModel.data.description || "",
      });
    }
  }, [spendingModel?.data, form]);

  const colorMapRef = useRef<Record<string, string>>({});

  const budgets = useMemo(() => {
    if (isEditingAll) {
      return (
        spendingModel?.data?.spendingModelCategories?.map((category) => {
          if (!colorMapRef.current[category.category.id]) {
            colorMapRef.current[category.category.id] = getRandomColor();
          }
          return {
            color: colorMapRef.current[category.category.id],
            percent: editingPercentages[category.categoryId] ?? 0,
            name: category.category.name,
            icon: category.category.icon,
          };
        }) || []
      );
    }

    return (
      spendingModel?.data?.spendingModelCategories?.map((category) => {
        if (!colorMapRef.current[category.category.id]) {
          colorMapRef.current[category.category.id] = getRandomColor();
        }
        return {
          color: colorMapRef.current[category.category.id],
          percent: category.percentageAmount,
          name: category.category.name,
          icon: category.category.icon,
        };
      }) || []
    );
  }, [
    spendingModel?.data?.spendingModelCategories,
    isEditingAll,
    editingPercentages,
  ]);

  const handleUpdateModel = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        id: id as string,
        name: values.name,
        description: values.description,
        isTemplate: true,
      };
      await updateSpendingModelContent(payload).unwrap();
      showToast(
        TOAST_STATUS.SUCCESS,
        "Cập nhật nội dung mô hình chi tiêu thành công",
      );
      setIsEditing(false);
    } catch (error) {
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const handleUpdatePercentage = async () => {
    try {
      const categories = Object.entries(editingPercentages)
        .filter(([categoryId]) => {
          const category = spendingModel?.data?.spendingModelCategories.find(
            (item) => item.categoryId === categoryId,
          );
          return category?.category.type !== CATEGORY_TYPE_TEXT.INCOME;
        })
        .map(([categoryId, percentageAmount]) => ({
          categoryId,
          percentageAmount: Number(percentageAmount),
        }));

      const incomeCategories = spendingModel?.data?.spendingModelCategories
        .filter((item) => item.category.type === CATEGORY_TYPE_TEXT.INCOME)
        .map((item) => ({
          categoryId: item.categoryId,
          percentageAmount: item.percentageAmount,
        }));

      if (incomeCategories) {
        categories.push(...incomeCategories);
      }

      await updateSpendingModel({
        spendingModelId: id as string,
        categories,
      }).unwrap();
      showToast(TOAST_STATUS.SUCCESS, "Cập nhật mô hình chi tiêu thành công");

      setIsEditingAll(false);
      setEditingPercentages({});
    } catch (err: any) {
      const error = err?.data;
      if (error.errorCode === ERROR_CODE.INVALID_TOTAL_PERCENTAGE) {
        showToast(TOAST_STATUS.ERROR, "Tổng giá trị ngân sách phải bằng 100%");
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const getPercentageText = (percentage: number) => {
    if (percentage === 100) {
      return (
        <>
          Đã phân bổ đủ <span className="text-green">100%</span> ngân sách
        </>
      );
    }
    if (percentage > 100) {
      return (
        <>
          Đã phân bổ vượt quá <span className="text-red">100%</span>, vui lòng
          điều chỉnh
        </>
      );
    }
    return (
      <>
        Còn <span className="text-red">{(100 - percentage).toFixed(1)}%</span>{" "}
        chưa được phân bổ
      </>
    );
  };

  const getPercentageClass = (percentage: number) => {
    if (percentage === 100) return "font-medium text-green";
    if (percentage > 100) return "font-medium text-red";
    return "font-medium text-yellow-500";
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin mô hình..." />
      </div>
    );
  }

  return (
    <TableListLayout
      title={state.TITLE.MANAGE_MODEL_DETAIL}
      breadcrumbItems={breadcrumbItems}
    >
      <div className="min-h-screen p-6">
        <motion.div
          className="flex gap-5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="mb-8 w-full flex-[0.5] rounded-lg border shadow-md transition-shadow duration-500 hover:shadow-lg">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <Tag
                    color={spendingModel?.data?.isTemplate ? "green" : "blue"}
                    className="px-3 py-1 text-sm font-medium"
                  >
                    {spendingModel?.data?.isTemplate
                      ? "Mẫu mặc định"
                      : "Tùy chỉnh"}
                  </Tag>
                </div>
                {!isEditing && (
                  <ButtonCustom
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 hover:shadow"
                  >
                    <EditOutlined /> Chỉnh sửa
                  </ButtonCustom>
                )}
              </div>
              <div>
                {isEditing ? (
                  <Form form={form} layout="vertical" className="space-y-6">
                    <Form.Item
                      name="name"
                      label={<span className="text-sm">Tên mô hình</span>}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên mô hình",
                        },
                      ]}
                    >
                      <Input
                        className="rounded-md border-gray-300 text-lg font-bold focus:border-primary"
                        placeholder="Nhập tên mô hình"
                        prefix={<FileTextOutlined className="text-gray-400" />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label={<span className="text-sm">Mô tả chi tiết</span>}
                      rules={[
                        { required: true, message: "Vui lòng nhập mô tả" },
                      ]}
                      validateTrigger={["onChange", "onBlur"]}
                    >
                      <ReactQuill
                        theme="snow"
                        className="rounded-md border-gray-300 focus:border-primary"
                        onChange={(content) => {
                          form.setFieldsValue({ description: content });
                          if (!content.trim()) {
                            form.setFields([
                              {
                                name: "description",
                                errors: ["Vui lòng nhập mô tả"],
                              },
                            ]);
                          }
                        }}
                        placeholder="Nhập mô tả chi tiết về mô hình này..."
                      />
                    </Form.Item>
                    <div className="flex justify-end gap-3">
                      <ButtonCustom
                        onClick={() => setIsEditing(false)}
                        className="rounded-md !border !border-red !bg-white px-4 py-2 text-red transition-all"
                      >
                        Hủy
                      </ButtonCustom>
                      <ButtonCustom
                        onClick={handleUpdateModel}
                        className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90"
                      >
                        <SaveOutlined /> Lưu thay đổi
                      </ButtonCustom>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <Title
                      level={2}
                      className="mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-3xl font-bold text-transparent"
                    >
                      {spendingModel?.data?.name}
                    </Title>
                    <Divider className="my-6" />
                    <div className="mt-6 text-gray-600">
                      {parse(spendingModel?.data?.description ?? "")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mb-8 w-full flex-[0.5] rounded-lg border shadow-md transition-shadow duration-500 hover:shadow-lg">
            {budgets && budgets.length > 0 ? (
              <div className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <Title level={4} className="m-0">
                    Phân bổ ngân sách
                  </Title>
                  <div className="flex items-center gap-2">
                    {isEditingAll ? (
                      <>
                        <ButtonCustom
                          onClick={handleUpdatePercentage}
                          className="flex items-center gap-1 bg-primary text-white"
                        >
                          <SaveOutlined /> Lưu thay đổi
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => {
                            setIsEditingAll(false);
                            setEditingPercentages({});
                            const originalTotal =
                              spendingModel?.data?.spendingModelCategories.reduce(
                                (sum, item) => sum + item.percentageAmount,
                                0,
                              );
                            setTotalPercentage(originalTotal || 0);
                          }}
                          className="rounded-md !border !border-red !bg-white px-4 py-2 text-red transition-all"
                        >
                          Hủy
                        </ButtonCustom>
                      </>
                    ) : (
                      <ButtonCustom
                        onClick={() => {
                          setIsEditingAll(true);
                          const initialPercentages: Record<string, number> = {};
                          spendingModel?.data?.spendingModelCategories.forEach(
                            (cat) => {
                              initialPercentages[cat.categoryId] =
                                cat.percentageAmount;
                            },
                          );
                          setEditingPercentages(initialPercentages);
                        }}
                        className="flex items-center gap-1 text-white"
                      >
                        <EditOutlined /> Chỉnh sửa tất cả
                      </ButtonCustom>
                    )}
                  </div>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-lg bg-[#eee]">
                  {budgets &&
                    budgets.length > 0 &&
                    budgets?.map((budget, index) => (
                      <Tooltip
                        key={index}
                        title={
                          <div className="flex items-center gap-2">
                            {renderIcon(budget?.icon)}
                            <span>
                              {budget.name}: <strong>{budget?.percent}%</strong>
                            </span>
                          </div>
                        }
                      >
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${budget.percent}%` }}
                          transition={{ duration: 0.7, ease: "easeInOut" }}
                          style={{ backgroundColor: budget.color }}
                          className="h-full"
                        />
                      </Tooltip>
                    ))}
                </div>
                <Text
                  type="secondary"
                  className={`mb-4 block text-sm ${getPercentageClass(totalPercentage)}`}
                >
                  {getPercentageText(totalPercentage)}
                </Text>
                <div className="mt-4 space-y-2">
                  {spendingModel?.data?.spendingModelCategories.map(
                    (category) => (
                      <div
                        key={category.categoryId}
                        className="flex items-center justify-between gap-4 rounded-md bg-gray-50 p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center text-xl">
                            {renderIcon(category.category.icon)}
                          </span>
                          <span>{category.category.name}</span>
                          <Tag
                            color={
                              category.category.type ===
                              CATEGORY_TYPE_TEXT.INCOME
                                ? "green"
                                : "red"
                            }
                          >
                            {category.category.type ===
                            CATEGORY_TYPE_TEXT.INCOME
                              ? "Thu nhập"
                              : "Chi tiêu"}
                          </Tag>
                        </div>
                        {isEditingAll ? (
                          <InputNumber
                            min={0}
                            max={100}
                            value={editingPercentages[category.categoryId] ?? 0}
                            onChange={(value) => {
                              setEditingPercentages({
                                ...editingPercentages,
                                [category.categoryId]: value ?? 0,
                              });
                            }}
                            formatter={(value) => `${value ?? 0}%`}
                            className="w-24"
                            disabled={
                              category.category.type ===
                              CATEGORY_TYPE_TEXT.INCOME
                            }
                          />
                        ) : (
                          <Tag
                            color="blue"
                            className="min-w-[60px] text-center"
                          >
                            {category.percentageAmount}%
                          </Tag>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <Empty
                description={
                  <Text className="text-gray-500">
                    Chưa có danh mục nào được thêm vào mô hình này
                  </Text>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="mt-20"
              />
            )}
          </div>
        </motion.div>

        <div className="mx-auto mb-5 mt-16">
          <div className="mb-6 flex flex-col gap-4 rounded-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <Radio.Group
                value={state.selectedType}
                onChange={(e) => handler.setSelectedType(e.target.value)}
                buttonStyle="solid"
                className="radio-group-custom"
                size="middle"
              >
                <Radio.Button value="ALL" className="font-medium">
                  Tất cả
                </Radio.Button>
                <Radio.Button
                  value={CATEGORY_TYPE_TEXT.INCOME}
                  className="font-medium"
                >
                  Thu nhập
                </Radio.Button>
                <Radio.Button
                  value={CATEGORY_TYPE_TEXT.EXPENSE}
                  className="font-medium"
                >
                  Chi tiêu
                </Radio.Button>
              </Radio.Group>
            </div>

            <Tooltip title="Thêm danh mục vào mô hình">
              <ButtonCustom
                className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90 hover:shadow-md"
                onClick={handler.handleOpenModalAdd}
                disabled={availableCategories.length === 0}
              >
                <PlusOutlined /> Thêm danh mục
              </ButtonCustom>
            </Tooltip>
          </div>
          <Row gutter={[16, 16]}>
            {filteredCategories?.length ? (
              filteredCategories.map((category) => (
                <Col key={category.categoryId} xs={24} sm={12} lg={8} xl={6}>
                  <CategoryCard
                    spendingModelId={id as string}
                    category={category.category}
                    percentageAmount={category.percentageAmount}
                    onRemove={() =>
                      handler.handleRemoveSpendingModelCategory(
                        id as string,
                        category.categoryId,
                        refetch,
                      )
                    }
                  />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 shadow-sm">
                  <Empty
                    description={
                      <Text className="text-gray-500">
                        Chưa có danh mục nào được thêm vào mô hình này
                      </Text>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                  <ButtonCustom
                    className="mt-4 flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90"
                    onClick={handler.handleOpenModalAdd}
                    disabled={availableCategories.length === 0}
                  >
                    <PlusOutlined /> Thêm danh mục ngay
                  </ButtonCustom>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-primary">
            Thêm danh mục vào mô hình
          </div>
        }
        open={state.isOpen}
        onOk={() => handler.handleAddModelCategory(id as string, refetch)}
        onCancel={handler.handleCancel}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{
          className: "!bg-primary text-white !hover:bg-primary/90",
        }}
        cancelButtonProps={{
          className: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        }}
        maskClosable={false}
        destroyOnClose
      >
        <CategoryFormList
          form={state.form}
          availableCategories={availableCategories}
          hasExistingCategories={
            filteredCategories && filteredCategories?.length > 0
          }
        />
      </Modal>
    </TableListLayout>
  );
};

export { SpendingModelDetail };
