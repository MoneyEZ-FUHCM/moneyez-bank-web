"use client";

import { ButtonCustom } from "@/components/ui/button";
import { InputCustom } from "@/components/ui/input";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency, formatTimestampWithHour } from "@/helpers/libs/utils";
import { BankAccount } from "@/types/bankAccount.types";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PlusOutlined,
  SearchOutlined,
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
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { useBankManagement } from "./hooks/useBankManagement";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const transactionTypes = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
};

const BankManagement = () => {
  const { state, handler } = useBankManagement();

  const accountColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: "5%",
      render: (_: any, _record: any, index: number) =>
        (state.pageIndex - 1) * state.pageSize + index + 1,
    },
    {
      title: "Số tài khoản",
      dataIndex: "accountNumber",
      key: "accountNumber",
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
      dataIndex: "accountHolder",
      key: "userName",
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
      dataIndex: "balance",
      key: "balance",
      width: "17%",
      render: (balance: number) => (
        <Text
          strong
          style={{
            color: balance > 0 ? Colors.colors.green : Colors.colors.red,
          }}
        >
          {formatCurrency(balance)}
        </Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "20%",
      render: (date: string | number | Date) =>
        formatTimestampWithHour(date as string),
    },
    {
      title: "Chức năng",
      key: "actions",
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
                  transactionTypes.DEPOSIT as any,
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
                  transactionTypes.WITHDRAW as any,
                  record,
                )
              }
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
      <div className="grid grid-cols-2 gap-4">
        <Statistic
          title="Người dùng"
          value={state.userList?.totalCount || 0}
          prefix={<CreditCardOutlined className="mr-1 text-green" />}
          className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
        />
        <Statistic
          title="Số tiền"
          value={state.accountTotalMoney || 0}
          precision={0}
          suffix="đ"
          prefix={<DollarOutlined className="mr-1 text-green" />}
          className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
        />
      </div>

      <div className="mt-6">
        {/* <div className="mt-3">
          {accountList && accountList?.items?.length > 0 ? (
            <Progress
              percent={percent}
              status="active"
              strokeColor={Colors.colors.primary}
            />
          ) : (
            <Empty
              description="Chưa có hoạt động nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="my-4"
            />
          )}
        </div> */}
      </div>

      <Divider />

      <div>
        <Title level={5}>
          <InfoCircleOutlined className="mr-2" />
          Hướng dẫn sử dụng
        </Title>
        <Paragraph className="mt-3">
          <ul className="list-disc pl-6">
            <li className="mb-2">
              Tạo tài khoản mới bằng cách điền thông tin bên phải
            </li>
            <li className="mb-2">
              Quản lý tài khoản với các thao tác nạp/rút tiền
            </li>
            <li className="mb-2">
              Xem chi tiết lịch sử giao dịch của mỗi tài khoản
            </li>
          </ul>
        </Paragraph>
      </div>
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
                <ButtonCustom className="mx-auto mt-5 flex h-11 w-36 items-center justify-center gap-0.5 rounded-[5px] bg-primary px-6 tracking-wider text-superlight hover:bg-primary/80">
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

  const renderTransactionModal = () => (
    <Modal
      title={
        <div className="flex items-center py-1 text-lg font-semibold">
          {state.transactionType === transactionTypes.DEPOSIT ? (
            <>
              <div className="bg-green-100 flex h-8 w-8 items-center justify-center rounded-full">
                <ArrowUpOutlined className="text-lg text-green" />
              </div>
              <span>Nạp tiền</span>
            </>
          ) : (
            <>
              <div className="bg-red-100 flex h-8 w-8 items-center justify-center rounded-full">
                <ArrowDownOutlined className="text-lg text-red" />
              </div>
              <span>Rút tiền</span>
            </>
          )}
        </div>
      }
      open={state.isTransactionModalVisible}
      footer={null}
      onCancel={() => handler.setIsTransactionModalVisible(false)}
      centered
      className="transaction-modal"
      width={500}
      closeIcon={<CloseOutlined className="text-gray-500" />}
    >
      {state.selectedAccount && (
        <>
          <Card
            className="mb-6 overflow-hidden rounded-xl shadow-sm"
            bordered={false}
            style={{
              background:
                state.transactionType === transactionTypes.DEPOSIT
                  ? "linear-gradient(145deg, #f0f9f0 0%, #e6f7e6 100%)"
                  : "linear-gradient(145deg, #fff5f5 0%, #fee2e2 100%)",
            }}
            bodyStyle={{ padding: "16px 20px" }}
          >
            <div className="mb-4 grid grid-cols-2 gap-6">
              <div>
                <Text className="mb-2 block font-medium text-gray-600">
                  Tài khoản:
                </Text>
                <Text className="block text-base font-semibold">
                  {state.selectedAccount?.accountNumber}
                </Text>
              </div>
              <div>
                <Text className="mb-2 block font-medium text-gray-600">
                  Chủ tài khoản:
                </Text>
                <Text className="block text-base font-semibold">
                  {state.selectedAccount?.accountHolder}
                </Text>
              </div>
            </div>
            <Divider className="my-1" />
            <div className="mt-3">
              <Text className="mb-2 block font-medium text-gray-600">
                Số dư hiện tại:
              </Text>
              <Text
                className="block text-xl font-bold"
                style={{
                  color:
                    state.selectedAccount?.balance > 0 ? "#16a34a" : "#dc2626",
                }}
              >
                {formatCurrency(state.selectedAccount?.balance)}
              </Text>
            </div>
          </Card>

          <Form
            form={state.transactionForm}
            layout="vertical"
            onFinish={handler.handleTransaction}
            className="transaction-form"
          >
            <Form.Item
              name="amount"
              required
              label={<span className="font-medium text-gray-700">Số tiền</span>}
              rules={[
                { required: true, message: "Vui lòng nhập số tiền" },
                {
                  validator: (_, value) => {
                    if (value <= 0) {
                      return Promise.reject("Số tiền phải lớn hơn 0");
                    }
                    if (
                      state.transactionType === transactionTypes.WITHDRAW &&
                      value > (state.selectedAccount?.balance ?? 0)
                    ) {
                      return Promise.reject(
                        "Số dư không đủ để thực hiện giao dịch này",
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber<number>
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
            <Form.Item
              name="description"
              label={<span className="font-medium text-gray-700">Mô tả</span>}
            >
              <Input.TextArea
                placeholder="Nhập mô tả giao dịch (không bắt buộc)"
                rows={3}
                className="rounded-lg border focus-within:!border-primary hover:!border-primary"
              />
            </Form.Item>
            <Form.Item className="mb-0">
              <div className="mt-5 flex justify-end gap-3">
                <Button
                  onClick={() => handler.setIsTransactionModalVisible(false)}
                  size="large"
                  className="min-w-24 rounded-lg border-gray-300 font-medium hover:bg-gray-50 hover:text-gray-700"
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className={`min-w-32 rounded-lg font-medium ${
                    state.transactionType === transactionTypes.DEPOSIT
                      ? "border-green bg-green hover:!bg-green"
                      : "border-red bg-red hover:!bg-red"
                  }`}
                  icon={
                    state.transactionType === transactionTypes.DEPOSIT ? (
                      <ArrowUpOutlined className="mr-1" />
                    ) : (
                      <ArrowDownOutlined className="mr-1" />
                    )
                  }
                >
                  Xác nhận{" "}
                  {state.transactionType === transactionTypes.DEPOSIT
                    ? "nạp"
                    : "rút"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 p-6">
        {renderAccountsView()}
        {renderTransactionModal()}
      </main>
    </div>
  );
};

export default BankManagement;
