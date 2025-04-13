"use client";

import { UploadImage } from "@/components";
import { CommonForm } from "@/components/common/table/CommonForm";
import { VALID_ROLE_REQUEST } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { DatePicker, Input, Modal, Select } from "antd";
import { useUserManagementPage } from "../hooks/useUserManagementPage";

const AddUserModal = () => {
  const { handler, state } = useUserManagementPage();

  const userFields = [
    {
      name: state.FORM_NAME.EMAIL,
      label: state.TITLE.EMAIL,
      component: (
        <Input prefix={<MailOutlined />} placeholder={state.TITLE.EMAIL} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.EMAIL_REQUIRED },
        { type: "email", message: state.MESSAGE_VALIDATE.INPUT_EMAIL },
      ],
    },
    {
      name: state.FORM_NAME.FULLNAME,
      label: state.TITLE.FULLNAME,
      component: (
        <Input prefix={<UserOutlined />} placeholder={state.TITLE.FULLNAME} />
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.NAME_REQUIRED },
      ],
    },
    {
      name: state.FORM_NAME.DOB,
      label: state.TITLE.DOB,
      component: (
        <DatePicker
          format="DD/MM/YYYY"
          className="!h-[37px] w-full hover:!border-primary"
          disabledDate={state.disabledDate}
        />
      ),
      rules: [{ required: true, message: state.MESSAGE_VALIDATE.DOB_REQUIRED }],
    },
    {
      name: state.FORM_NAME.PHONE_NUMBER,
      label: state.TITLE.PHONE_NUMBER,
      component: (
        <Input
          prefix={<PhoneOutlined />}
          placeholder={state.TITLE.PHONE_NUMBER}
          maxLength={10}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      ),
      rules: [
        {
          required: true,
          message: state.MESSAGE_VALIDATE.PHONE_NUMBER_REQUIRED,
        },
        {
          pattern: /^[0-9]{10}$/,
          message: state.MESSAGE_VALIDATE.INPUT_PHONE_NUMBER,
        },
      ],
    },
    {
      name: state.FORM_NAME.ADDERSS,
      label: state.TITLE.ADDRESS,
      component: (
        <Input
          prefix={<EnvironmentOutlined />}
          placeholder={state.TITLE.ADDRESS}
        />
      ),
    },
    {
      name: state.FORM_NAME.ROLE,
      label: state.TITLE.ROLE,
      component: (
        <Select
          placeholder={state.TITLE.CHOOSE_ROLE}
          className="hover:!border-primary"
        >
          <Select.Option value={VALID_ROLE_REQUEST.ADMIN}>
            {state.TITLE.ADMIN}
          </Select.Option>
          <Select.Option value={VALID_ROLE_REQUEST.USER}>
            {state.TITLE.USER}
          </Select.Option>
        </Select>
      ),
      rules: [
        { required: true, message: state.MESSAGE_VALIDATE.ROLE_REQUIRED },
      ],
    },

    {
      name: state.FORM_NAME.AVATAR,
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
        <p className="text-lg font-bold text-primary">{state.TITLE.ADD_USER}</p>
      }
      open={state.isOpen}
      onOk={handler.handleAddUser}
      confirmLoading={state.isCreatingUser}
      onCancel={handler.handleCancel}
      okText={state.BUTTON.CONFIRM}
      cancelText={state.BUTTON.CANCEL}
      okButtonProps={{ className: "custom-ok-button" }}
    >
      <CommonForm form={state.form} fields={userFields} />
    </Modal>
  );
};

export { AddUserModal };
