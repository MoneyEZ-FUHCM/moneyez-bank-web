import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen, setPlainText } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import {
  useAddCategoryModalToSpendingModelMutation,
  useCreateSpendingModelMutation,
  useDeleteSpendingModelMutation,
  useGetSpendingModelListQuery,
  useRemovecategoryFromSpendingModelMutation,
} from "@/services/admin/spendingModel";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_MODEL_CONSTANT } from "../model.constant";
import { TEXT_TRANSLATE } from "../model.translate";

type CategoryItem = {
  categoryId: string;
  percentageAmount: number;
};

interface AddCategoryModelRequest {
  spendingModelId: string;
  categories: CategoryItem[];
}

interface RemoveCategoryRequest {
  spendingModelId: string;
  categoryIds: string[];
}

interface ModelRecord {
  id: string;
  [key: string]: any;
}

const useSpendingModelManagementPage = () => {
  const confirm = Modal.confirm;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [createModel, { isLoading: isCreatingModel }] =
    useCreateSpendingModelMutation();
  const [
    addCategoryModalToSpendingModel,
    { isLoading: isAddCategoryModalToSpendingModel },
  ] = useAddCategoryModalToSpendingModelMutation();
  const [deleteModel] = useDeleteSpendingModelMutation();
  const [removecategoryFromSpendingModel] =
    useRemovecategoryFromSpendingModelMutation();

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingModelList } = useGetSpendingModelListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });
  const plainText = useSelector((state: RootState) => state.modal.plainText);

  const { SYSTEM_ERROR, CONDITION } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_MODEL_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;

  const [selectedType, setSelectedType] = useState<string>("ALL");

  const handleAddModel = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      const updateValue = [{ ...values, isTemplate: CONDITION.TRUE }];
      if (!plainText.trim()) {
        showToast(TOAST_STATUS.INFO, "Vui lòng nhập mô tả");
        return;
      }
      try {
        await createModel(updateValue).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
        dispatch(setPlainText(""));
      } catch (err: any) {
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        dispatch(setIsOpen(true));
      }
    } catch (err) {
      dispatch(setIsOpen(true));
    }
  };

  const handleCancel = (): void => {
    dispatch(setIsOpen(false));
    form.resetFields();
  };

  const handleOpenModalAdd = useCallback((): void => {
    dispatch(setIsOpen(true));
  }, [dispatch]);

  const handlePageChange = (pagination: TablePaginationConfig): void => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleViewDetail = useCallback(
    (record: ModelRecord): void => {
      router.push(`/admin/manage-model/${record.id}`);
    },
    [router],
  );

  const handleDeleteModel = (id: number): void => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteModel(id).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.MODEL_NOT_FOUND) {
            showToast(
              TOAST_STATUS.ERROR,
              TEXT_TRANSLATE.MESSAGE_ERROR.MODEL_NOT_EXISTS,
            );
            return;
          }
          if (error?.errorCode === ERROR_CODE.MODEL_HAS_DEPENDENCIES) {
            showToast(
              TOAST_STATUS.ERROR,
              "Mô hình đang được sử dụng. Không thể xóa ở thời điểm hiện tại",
            );
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  const handleAddModelCategory = useCallback(
    async (spendingModelId: string, refetch: () => void): Promise<void> => {
      try {
        const values = await form.validateFields();

        try {
          // Check if there are existing categories in the model
          const existingCategories =
            data?.items?.find((model) => model.id === spendingModelId)
              ?.spendingModelCategories || [];

          const hasExistingCategories = existingCategories.length > 0;

          const payload: AddCategoryModelRequest = {
            spendingModelId: spendingModelId,
            categories:
              values.categories?.length > 0 &&
              values.categories?.map((category: CategoryItem) => ({
                categoryId: category?.categoryId,
                // If there are existing categories, default percentage to 0 if not provided
                percentageAmount: hasExistingCategories
                  ? category?.percentageAmount || 0
                  : category?.percentageAmount,
              })),
          };

          await addCategoryModalToSpendingModel(payload).unwrap();
          showToast(
            TOAST_STATUS.SUCCESS,
            "Thêm danh mục vào mô hình thành công",
          );
          handleCancel();

          refetch();
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.INVALID_TOTAL_PERCENTAGE) {
            showToast(
              TOAST_STATUS.ERROR,
              "Tổng giá trị ngân sách phải bằng 100%",
            );
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      } catch (err: any) {}
    },
    [data?.items],
  );

  const handleRemoveSpendingModelCategory = useCallback(
    async (
      modelId: string,
      categoryId: string,
      refetch: () => void,
    ): Promise<void> => {
      confirm({
        title: TITLE.TITLE,
        content: TITLE.CONTENT,
        okText: TITLE.OK_TEXT,
        okType: "danger",
        cancelText: TITLE.CANCEL_TEXT,
        onOk: async () => {
          try {
            const requestData: RemoveCategoryRequest = {
              spendingModelId: modelId,
              categoryIds: [categoryId],
            };
            await removecategoryFromSpendingModel(requestData).unwrap();
            refetch();
            showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
          } catch (err: any) {
            const error = err?.data;
            if (error?.errorCode === ERROR_CODE.MODEL_NOT_FOUND) {
              showToast(
                TOAST_STATUS.ERROR,
                TEXT_TRANSLATE.MESSAGE_ERROR.MODEL_NOT_EXISTS,
              );
              return;
            }
            showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
          }
        },
      });
    },
    [],
  );

  const handleViewDetailCategory = useCallback(
    (record: string): void => {
      router.push(`/admin/manage-category/${record}`);
    },
    [router],
  );

  return {
    state: {
      data,
      isLoadingModelList,
      pageIndex,
      pageSize,
      isOpen,
      isCreatingModel,
      isAddCategoryModalToSpendingModel,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
      selectedType,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleAddModel,
      handleCancel,
      handleDeleteModel,
      handleViewDetail,
      handleAddModelCategory,
      setSelectedType,
      handleRemoveSpendingModelCategory,
      handleViewDetailCategory,
      dispatch,
    },
  };
};

export { useSpendingModelManagementPage };
