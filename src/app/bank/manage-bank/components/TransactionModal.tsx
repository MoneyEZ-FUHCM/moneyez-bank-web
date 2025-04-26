"use client";

import { TRANSACTION_TYPE } from "@/helpers/enums/globals";
import { formatCurrency, formatTimestampWithHour } from "@/helpers/libs/utils";
import { BankAccount } from "@/helpers/types/bankAccount.types";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  BankOutlined,
  CreditCardOutlined,
  DollarOutlined,
  SwapOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
const { Option } = Select;

const { Text, Title } = Typography;

interface UnifiedTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedAccount: BankAccount | null;
  transactionType: TRANSACTION_TYPE;
  onFinish: (values: any) => void;
  form: any;
  bankOptions?: BankAccount[];
}

const TransactionModal: React.FC<UnifiedTransactionModalProps> = ({
  isVisible,
  onClose,
  selectedAccount,
  transactionType,
  onFinish,
  form,
  bankOptions,
}) => {
  const [amount, setAmount] = useState<number>(0);

  const getTransactionConfig = () => {
    switch (transactionType) {
      case TRANSACTION_TYPE.DEPOSIT:
        return {
          title: "Nạp tiền",
          icon: <ArrowUpOutlined />,
          buttonText: "Xác nhận nạp",
          badgeStatus: "success",
          iconColor: "#10b981",
          headerColor: "#ecfdf5",
          headerBorderColor: "#a7f3d0",
          textColor: "#047857",
          buttonBgColor: "#10b981",
          buttonHoverBgColor: "#059669",
        };
      case TRANSACTION_TYPE.WITHDRAW:
        return {
          title: "Rút tiền",
          icon: <ArrowDownOutlined />,
          buttonText: "Xác nhận rút",
          badgeStatus: "error",
          iconColor: "#ef4444",
          headerColor: "#fef2f2",
          headerBorderColor: "#fecaca",
          textColor: "#b91c1c",
          buttonBgColor: "#ef4444",
          buttonHoverBgColor: "#dc2626",
        };
      case TRANSACTION_TYPE.TRANSFER:
        return {
          title: "Chuyển tiền",
          icon: <SwapOutlined />,
          buttonText: "Xác nhận chuyển",
          badgeStatus: "processing",
          iconColor: "#3b82f6",
          headerColor: "#eff6ff",
          headerBorderColor: "#bfdbfe",
          textColor: "#1d4ed8",
          buttonBgColor: "#3b82f6",
          buttonHoverBgColor: "#2563eb",
        };
      default:
        return {
          title: "Giao dịch",
          icon: <ArrowRightOutlined />,
          buttonText: "Xác nhận",
          badgeStatus: "default",
          iconColor: "#6b7280",
          headerColor: "#f9fafb",
          headerBorderColor: "#e5e7eb",
          textColor: "#374151",
          buttonBgColor: "#6b7280",
          buttonHoverBgColor: "#4b5563",
          descriptionLabel: "Nội dung giao dịch",
          descriptionPlaceholder: "Nhập nội dung giao dịch",
        };
    }
  };

  const config = getTransactionConfig();

  useEffect(() => {
    if (isVisible) {
      form.resetFields();

      const defaultValues: any = {
        selectedAccountId: selectedAccount?.id,
      };

      if (transactionType === TRANSACTION_TYPE.TRANSFER) {
        defaultValues.destinationBank = "EZB - EzMoney Bank (Demo)";
      }

      form.setFieldsValue(defaultValues);
      setAmount(0);
    }
  }, [isVisible, form, selectedAccount, transactionType]);

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.amount !== undefined) {
      setAmount(changedValues.amount || 0);
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      width={540}
      className="transaction-modal"
      closable={false}
      modalRender={(modal) => (
        <div style={{ backgroundColor: "white", padding: 0, borderRadius: 10 }}>
          {modal}
        </div>
      )}
    >
      {selectedAccount && (
        <>
          <div
            className="flex items-center rounded-t-xl border-b px-6 py-4"
            style={{
              backgroundColor: config.headerColor,
              borderColor: config.headerBorderColor,
            }}
          >
            <div
              className="mr-2 flex h-10 w-10 items-center justify-center gap-2 rounded-full shadow-sm"
              style={{
                backgroundColor: "white",
                color: config.iconColor,
              }}
            >
              {config.icon}
            </div>
            <div>
              <Title level={4} style={{ color: config.textColor, margin: 0 }}>
                {config.title}
              </Title>
              <Text type="secondary" style={{ fontSize: "13px" }}>
                Vui lòng nhập thông tin giao dịch
              </Text>
            </div>
          </div>

          <div className="px-6 pt-5">
            <Card
              className="mb-5 shadow-sm"
              bodyStyle={{ padding: "16px" }}
              bordered
            >
              <div className="mb-3 flex justify-between">
                <div className="flex-1">
                  <Text type="secondary" className="mb-1 block">
                    <UserOutlined className="mr-1" /> Chủ tài khoản
                  </Text>
                  <Text strong className="text-base">
                    {selectedAccount?.accountHolder}
                  </Text>
                </div>
                <div className="flex-1">
                  <Text type="secondary" className="mb-1 block">
                    <CreditCardOutlined className="mr-1" /> Số tài khoản
                  </Text>
                  <Text strong className="text-base">
                    {selectedAccount?.accountNumber}
                  </Text>
                </div>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div className="flex-1">
                <Text type="secondary" className="mb-1 block">
                  <WalletOutlined className="mr-1" /> Số dư
                </Text>
                <Text strong className="text-lg">
                  {formatCurrency(selectedAccount?.balance || 0)}
                </Text>
              </div>
            </Card>
          </div>

          <div className="px-6 pb-6">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onValuesChange={handleValuesChange}
              className="transaction-form"
            >
              <Form.Item name="selectedAccountId" hidden>
                <Input />
              </Form.Item>

              {transactionType === TRANSACTION_TYPE.TRANSFER && (
                <>
                  <Form.Item
                    required
                    name="destinationBank"
                    label="Ngân hàng thụ hường"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngân hàng" },
                    ]}
                  >
                    <Input
                      placeholder="Chọn ngân hàng"
                      size="middle"
                      className="rounded-md"
                      value="EZB"
                      disabled
                      prefix={<BankOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    hasFeedback
                    name="destinationAccountNumber"
                    label="Số tài khoản thụ hưởng"
                    rules={[
                      { required: true, message: "Vui lòng nhập số tài khoản" },
                    ]}
                  >
                    <Select placeholder="Chọn khách hàng" className="w-full">
                      {bankOptions &&
                        bankOptions.length > 0 &&
                        bankOptions?.map((bank) => (
                          <Option key={bank?.id} value={bank?.accountNumber}>
                            <div className="flex items-center gap-2">
                              <span>
                                {bank?.accountHolder} - {bank?.accountNumber}
                              </span>
                            </div>
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </>
              )}

              <Form.Item
                name="amount"
                label="Số tiền"
                rules={[
                  { required: true, message: "Vui lòng nhập số tiền" },
                  {
                    validator: (_, value) => {
                      if (!value || value <= 0) {
                        return Promise.reject("Số tiền phải lớn hơn 0");
                      }
                      if (
                        (transactionType === TRANSACTION_TYPE.WITHDRAW ||
                          transactionType === TRANSACTION_TYPE.TRANSFER) &&
                        value > (selectedAccount?.balance || 0)
                      ) {
                        return Promise.reject("Số tiền vượt quá số dư hiện có");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber<number>
                  className="w-full"
                  min={1000}
                  step={100000}
                  size="middle"
                  precision={0}
                  placeholder="Nhập số tiền"
                  prefix={<DollarOutlined className="mr-1 text-gray-400" />}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    parseFloat((value ?? "").replace(/\$\s?|(,*)/g, "")) || 0
                  }
                  addonAfter="đ"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item required={false} name="description" label="Mô tả">
                <Input.TextArea
                  placeholder={"Nhập mô tả giao dịch"}
                  maxLength={200}
                  showCount
                  rows={3}
                  className="w-full rounded-md hover:border-primary focus:border-primary"
                />
              </Form.Item>

              {amount > 0 && (
                <div className="mb-4 flex justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex-1">
                    <Text type="secondary">Số tiền giao dịch:</Text>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: config.textColor }}
                    >
                      {formatCurrency(amount)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Text type="secondary">Ngày giao dịch:</Text>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: config.textColor }}
                    >
                      {formatTimestampWithHour(new Date().toISOString())}
                    </div>
                  </div>
                </div>
              )}

              <Form.Item className="mb-0 mt-4">
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    onClick={onClose}
                    size="large"
                    className="min-w-24 rounded-lg font-medium"
                  >
                    Hủy
                  </Button>
                  <Tooltip title={amount <= 0 ? "Vui lòng nhập số tiền" : null}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      disabled={amount <= 0}
                      style={{
                        backgroundColor:
                          amount > 0 ? config.buttonBgColor : undefined,
                      }}
                      className="min-w-40 rounded-lg font-medium"
                    >
                      {config.icon}
                      {config.buttonText}
                    </Button>
                  </Tooltip>
                </div>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </Modal>
  );
};

export { TransactionModal };
