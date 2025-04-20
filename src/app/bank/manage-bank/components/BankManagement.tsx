"use client";

import { LoadingSectionWrapper } from "@/components";
import { ButtonCustom } from "@/components/ui/button";
import { InputCustom } from "@/components/ui/input";
import { TRANSACTION_TYPE } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency, formatTimestampWithHour } from "@/helpers/libs/utils";
import { BankAccount } from "@/types/bankAccount.types";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PlusOutlined,
  SearchOutlined,
  SwapOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { BANK_MANAGEMENT_CONSTANT } from "../bank.constants";
import { TEXT_TRANSLATE } from "../bank.translate";
import { useBankManagement } from "../hooks/useBankManagement";
import { TransactionModal } from "./TransactionModal";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const BankManagement = () => {
  const { state, handler } = useBankManagement();
  const { FORM_NAME } = BANK_MANAGEMENT_CONSTANT;

  const accountColumns = [
    {
      title: "STT",
      dataIndex: FORM_NAME.INDEX,
      key: FORM_NAME.INDEX,
      width: "5%",
      render: (_: any, _record: any, index: number) =>
        (state.pageIndex - 1) * state.pageSize + index + 1,
    },
    {
      title: "Số tài khoản",
      dataIndex: FORM_NAME.ACCOUNT_NUMBER,
      key: FORM_NAME.ACCOUNT_NUMBER,
      width: "20%",
      render: (text: string) => (
        <Text
          copyable={{
            icon: [<span>📋</span>, <span>✅</span>],
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Chủ tài khoản",
      dataIndex: FORM_NAME.ACCOUNT_HOLDER,
      key: FORM_NAME.ACCOUNT_HOLDER,
      width: "28%",
      render: (text: string, record: any) => (
        <Space>
          <Avatar className="bg-primary" icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Số dư hiện tại",
      dataIndex: FORM_NAME.BALANCE,
      key: FORM_NAME.BALANCE,
      width: "17%",
      render: (balance: number) => (
        <Text
          strong
          style={{
            color: balance >= 0 ? Colors.colors.green : Colors.colors.red,
          }}
        >
          {formatCurrency(balance)}
        </Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: FORM_NAME.CREATED_AT,
      key: FORM_NAME.CREATED_AT,
      width: "20%",
      render: (date: string | number | Date) =>
        formatTimestampWithHour(date as string),
    },
    {
      title: "Chức năng",
      key: FORM_NAME.ACTIONS,
      width: "10%",
      render: (_: any, record: BankAccount) => (
        <Space size="small">
          <Tooltip title="Chi tiết tài khoản">
            <Button
              type="primary"
              size="small"
              icon={<CreditCardOutlined />}
              onClick={() => handler.showAccountDetail(record)}
              className="border-primary bg-transparent !text-primary hover:!bg-gray-100"
            />
          </Tooltip>
          <Tooltip title="Nạp tiền">
            <Button
              type="primary"
              size="small"
              icon={<ArrowUpOutlined />}
              onClick={() =>
                handler.showTransactionModal(
                  TRANSACTION_TYPE.DEPOSIT as any,
                  record,
                )
              }
              className="border-green bg-transparent !text-green hover:!bg-gray-100"
            />
          </Tooltip>
          <Tooltip title="Rút tiền">
            <Button
              danger
              size="small"
              icon={<ArrowDownOutlined />}
              onClick={() =>
                handler.showTransactionModal(
                  TRANSACTION_TYPE.WITHDRAW as any,
                  record,
                )
              }
            />
          </Tooltip>
          <Tooltip title="Chuyển tiền">
            <Button
              type="primary"
              size="small"
              icon={<SwapOutlined />}
              onClick={() =>
                handler.showTransactionModal(
                  TRANSACTION_TYPE.TRANSFER as any,
                  record,
                )
              }
              className="border-blue-500 bg-transparent !text-blue-500 hover:!bg-gray-100"
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa tài khoản ngân hàng này không?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handler.handleDeleteAccount(record?.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="border-[#CC0000] bg-[#CC0000] hover:bg-[#AA0000]"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderDashboardStats = () => (
    <Card
      title={
        <div className="flex items-center gap-2">
          <LineChartOutlined />
          <span>Thống kê hệ thống</span>
        </div>
      }
      bordered={false}
      className="min-h-[450px] rounded-lg bg-white shadow-sm"
    >
      <LoadingSectionWrapper isLoading={state.isLoadingAccountDetail}>
        <div className="grid grid-cols-2 gap-4">
          <Statistic
            title="Người dùng"
            value={state.userList?.totalCount || 0}
            prefix={<UserOutlined className="mr-1 text-green" />}
            className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
          />
          <Statistic
            title="Số tài khoản"
            value={state.accountList?.totalCount || 0}
            precision={0}
            prefix={<CreditCardOutlined className="mr-1 text-green" />}
            className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
          />
        </div>
        <Divider />
        <div>
          <Title level={5}>
            <InfoCircleOutlined className="mr-2" />
            Hướng dẫn sử dụng
          </Title>
          <Paragraph className="mt-3">
            <ul className="list-disc pl-6">
              <li className="mb-2">{TEXT_TRANSLATE.TITLE.INSTRUCTION_1}</li>
              <li className="mb-2">{TEXT_TRANSLATE.TITLE.INSTRUCTION_2}</li>
              <li className="mb-2">{TEXT_TRANSLATE.TITLE.INSTRUCTION_3}</li>
            </ul>
          </Paragraph>
        </div>
      </LoadingSectionWrapper>
    </Card>
  );

  const renderAccountsView = () => (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <Title level={3} className="mb-1 text-primary">
          Quản lý tài khoản ngân hàng
        </Title>
        <Text type="secondary">
          Hệ thống quản lý tài khoản và giao dịch ngân hàng
        </Text>
      </div>

      <Row gutter={16} className="w-full">
        <Col xs={24} md={13}>
          {renderDashboardStats()}
        </Col>
        <Col xs={24} md={11}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <PlusOutlined />
                <span>Tạo Tài Khoản Mới</span>
              </div>
            }
            bordered={false}
            className="h-full rounded-lg bg-white shadow-sm"
          >
            <Form
              form={state.form}
              layout="vertical"
              onFinish={handler.handleCreateAccount}
            >
              <Form.Item
                name="userId"
                label="Chọn khách hàng"
                rules={[
                  { required: true, message: "Vui lòng chọn khách hàng" },
                ]}
              >
                <Select
                  placeholder="Chọn khách hàng"
                  onChange={(value) => {
                    const user = state.users?.find((u) => u.id === value);
                    handler.setSelectedUser(user);
                  }}
                  className="w-full"
                >
                  {state.users &&
                    state.users.length > 0 &&
                    state.users?.map((user) => (
                      <Option key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <span>
                            {user?.fullName} - {user?.email}
                          </span>
                        </div>
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="accountNumber"
                hasFeedback
                label="Số tài khoản"
                colon
                className="formItem"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số tài khoản",
                  },
                  {
                    pattern: /^[0-9]{12}$/,
                    message: "Số tài khoản phải bao gồm đúng 12 chữ số",
                  },
                ]}
              >
                <Input
                  prefix={<CreditCardOutlined className="mr-1 text-gray-400" />}
                  type="text"
                  placeholder="Nhập số tài khoản"
                  maxLength={12}
                  className="w-full rounded-md hover:border-primary focus:border-primary"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  addonAfter={
                    <Button
                      type="link"
                      onClick={() => {
                        const randomNumber =
                          handler.generateRandomAccountNumber();
                        state.form.setFieldsValue({
                          accountNumber: randomNumber,
                        });
                      }}
                      className="hover:!pointer-events-autotext-primary text-black"
                    >
                      Tạo
                    </Button>
                  }
                />
              </Form.Item>

              <Form.Item
                name="initialBalance"
                label="Số dư ban đầu"
                initialValue={0}
              >
                <InputNumber<number>
                  prefix={<DollarOutlined className="mr-1 text-gray-400" />}
                  className="w-full"
                  min={0}
                  step={100000}
                  precision={0}
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
              <Form.Item>
                <ButtonCustom className="mx-auto mt-5 flex h-11 w-44 items-center justify-center gap-0.5 rounded-[5px] bg-primary tracking-wider text-superlight hover:bg-primary/80">
                  <PlusOutlined className="mr-1" /> Tạo Tài Khoản
                </ButtonCustom>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <div className="w-full">
        <Card
          title={
            <div className="flex items-center justify-between gap-2 py-3">
              <div className="space-x-2">
                <UnorderedListOutlined />
                <span>
                  Danh Sách Tài Khoản ({state.accountList?.totalCount})
                </span>
              </div>
              <div className="flex items-center">
                <InputCustom
                  value={state.inputValue}
                  onChange={(e) => handler.setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handler.handleSearch(state.inputValue);
                    }
                  }}
                  placeholder="Tìm kiếm tài khoản..."
                  className="h-10 max-w-lg rounded-md rounded-r-none border-r-0 sm:w-[300px]"
                />
                <Button
                  onClick={() => handler.handleSearch(state.inputValue)}
                  className="flex h-10 w-10 items-center rounded-md rounded-l-none border-none !bg-primary"
                >
                  <SearchOutlined className="align-middle text-white" />
                </Button>
              </div>
            </div>
          }
          bordered={false}
          className="rounded-lg bg-white shadow-sm"
        >
          {state.accountList && state.accountList?.items.length > 0 ? (
            <Table
              dataSource={state.accountList.items}
              columns={accountColumns}
              rowKey="id"
              rowClassName="hover:bg-light transition-colors"
              pagination={{
                current: state.pageIndex,
                total: state.accountList?.totalCount,
                pageSize: state.pageSize,
              }}
              onChange={handler.handlePageChange}
            />
          ) : (
            <Empty
              description={<span>Chưa có tài khoản nào được tạo.</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="my-10"
            />
          )}
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <section className="flex-1 p-6">
        {renderAccountsView()}
        <TransactionModal
          form={state.transactionForm}
          isVisible={state.isTransactionModalVisible}
          selectedAccount={state.selectedAccount as BankAccount}
          transactionType={state.transactionType as any}
          onClose={() => handler.setIsTransactionModalVisible(false)}
          onFinish={handler.handleTransaction}
          bankOptions={state.accountListFilter as any}
        />
      </section>
    </div>
  );
};

export { BankManagement };
