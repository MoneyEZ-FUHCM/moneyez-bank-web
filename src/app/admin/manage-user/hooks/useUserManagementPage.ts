import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatDateRequest } from "@/helpers/libs/utils";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUserListQuery,
} from "@/services/admin/user";
import { Form, Modal, TablePaginationConfig } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_USER_CONSTANT } from "../user.constant";
import { TEXT_TRANSLATE } from "../user.translate";

const useUserManagementPage = () => {
  const confirm = Modal.confirm;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [fileChange, setFileChange] = useState<string>("");
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingUserList } = useGetUserListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
    search: searchQuery || "",
  });

  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_USER_CONSTANT;
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
    form.setFieldsValue({ avatar: fileChange });
  }, [fileChange, form]);

  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();
      const formattedDate = formatDateRequest(values.dob);
      const updatedValues = JSON.stringify({ ...values, dob: formattedDate });

      try {
        await createUser(updatedValues).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err?.data;

        if (error?.errorCode === ERROR_CODE.USER_MUST_16) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.MUST_BE_16);
        } else if (error?.errorCode === ERROR_CODE.ACCOUNT_VERIFIED) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.VERIFIED_EMAIL);
        } else if (error?.errorCode === ERROR_CODE.DUPLICATE_PHONE_NUMBER) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.PHONE_ALREADY_EXISTED);
        } else {
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
        dispatch(setIsOpen(true));
      }
    } catch (err) {
      dispatch(setIsOpen(true));
    }
  };

  const handleCancel = () => {
    dispatch(setIsOpen(false));
    form.resetFields();
  };

  const disabledDate = (current: object) =>
    current && current > moment().startOf("day");

  const handleFileChange = useCallback((newFileChange: string) => {
    setFileChange(newFileChange);
  }, []);

  const handleOpenModalAdd = useCallback(() => {
    dispatch(setIsOpen(true));
  }, [dispatch]);

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleDeleteUser = (id: number) => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteUser(id).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          const error = err?.data;

          if (error?.errorCode === ERROR_CODE.ACCOUNT_NOT_EXIST) {
            showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.ACCOUNT_NOT_EXISTS);
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  return {
    state: {
      data,
      isLoadingUserList,
      pageIndex,
      pageSize,
      isOpen,
      isCreatingUser,
      disabledDate,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleFileChange,
      handleAddUser,
      handleCancel,
      handleDeleteUser,
      setSearchQuery,
    },
  };
};

export { useUserManagementPage };

