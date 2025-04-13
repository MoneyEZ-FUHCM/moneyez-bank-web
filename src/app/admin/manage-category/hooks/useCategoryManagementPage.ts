import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { clearSystemData, setSystemData } from "@/redux/slices/systemSlice";
import { RootState } from "@/redux/store";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryListQuery,
  useUpdateCategoryMutation,
} from "@/services/admin/category";
import {
  useAssignSubcategoriesMutation,
  useUnAssignSubcategoriesMutation,
} from "@/services/admin/subCategory";
import { Category } from "@/types/category.types";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_CATEGORY_CONSTANT } from "../category.constant";
import { TEXT_TRANSLATE } from "../category.translate";

const useCategoryManagementPage = () => {
  const confirm = Modal.confirm;
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [assignSubcategories, { isLoading: isAssigningSubCategories }] =
    useAssignSubcategoriesMutation();
  const [unAssignSubcategories, { isLoading: isUnAssigningSubCategories }] =
    useUnAssignSubcategoriesMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingCategoryList } = useGetCategoryListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
    search: searchQuery || "",
  });
  const category = useSelector((state: RootState) => state.system.systemData);
  const CATEGORY_TYPE_MAPPING = {
    INCOME: 0,
    EXPENSE: 1,
  };
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_CATEGORY_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;

  useEffect(() => {
    if (data) {
      const totalPages = data?.totalPages || 1;
      if (pageIndex > totalPages) {
        setPageIndex(totalPages);
      }
    }
  }, [data?.totalPages]);

  useEffect(() => {
    if (isOpen && category) {
      form.setFieldsValue({
        ...category,
        type: CATEGORY_TYPE_MAPPING[category.type] ?? undefined,
      });
    }
  }, [form, isOpen, category]);

  const handleViewDetail = useCallback((record: any) => {
    router.push(`/admin/manage-category/${record.id}`);
  }, []);

  const handleSubmitForm = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const formattedValues = {
        ...values,
        type: values.type,
        isSaving: true,
      };

      try {
        if (category) {
          await updateCategory({
            id: category.id,
            ...formattedValues,
          }).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.UPDATE_SUCCESSFUL);
        } else {
          await createCategory([formattedValues]).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        }

        form.resetFields();
        dispatch(clearSystemData());
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.CATEGORY_ALREADY_EXISTS) {
          return showToast(
            TOAST_STATUS.ERROR,
            MESSAGE_ERROR.CATEGORY_ALREADY_EXISTS,
          );
        }
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
      }
    } catch (err: any) {
      dispatch(setIsOpen(true));
    }
  }, [form, category, updateCategory, createCategory, dispatch]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    dispatch(clearSystemData());
    dispatch(setIsOpen(false));
  }, [dispatch, form]);

  const handleOpenModalAdd = useCallback(() => {
    form.resetFields();
    dispatch(clearSystemData());
    dispatch(setIsOpen(true));
  }, [dispatch, form]);

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleDeleteCategory = (id: number) => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteCategory(id).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.CATEGORY_NOT_EXIST) {
            showToast(
              TOAST_STATUS.ERROR,
              TEXT_TRANSLATE.MESSAGE_ERROR.CATEGORY_NOT_EXISTS,
            );
            return;
          }
          if (error?.errorCode === ERROR_CODE.CATEGORY_HAS_DEPENDENCIES) {
            showToast(
              TOAST_STATUS.ERROR,
              "Danh mục chi tiêu đang được sử dụng. Không thể xóa",
            );
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  const handleAssignCategory = async (refetch: any, cateCode: string) => {
    try {
      const values = await form.validateFields();
      const assignmentData = {
        assignments: [
          {
            categoryCode: cateCode as string,
            subcategoryCodes: values.subcategoryCodes,
          },
        ],
      };
      try {
        await assignSubcategories(assignmentData).unwrap();
        showToast(
          TOAST_STATUS.SUCCESS,
          MESSAGE_SUCCESS.ASSIGN_SUBCATE_SUCCESSFUL,
        );
        form.resetFields();
        dispatch(setIsOpen(false));
        refetch();
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.CATEGORY_ALREADY_EXISTS) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.CATEGORY_ALREADY_EXISTS);
          return;
        }
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        dispatch(setIsOpen(true));
      }
    } catch (err) {
      dispatch(setIsOpen(true));
    }
  };

  const handleRemoveSubcategory = async (
    refetch: any,
    categoryId: string,
    subcategoryId: string,
  ) => {
    confirm({
      title: TITLE.REMOVE_SUBCATEGORY,
      content: TITLE.REMOVE_SUBCATEGORY_CONFIRM,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          const request = {
            categoryId: categoryId,
            subcategoryId: subcategoryId,
          };
          await unAssignSubcategories(request).unwrap();
          showToast(
            TOAST_STATUS.SUCCESS,
            MESSAGE_SUCCESS.REMOVE_SUBCATE_SUCCESSFUL,
          );
          refetch();
        } catch (err) {
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  const handleOpenModalEdit = useCallback((record: Category) => {
    dispatch(setSystemData(record));
    dispatch(setIsOpen(true));
  }, []);

  return {
    state: {
      data,
      isLoadingCategoryList,
      pageIndex,
      pageSize,
      isOpen,
      isAssigningSubCategories,
      isUnAssigningSubCategories,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
      category,
      isSubmitting: isCreating || isUpdating,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleCancel,
      handleDeleteCategory,
      handleViewDetail,
      setSearchQuery,
      handleAssignCategory,
      handleRemoveSubcategory,
      handleOpenModalEdit,
      handleSubmitForm,
    },
  };
};

export { useCategoryManagementPage };
