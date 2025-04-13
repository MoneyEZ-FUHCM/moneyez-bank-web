import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { clearSystemData, setSystemData } from "@/redux/slices/systemSlice";
import { RootState } from "@/redux/store";
import {
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetSubCategoryListQuery,
  useUpdateSubcategoryMutation,
} from "@/services/admin/subCategory";
import { SubCategory } from "@/types/category.types";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_SUB_CATEGORY_CONSTANT } from "../subCategory.constant";
import { TEXT_TRANSLATE } from "../subCategory.translate";

const useSubCategoryManagementPage = () => {
  const confirm = Modal.confirm;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const [createSubCategory, { isLoading: isCreating }] =
    useCreateSubCategoryMutation();
  const [updateSubCategory, { isLoading: isUpdating }] =
    useUpdateSubcategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const subCategory = useSelector(
    (state: RootState) => state.system.systemData,
  );

  const { data, isLoading: isLoadingCategoryList } = useGetSubCategoryListQuery(
    useMemo(
      () => ({
        PageIndex: pageIndex,
        PageSize: pageSize,
        search: searchQuery || "",
      }),
      [pageIndex, pageSize, searchQuery],
    ),
  );

  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_SUB_CATEGORY_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;

  useEffect(() => {
    if (data?.totalPages && pageIndex > data.totalPages) {
      setPageIndex(data.totalPages);
    }
  }, [data?.totalPages, pageIndex]);

  const handleSubmitForm = useCallback(async () => {
    try {
      const values = await form.validateFields();
      try {
        if (subCategory) {
          await updateSubCategory({ id: subCategory.id, ...values }).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.UPDATE_SUCCESSFUL);
        } else {
          await createSubCategory([values]).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        }
        form.resetFields();
        dispatch(clearSystemData());
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.DUPLICATE_SUB_CATE_NAME) {
          return showToast(
            TOAST_STATUS.ERROR,
            MESSAGE_ERROR.SUB_CATEGORY_ALREADY_EXISTS,
          );
        }
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
      }
    } catch (err: any) {
      dispatch(setIsOpen(true));
    }
  }, [form, subCategory, updateSubCategory, createSubCategory, dispatch]);

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

  const handleOpenModalEdit = (record: SubCategory) => {
    dispatch(setSystemData(record));
    dispatch(setIsOpen(true));
  };

  const handlePageChange = useCallback((pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  }, []);

  const handleDeleteSubCategory = useCallback(
    (id: string) => {
      confirm({
        title: TITLE.TITLE,
        content: TITLE.CONTENT,
        okText: TITLE.OK_TEXT,
        okType: "danger",
        cancelText: TITLE.CANCEL_TEXT,
        onOk: async () => {
          try {
            await deleteSubCategory(id).unwrap();
            showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
          } catch (err: any) {
            const error = err?.data;
            if (error?.errorCode === ERROR_CODE.SUB_CATEGORY_NOT_EXIST) {
              return showToast(
                TOAST_STATUS.ERROR,
                MESSAGE_ERROR.SUB_CATEGORY_NOT_EXISTS,
              );
            }
            if (error?.errorCode === ERROR_CODE.SUBCATEGORY_HAS_DEPENDENCIES) {
              return showToast(
                TOAST_STATUS.ERROR,
                "Danh mục chi tiêu con đang được sử dụng. Không thể xóa",
              );
            }
            showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
          }
        },
      });
    },
    [confirm, deleteSubCategory],
  );

  useEffect(() => {
    if (isOpen && subCategory) {
      form.setFieldsValue(subCategory);
    }
  }, [form, isOpen, subCategory]);

  return {
    state: {
      data,
      isLoadingCategoryList,
      pageIndex,
      pageSize,
      isOpen,
      isSubmitting: isCreating || isUpdating,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
      subCategory,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleOpenModalEdit,
      handleSubmitForm,
      handleCancel,
      handleDeleteSubCategory,
      setSearchQuery,
    },
  };
};

export { useSubCategoryManagementPage };
