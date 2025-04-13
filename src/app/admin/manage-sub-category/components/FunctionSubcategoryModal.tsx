"use client";

import { CommonForm } from "@/components/common/table/CommonForm";
import {
  BorderlessTableOutlined,
  QrcodeOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Input, Modal } from "antd";
import { useSubCategoryManagementPage } from "../hooks/useSubCategoryManagementPage";
import { TEXT_TRANSLATE } from "../subCategory.translate";

const FunctionSubCategoryModal = () => {
  const { TextArea } = Input;
  const { handler, state } = useSubCategoryManagementPage();

  const subCategoryFields = [
    {
      name: state.FORM_NAME.NAME,
      label: state.TITLE.NAME,
      component: (
        <Input
          prefix={<UnorderedListOutlined />}
          placeholder={state.TITLE.NAME}
        />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.CODE,
      label: state.TITLE.CODE,
      component: (
        <Input prefix={<QrcodeOutlined />} placeholder={state.TITLE.CODE} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.ICON,
      label: state.TITLE.ICON,
      component: (
        <Input
          prefix={<BorderlessTableOutlined />}
          placeholder={state.TITLE.ICON}
        />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },

    {
      name: state.FORM_NAME.DESCRIPTION,
      label: state.TITLE.DESCRIPTION,
      component: (
        <TextArea rows={4} placeholder={state.TITLE.DESCRIPTION} required />
      ),
      rules: [
        {
          required: true,
          message: state.MESSAGE_VALIDATE.DESCRIPTION_REQUIRED,
        },
      ],
    },
  ];

  return (
    <Modal
      title={
        <p className="text-lg font-bold text-primary">
          {state.subCategory
            ? TEXT_TRANSLATE.TITLE.UPDATE_SUB_CATEGORY
            : TEXT_TRANSLATE.TITLE.ADD_SUB_CATEGORY}
        </p>
      }
      open={state.isOpen}
      onOk={handler.handleSubmitForm}
      onCancel={handler.handleCancel}
      okText={
        state.subCategory
          ? TEXT_TRANSLATE.BUTTON.UPDATE_SUB_CATEGORY
          : TEXT_TRANSLATE.BUTTON.ADD_SUB_CATEGORY
      }
      cancelText={state.BUTTON.CANCEL}
      confirmLoading={state.isSubmitting}
      okButtonProps={{ className: "custom-ok-button" }}
      destroyOnClose
    >
      <CommonForm colSpan={24} form={state.form} fields={subCategoryFields} />
    </Modal>
  );
};

export { FunctionSubCategoryModal };
