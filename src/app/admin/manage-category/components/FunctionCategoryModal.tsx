"use client";

import { CommonForm } from "@/components/common/table/CommonForm";
import { CATEGORY_TYPE } from "@/enums/globals";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BorderlessTableOutlined,
  QrcodeOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Input, Modal, Select } from "antd";
import { TEXT_TRANSLATE } from "../category.translate";
import { useCategoryManagementPage } from "../hooks/useCategoryManagementPage";

const FunctionCategoryModal = () => {
  const { TextArea } = Input;
  const { handler, state } = useCategoryManagementPage();

  const categoryFields = [
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
      name: state.FORM_NAME.TYPE,
      label: state.TITLE.TYPE,
      component: (
        <Select
          placeholder="Chọn loại hình danh mục"
          defaultValue={state.category?.type}
        >
          <Select.Option value={CATEGORY_TYPE.INCOME}>
            <ArrowUpOutlined className="mr-2 text-green" />
            Khoản thu
          </Select.Option>
          <Select.Option value={CATEGORY_TYPE.EXPENSE}>
            <ArrowDownOutlined className="mr-2 text-red" />
            Chi tiêu
          </Select.Option>
        </Select>
      ),
      rules: [
        {
          required: true,
          message: state.MESSAGE_VALIDATE.DESCRIPTION_REQUIRED,
        },
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
          {state.category
            ? TEXT_TRANSLATE.TITLE.UPDATE_CATEGORY
            : TEXT_TRANSLATE.TITLE.ADD_CATEGORY}
        </p>
      }
      open={state.isOpen}
      onOk={handler.handleSubmitForm}
      onCancel={handler.handleCancel}
      okText={
        state.category
          ? TEXT_TRANSLATE.BUTTON.UPDATE_CATEGORY
          : TEXT_TRANSLATE.BUTTON.ADD_CATEGORY
      }
      cancelText={state.BUTTON.CANCEL}
      confirmLoading={state.isSubmitting}
      okButtonProps={{ className: "custom-ok-button" }}
      destroyOnClose
    >
      <CommonForm colSpan={24} form={state.form} fields={categoryFields} />
    </Modal>
  );
};

export { FunctionCategoryModal };
