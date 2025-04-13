"use client";

import { ButtonCustom } from "@/components/ui/button";
import { TOAST_STATUS } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatCurrency } from "@/helpers/libs/utils";
import { showToast } from "@/hooks/useShowToast";
import {
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useGetAccountListQuery,
} from "@/services/account";
import { useGetUserListQuery } from "@/services/admin/user";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  CreditCardOutlined,
  DeleteOutlined,
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
import { useMemo, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const transactionTypes = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
};

const BankManagement = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState({});
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [transactionForm] = Form.useForm();
  const [form] = Form.useForm();
  const [currentView, setCurrentView] = useState("accounts");
  const { data: userList, isLoading: isLoadingUserList } = useGetUserListQuery({
    PageIndex: 1,
    PageSize: 100,
  });
  const { data: accountList, isLoading: isLoadingAccountList } =
    useGetAccountListQuery({
      PageIndex: pageIndex,
      PageSize: pageSize,
    });
  const { SYSTEM_ERROR } = COMMON_CONSTANT;

  const [deleteAccount] = useDeleteAccountMutation();
  const [createAccount] = useCreateAccountMutation();

  const handleDeleteAccount = async (payload: string) => {
    try {
      await deleteAccount(payload).unwrap();
    } catch (err: any) {
      const error = err?.data;
      if (error && error.errorCode === "AccountLinkedToWebhook") {
        showToast(
          TOAST_STATUS.ERROR,
          "Tài khoản đã được liên kết. Không được xóa",
        );
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const accountTotalMoney = useMemo(() => {
    return (
      accountList?.items?.reduce((acc, item) => acc + item.balance, 0) || 0
    );
  }, [accountList]);

  const users = userList && userList?.items;

  const handleCreateAccount = async (payload) => {
    try {
      await createAccount(payload).unwrap();
      showToast(
        TOAST_STATUS.SUCCESS,
        `Tài khoản ngân hàng ${payload?.accountNumber} được tạo thành công`,
      );
      form.resetFields();
    } catch (err: any) {
      const error = err?.data;
      if (error && error?.errorCode === "AccountNotExist") {
        showToast(TOAST_STATUS.SUCCESS, "Tài khoản ngân hàng không tồn tại");
        return;
      }
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

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

    const updatedAccounts = accounts.map((acc) => {
      if (acc.accountNumber === account.accountNumber) {
        return { ...acc, balance: newBalance };
      }
      return acc;
    });

    const updatedAccount = { ...account, balance: newBalance };

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

  const showTransactionModal = (type, account) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setIsTransactionModalVisible(true);
  };

  const showAccountDetail = (account) => {
    setSelectedAccount(account);
    setCurrentView("accountDetail");
  };

  const backToAccounts = () => {
    setCurrentView("accounts");
  };

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

  const accountColumns = [
    {
      title: "Số tài khoản",
      dataIndex: "accountNumber",
      key: "accountNumber",
      render: (text) => <Text copyable>{text}</Text>,
    },
    {
      title: "Chủ tài khoản",
      dataIndex: "accountHolder",
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
          {formatCurrency(balance)}
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
          <Tooltip title="Xóa">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteAccount(record?.id)}
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
    form.setFieldsValue({ accountNumber: randomNumber });
  };

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
          title="Người dùng"
          value={userList?.totalCount || 0}
          prefix={<CreditCardOutlined className="mr-1 text-green" />}
          className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
        />
        <Statistic
          title="Số tiền"
          value={accountTotalMoney || 0}
          precision={0}
          suffix="đ"
          prefix={<DollarOutlined className="mr-1 text-green" />}
          className="rounded-lg border bg-thirdly/30 p-4 shadow-sm"
        />
      </div>

      <div className="mt-6">
        <Title level={5}>
          <ClockCircleOutlined className="mr-2" />
          Hoạt động gần đây
        </Title>
        <div className="mt-3">
          {accountList && accountList?.items?.length > 0 ? (
            <Progress
              percent={Math.min(
                Math.round(
                  (accountList?.totalCount /
                    ((userList?.totalCount ?? 0) * 3)) *
                    100,
                ),
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
            <Form form={form} layout="vertical" onFinish={handleCreateAccount}>
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
                    const user = users?.find((u) => u.id === value);
                    setSelectedUser(user);
                  }}
                  className="w-full"
                >
                  {users &&
                    users.length > 0 &&
                    users.map((user) => (
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
                        const randomNumber = generateRandomAccountNumber();
                        form.setFieldsValue({
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
              <span>Danh Sách Tài Khoản ({accountList?.totalCount})</span>
            </div>
          }
          bordered={false}
          className="rounded-lg bg-white shadow-sm"
        >
          {accountList && accountList?.items.length > 0 ? (
            <Table
              dataSource={accountList?.items ?? []}
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

  const renderTransactionModal = () => (
    <Modal
      title={
        <div className="flex items-center gap-3 py-1 text-lg font-semibold">
          {transactionType === transactionTypes.DEPOSIT ? (
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
      open={isTransactionModalVisible}
      footer={null}
      onCancel={() => setIsTransactionModalVisible(false)}
      centered
      className="transaction-modal"
      width={500}
      closeIcon={<CloseOutlined className="text-gray-500" />}
    >
      {selectedAccount && (
        <>
          <Card
            className="mb-6 overflow-hidden rounded-xl shadow-sm"
            bordered={false}
            style={{
              background:
                transactionType === transactionTypes.DEPOSIT
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
                  {selectedAccount.accountNumber}
                </Text>
              </div>
              <div>
                <Text className="mb-2 block font-medium text-gray-600">
                  Chủ tài khoản:
                </Text>
                <Text className="block text-base font-semibold">
                  {selectedAccount.fullName}
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
                  color: selectedAccount.balance > 0 ? "#16a34a" : "#dc2626",
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
            requiredMark={false}
            className="transaction-form"
          >
            <Form.Item
              name="amount"
              label={<span className="font-medium text-gray-700">Số tiền</span>}
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
                addonAfter={<span className="px-2 font-medium">VND</span>}
                size="large"
                style={{ borderRadius: "8px" }}
                placeholder="0"
              />
            </Form.Item>
            <Form.Item
              name="description"
              label={<span className="font-medium text-gray-700">Mô tả</span>}
            >
              <Input.TextArea
                placeholder="Nhập mô tả giao dịch (không bắt buộc)"
                rows={3}
                className="rounded-lg"
                style={{ resize: "none" }}
              />
            </Form.Item>
            <Form.Item className="mb-0">
              <div className="mt-5 flex justify-end gap-3">
                <Button
                  onClick={() => setIsTransactionModalVisible(false)}
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
                    transactionType === transactionTypes.DEPOSIT
                      ? "border-green bg-green hover:!bg-green"
                      : "border-red bg-red hover:!bg-red"
                  }`}
                  icon={
                    transactionType === transactionTypes.DEPOSIT ? (
                      <ArrowUpOutlined className="mr-1" />
                    ) : (
                      <ArrowDownOutlined className="mr-1" />
                    )
                  }
                >
                  Xác nhận{" "}
                  {transactionType === transactionTypes.DEPOSIT ? "nạp" : "rút"}
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
