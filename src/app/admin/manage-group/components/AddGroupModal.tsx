"use client";

import { UploadImage } from "@/components";
import { CommonForm } from "@/components/common/table/CommonForm";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { UserOutlined } from "@ant-design/icons";
import { Input, Modal, Select } from "antd";
import { useGroupManagementPage } from "../hooks/useGroupManagementPage";

const AddGroupModal = () => {
  const { handler, state } = useGroupManagementPage();

  const groupFields = [
    {
      name: state.FORM_NAME.NAME,
      label: state.TITLE.NAME,
      component: (
        <Input prefix={<UserOutlined />} placeholder={state.TITLE.NAME} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.DESCRIPTION,
      label: state.TITLE.DESCRIPTION,
      component: (
        <Input.TextArea placeholder={state.TITLE.DESCRIPTION} />
      ),
    },
    {
      name: state.FORM_NAME.VISIBILITY,
      label: state.TITLE.VISIBILITY,
      component: (
        <Select placeholder={state.TITLE.VISIBILITY}>
          <Select.Option value="PUBLIC">{state.TITLE.PUBLIC}</Select.Option>
          <Select.Option value="PRIVATE">{state.TITLE.PRIVATE}</Select.Option>
        </Select>
      ),
      rules: [
        // { required: true, message: state.MESSAGE_VALIDATE.VISIBILITY_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.IMAGE_URL,
      label: state.TITLE.AVATAR,
      component: (
        <UploadImage
          onFileChange={handler.handleFileChange}
          initialImage={COMMON_CONSTANT.EMPTY_STRING}
          titleButton={state.BUTTON.ADD_AVATAR}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <p className="text-lg font-bold text-primary">{state.TITLE.ADD_GROUP}</p>
      }
      open={state.isOpen}
      onOk={handler.handleAddGroup}
      confirmLoading={state.isCreatingGroup}
      onCancel={handler.handleCancel}
      okText={state.BUTTON.CONFIRM}
      cancelText={state.BUTTON.CANCEL}
      okButtonProps={{ className: "custom-ok-button" }}
    >
      <CommonForm form={state.form} fields={groupFields} />
    </Modal>
  );
};

export { AddGroupModal };
