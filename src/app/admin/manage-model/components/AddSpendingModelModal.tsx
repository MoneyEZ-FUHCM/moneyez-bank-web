"use client";

import { CommonForm } from "@/components/common/table/CommonForm";
import { removeHtmlTags } from "@/helpers/libs/utils";
import { SignatureOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSpendingModelManagementPage } from "../hooks/useSpendingModelManagementPage";
import { setPlainText } from "@/redux/slices/modalSlice";

const AddSpendingModelModal = () => {
  const { handler, state } = useSpendingModelManagementPage();
  const categoryFields = [
    {
      name: state.FORM_NAME.NAME,
      label: state.TITLE.NAME,
      component: (
        <Input prefix={<SignatureOutlined />} placeholder={state.TITLE.NAME} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.DESCRIPTION,
      label: state.TITLE.DESCRIPTION,
      isRequired: true,
      component: (
        <ReactQuill
          style={{ height: "400px" }}
          onChange={(content) => {
            const plainText = removeHtmlTags(content);
            handler.dispatch(setPlainText(plainText));
            state.form.setFieldsValue({ description: content });
          }}
          className="rounded-md border-gray-300 focus:border-primary"
          placeholder="Nhập mô tả chi tiết về mô hình này..."
        />
      ),
    },
  ];

  return (
    <Modal
      width={800}
      title={
        <p className="text-lg font-bold text-primary">Thêm mô hình chi tiêu</p>
      }
      open={state.isOpen}
      onOk={handler.handleAddModel}
      onCancel={handler.handleCancel}
      okText={state.BUTTON.ADD_MODEL}
      cancelText={state.BUTTON.CANCEL}
      confirmLoading={state.isCreatingModel}
      okButtonProps={{ className: "custom-ok-button" }}
      className="custom-antd-footer"
    >
      <CommonForm colSpan={24} form={state.form} fields={categoryFields} />
    </Modal>
  );
};

export { AddSpendingModelModal };
