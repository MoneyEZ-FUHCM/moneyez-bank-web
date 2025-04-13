"use client";

import { ButtonCustom } from "@/components/ui/button";
import { Colors } from "@/helpers/constants/color";
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  BankOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PlusOutlined,
  TransactionOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Color palette

// Mock user data
const users = [
  { id: "1", name: "Đức Long An", email: "duclongan@gmail.com" },
  { id: "2", name: "Tran Thi B", email: "tranthib@example.com" },
  { id: "3", name: "Le Van C", email: "levanc@example.com" },
];

// Mock transaction types
const transactionTypes = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
};

// Mock banking stats for dashboard
const bankingStats = {
  totalAccounts: 35,
  totalBalance: 1250000000,
  avgBalance: 35714285,
  activeUsers: 28,
  recentTransactions: 5,
};

const BankManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState({});
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [transactionForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [currentView, setCurrentView] = useState("accounts"); // "accounts" or "accountDetail"

  // Generate random account number
  const generateAccountNumber = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  // Create a new account
  const handleCreateAccount = (values) => {
    const accountNumber = values.accountNumber;
    const newAccount = {
      id: Date.now().toString(),
      accountNumber: accountNumber,
      initialBalance: values.initialBalance || 0,
      balance: values.initialBalance || 0,
      userId: values.userId,
      userName: users.find((u) => u.id === values.userId).name,
      userEmail: users.find((u) => u.id === values.userId).email,
      createdAt: new Date().toISOString(),
    };

    setAccounts([...accounts, newAccount]);
    setTransactions({
      ...transactions,
      [accountNumber]: [],
    });

    notification.success({
      message: "Tài khoản đã được tạo thành công",
      description: `Số tài khoản: ${newAccount.accountNumber} - Số dư: ${newAccount.balance.toLocaleString()} VND`,
    });

    createForm.resetFields();
  };

  // Handle transaction (deposit/withdraw)
  const handleTransaction = (values) => {
    const { amount, description } = values;
    const account = selectedAccount;

    const newTransaction = {
      id: Date.now().toString(),
      amount,
      type: transactionType,
      description:
        description ||
        (transactionType === transactionTypes.DEPOSIT
          ? "Nạp tiền"
          : "Rút tiền"),
      date: new Date().toISOString(),
    };

    let newBalance = account.balance;
    if (transactionType === transactionTypes.DEPOSIT) {
      newBalance += amount;
    } else if (transactionType === transactionTypes.WITHDRAW) {
      if (amount > account.balance) {
        notification.error({
          message: "Lỗi giao dịch",
          description: "Số dư không đủ để thực hiện giao dịch này",
        });
        return;
      }
      newBalance -= amount;
    }

    // Update the account in the accounts list
    const updatedAccounts = accounts.map((acc) => {
      if (acc.accountNumber === account.accountNumber) {
        return { ...acc, balance: newBalance };
      }
      return acc;
    });

    // Update the selected account
    const updatedAccount = { ...account, balance: newBalance };

    // Update transactions for this account
    const accountTransactions = transactions[account.accountNumber] || [];
    const updatedTransactions = {
      ...transactions,
      [account.accountNumber]: [newTransaction, ...accountTransactions],
    };

    setAccounts(updatedAccounts);
    setSelectedAccount(updatedAccount);
    setTransactions(updatedTransactions);

    notification.success({
      message: "Giao dịch thành công",
      description: `${transactionType === transactionTypes.DEPOSIT ? "Nạp" : "Rút"} ${amount.toLocaleString()} VND thành công. Số dư hiện tại: ${newBalance.toLocaleString()} VND`,
    });

    setIsTransactionModalVisible(false);
    transactionForm.resetFields();
  };

  // Show transaction modal
  const showTransactionModal = (type, account) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setIsTransactionModalVisible(true);
  };

  // Show account details
  const showAccountDetail = (account) => {
    setSelectedAccount(account);
    setCurrentView("accountDetail");
  };

  // Return to accounts list
  const backToAccounts = () => {
    setCurrentView("accounts");
  };

  // Transaction columns for the table
  const transactionColumns = [
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === transactionTypes.DEPOSIT
              ? Colors.colors.green
              : Colors.colors.red
          }
          className="text-white"
        >
          {type === transactionTypes.DEPOSIT ? "Nạp tiền" : "Rút tiền"}
        </Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <Text
          className="font-bold"
          style={{
            color:
              record.type === transactionTypes.DEPOSIT
                ? Colors.colors.green
                : Colors.colors.red,
          }}
        >
          {record.type === transactionTypes.DEPOSIT ? "+" : "-"}
          {amount.toLocaleString()} VND
        </Text>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  // Columns for accounts list
  const accountColumns = [
    {
      title: "Số tài khoản",
      dataIndex: "accountNumber",
      key: "accountNumber",
      render: (text) => (
        <Text copyable strong>
          {text}
        </Text>
      ),
    },
    {
      title: "Chủ tài khoản",
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => (
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
      render: (balance) => (
        <Text
          strong
          style={{
            color: balance > 0 ? Colors.colors.green : Colors.colors.red,
          }}
        >
          {balance.toLocaleString()} VND
        </Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chi tiết tài khoản">
            <Button
              type="primary"
              size="small"
              icon={<CreditCardOutlined />}
              onClick={() => showAccountDetail(record)}
              className="border-[#609084] bg-[#609084] hover:bg-[#507874]"
            />
          </Tooltip>
          <Tooltip title="Nạp tiền">
            <Button
              type="primary"
              size="small"
              icon={<ArrowUpOutlined />}
              onClick={() =>
                showTransactionModal(transactionTypes.DEPOSIT, record)
              }
              className="border-[#00A010] bg-[#00A010] hover:bg-[#008010]"
            />
          </Tooltip>
          <Tooltip title="Rút tiền">
            <Button
              danger
              size="small"
              icon={<ArrowDownOutlined />}
              onClick={() =>
                showTransactionModal(transactionTypes.WITHDRAW, record)
              }
              className="border-[#CC0000] bg-[#CC0000] hover:bg-[#AA0000]"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const generateRandomAccountNumber = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

  const handleGenerate = () => {
    const randomNumber = generateRandomAccountNumber();
    createForm.setFieldsValue({ accountNumber: randomNumber });
  };

  // Render dashboard summary stats
  const renderDashboardStats = () => (
    <Card
      title={
        <div className="flex items-center gap-2">
          <LineChartOutlined />
          <span>Thống kê hệ thống</span>
        </div>
      }
      bordered={false}
      className="min-h-[460px] rounded-lg bg-white shadow-sm"
    >
      <div className="grid grid-cols-2 gap-4">
        <Statistic
          title="Tổng số tài khoản"
          value={accounts.length || 0}
          prefix={
            <CreditCardOutlined style={{ color: Colors.colors.primary }} />
          }
          className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
        />
        <Statistic
          title="Tổng số dư"
          value={
            accounts.reduce((sum, account) => sum + account.balance, 0) || 0
          }
          precision={0}
          suffix="VND"
          prefix={<DollarOutlined className="text-green" />}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
        />
      </div>

      <div className="mt-6">
        <Title level={5}>
          <ClockCircleOutlined className="mr-2" />
          Hoạt động gần đây
        </Title>
        <div className="mt-3">
          {accounts.length > 0 ? (
            <Progress
              percent={Math.min(
                Math.round((accounts.length / bankingStats.activeUsers) * 100),
                100,
              )}
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
        </div>
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

  // Render account list view
  const renderAccountsView = () => (
    <div className="flex flex-col gap-6">
      {/* Page header */}
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
              form={createForm}
              layout="vertical"
              onFinish={handleCreateAccount}
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
                    const user = users.find((u) => u.id === value);
                    setSelectedUser(user);
                  }}
                  className="w-full"
                >
                  {users.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {user.name} ({user.email})
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
                  className="rounded-lg px-3 py-2 hover:border-primary focus:border-primary"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="initialBalance"
                label="Số dư ban đầu"
                initialValue={0}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  step={100000}
                  precision={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="VND"
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
            <div className="flex items-center gap-2">
              <UnorderedListOutlined />
              <span>Danh Sách Tài Khoản ({accounts.length})</span>
            </div>
          }
          bordered={false}
          className="rounded-lg bg-white shadow-sm"
        >
          {accounts.length > 0 ? (
            <Table
              dataSource={accounts}
              columns={accountColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              className="mt-4"
              rowClassName="hover:bg-light transition-colors"
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

  // Render account detail view
  const renderAccountDetailView = () => (
    <div className="flex flex-col gap-4">
      <div className="mb-4">
        <Breadcrumb
          items={[
            {
              title: (
                <span
                  onClick={backToAccounts}
                  className="flex cursor-pointer items-center"
                >
                  Danh sách tài khoản
                </span>
              ),
            },
            {
              title: selectedAccount
                ? `Tài khoản ${selectedAccount.accountNumber}`
                : "",
            },
          ]}
        />
      </div>

      <div className="mb-4">
        <Card
          title={
            <div className="flex items-center gap-2">
              <CreditCardOutlined />
              <span>Chi tiết tài khoản {selectedAccount?.userName}</span>
            </div>
          }
          bordered={false}
          className="rounded-lg bg-white shadow-sm"
          extra={
            <Space>
              <ButtonCustom
                onClick={() =>
                  showTransactionModal(
                    transactionTypes.DEPOSIT,
                    selectedAccount,
                  )
                }
                className="flex w-[100px] items-center gap-2 bg-green px-5 text-white hover:bg-green/75"
              >
                <ArrowUpOutlined /> <span>Nạp tiền</span>
              </ButtonCustom>
              <ButtonCustom
                onClick={() =>
                  showTransactionModal(
                    transactionTypes.WITHDRAW,
                    selectedAccount,
                  )
                }
                className="flex w-[100px] items-center gap-2 bg-red px-5 text-white hover:bg-red/75"
              >
                <ArrowDownOutlined /> <span>Rút tiền</span>
              </ButtonCustom>
            </Space>
          }
        >
          {selectedAccount && (
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                <Statistic
                  title="Số tài khoản"
                  value={selectedAccount.accountNumber}
                  prefix={<CreditCardOutlined className="text-primary" />}
                />
              </Card>
              <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                <Statistic
                  title="Số dư hiện tại"
                  value={selectedAccount.balance}
                  precision={0}
                  suffix="VND"
                  valueStyle={{
                    color:
                      selectedAccount.balance > 0
                        ? Colors.colors.green
                        : Colors.colors.red,
                  }}
                  prefix={
                    selectedAccount.balance > 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Card>
              <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                <Statistic
                  title="Chủ tài khoản"
                  value={selectedAccount.userName}
                  prefix={<UserOutlined className="text-primary" />}
                />
              </Card>
              <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                <Statistic
                  title="Ngày tạo"
                  value={new Date(selectedAccount.createdAt).toLocaleDateString(
                    "vi-VN",
                  )}
                  prefix={<BarChartOutlined className="text-primary" />}
                />
              </Card>
            </div>
          )}
        </Card>
      </div>

      <div>
        <Card
          title={
            <div className="flex items-center gap-2">
              <TransactionOutlined />
              <span>Lịch sử giao dịch</span>
            </div>
          }
          bordered={false}
          className="rounded-lg bg-white shadow-sm"
          extra={
            <div className="flex items-center text-sm text-gray-500">
              <Tooltip title="Hiển thị tất cả các giao dịch của tài khoản này">
                <InfoCircleOutlined className="mr-1" />
                {
                  (transactions[selectedAccount?.accountNumber] || []).length
                }{" "}
                giao dịch
              </Tooltip>
            </div>
          }
        >
          {selectedAccount && (
            <>
              {(transactions[selectedAccount.accountNumber] || []).length >
              0 ? (
                <Table
                  dataSource={transactions[selectedAccount.accountNumber]}
                  columns={transactionColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  className="mt-2"
                  rowClassName="hover:bg-light transition-colors"
                />
              ) : (
                <Empty
                  description={
                    <span>
                      Chưa có giao dịch nào.{" "}
                      <Button
                        type="link"
                        className="p-0 text-primary"
                        onClick={() =>
                          showTransactionModal(
                            transactionTypes.DEPOSIT,
                            selectedAccount,
                          )
                        }
                      >
                        Tạo giao dịch đầu tiên
                      </Button>
                    </span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="my-6"
                />
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );

  // Transaction Modal
  const renderTransactionModal = () => (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {transactionType === transactionTypes.DEPOSIT ? (
            <>
              <ArrowUpOutlined className="text-primary" /> Nạp tiền
            </>
          ) : (
            <>
              <ArrowDownOutlined className="text-red" /> Rút tiền
            </>
          )}
        </div>
      }
      open={isTransactionModalVisible}
      footer={null}
      onCancel={() => setIsTransactionModalVisible(false)}
      centered
      className="rounded-lg"
    >
      {selectedAccount && (
        <>
          <Card className="mb-4 rounded-lg bg-[#EBEFD6]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Tài khoản:</Text>
                <br />
                <Text>{selectedAccount.accountNumber}</Text>
              </div>
              <div>
                <Text strong>Chủ tài khoản:</Text>
                <br />
                <Text>{selectedAccount.userName}</Text>
              </div>
            </div>
            <div className="mt-4">
              <Text strong>Số dư hiện tại:</Text>
              <br />
              <Text
                className="text-lg font-bold"
                style={{
                  color:
                    selectedAccount.balance > 0
                      ? Colors.colors.green
                      : Colors.colors.red,
                }}
              >
                {selectedAccount.balance.toLocaleString()} VND
              </Text>
            </div>
          </Card>

          <Form
            form={transactionForm}
            layout="vertical"
            onFinish={handleTransaction}
          >
            <Form.Item
              name="amount"
              label="Số tiền"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền" },
                {
                  validator: (_, value) => {
                    if (value <= 0) {
                      return Promise.reject("Số tiền phải lớn hơn 0");
                    }
                    if (
                      transactionType === transactionTypes.WITHDRAW &&
                      value > selectedAccount.balance
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
              <InputNumber
                className="w-full"
                min={1}
                step={100000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                addonAfter="VND"
                size="large"
              />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea
                placeholder="Nhập mô tả giao dịch (không bắt buộc)"
                rows={3}
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsTransactionModalVisible(false)}
                  size="large"
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className={
                    transactionType === transactionTypes.DEPOSIT
                      ? "border-[#00A010] bg-[#00A010] hover:bg-[#008010]"
                      : "border-[#CC0000] bg-[#CC0000] hover:bg-[#AA0000]"
                  }
                >
                  Xác nhận
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
        {currentView === "accounts"
          ? renderAccountsView()
          : renderAccountDetailView()}
        {renderTransactionModal()}
      </main>
    </div>
  );
};

export default BankManagement;
