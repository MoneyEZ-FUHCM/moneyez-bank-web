import { TOAST_STATUS } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { showToast } from "@/hooks/useShowToast";
import { setIsOpen } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupDetailQuery,
  useGetGroupListQuery,
} from "@/services/admin/group";
import { Form, Modal, TablePaginationConfig } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MANAGE_GROUP_CONSTANT } from "../group.constant";
import { TEXT_TRANSLATE } from "../group.translate";
import { Group } from "@/types/group.types";

const useGroupManagementPage = () => {
  const confirm = Modal.confirm;
  const [form] = Form.useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [fileChange, setFileChange] = useState<string>("");
  const [createGroup, { isLoading: isCreatingGroup }] =
    useCreateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading: isLoadingGroupList } = useGetGroupListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
    search: searchQuery || "",
  });
  const { data: groupDetail, isLoading: isLoadingGroupDetail } =
    useGetGroupDetailQuery({ id: id }, { skip: !id });

  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE, FORM_NAME } = MANAGE_GROUP_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TITLE, BUTTON } =
    TEXT_TRANSLATE;
  const router = useRouter();

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

  const handleAddGroup = async () => {
    try {
      const values = await form.validateFields();
      try {
        await createGroup(values).unwrap();
        showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.CREATE_SUCCESSFUL);
        form.resetFields();
        dispatch(setIsOpen(false));
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.GROUP_ALREADY_EXISTS) {
          showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.GROUP_ALREADY_EXISTS);
          return;
        }
        showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
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

  const handleDeleteGroup = (id: number) => {
    confirm({
      title: TITLE.TITLE,
      content: TITLE.CONTENT,
      okText: TITLE.OK_TEXT,
      okType: "danger",
      cancelText: TITLE.CANCEL_TEXT,
      onOk: async () => {
        try {
          await deleteGroup(id).unwrap();
          showToast(TOAST_STATUS.SUCCESS, MESSAGE_SUCCESS.DELETE_SUCCESSFUL);
        } catch (err: any) {
          const error = err?.data;
          if (error?.errorCode === ERROR_CODE.GROUP_NOT_EXIST) {
            showToast(TOAST_STATUS.ERROR, MESSAGE_ERROR.GROUP_NOT_EXISTS);
            return;
          }
          showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
        }
      },
    });
  };

  const handleViewDetail = useCallback((record: any) => {
    router.push(`/admin/manage-group/${record.id}`);
  }, []);

  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      LEADER: "Trưởng nhóm",
      MEMBER: "Thành viên",
    };
    return roleMap[role] || role;
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      ACTIVE: {
        label: "Đang hoạt động",
        color: "bg-light text-[#389e0d] bg-[#f6ffed] text-green font-medium",
      },
      PENDING: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-500",
      },
      INACTIVE: { label: "Không hoạt động", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  const formatGender = (gender: number | null) => {
    if (gender === null) return "N/A";
    return gender === 0 ? "Nam" : "Nữ";
  };

  return {
    state: {
      data,
      isLoadingGroupList,
      pageIndex,
      pageSize,
      isOpen,
      isCreatingGroup,
      MESSAGE_VALIDATE,
      form,
      FORM_NAME,
      TITLE,
      BUTTON,
      groupDetail: groupDetail?.data as Group,
      isLoadingGroupDetail,
    },
    handler: {
      handlePageChange,
      handleOpenModalAdd,
      handleAddGroup,
      handleCancel,
      handleDeleteGroup,
      handleFileChange,
      setSearchQuery,
      handleViewDetail,
      formatRole,
      formatStatus,
      formatGender,
      router,
    },
  };
};

export { useGroupManagementPage };
