"use client";

import { LoadingSectionWrapper } from "@/components";
import { ButtonCustom } from "@/components/ui/button";
import { TRANSACTION_STATUS_TEXT, TRANSACTION_TYPE } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import {
  formatCurrency,
  formatDate,
  formatTimestampWithHour,
} from "@/helpers/libs/utils";
import { BankAccount } from "@/types/bankAccount.types";
import { Transaction } from "@/types/transaction.types";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  SwapOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Card,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { BANK_MANAGEMENT_CONSTANT } from "../bank.constants";
import { TEXT_TRANSLATE } from "../bank.translate";
import { useBankManagement } from "../hooks/useBankManagement";
import { TransactionModal } from "./TransactionModal";
import WebHookTable from "./WebHookTable";

const BankAccountDetail = () => {
  const { state, handler } = useBankManagement();
  const { Text } = Typography;
  const { FORM_NAME } = BANK_MANAGEMENT_CONSTANT;

  const transactionColumns = [
    {
      title: "STT",
      dataIndex: FORM_NAME.INDEX,
      key: FORM_NAME.INDEX,
      render: (_: any, _record: any, index: number) =>
        (state.pageIndex - 1) * state.pageSize + index + 1,
    },
    {
      title: TEXT_TRANSLATE.TITLE.DESCRIPTION,
      dataIndex: FORM_NAME.DESCRIPTION,
      key: FORM_NAME.DESCRIPTION,
    },
    {
      title: TEXT_TRANSLATE.TITLE.RECEIVER,
      key: FORM_NAME.DESTINATION_ACCOUNT_INFO,
      render: (_: any, record: Transaction) => {
        if (record.type === TRANSACTION_TYPE.TRANSFER) {
          return (
            <div className="flex gap-1">
              <strong className="text-primary">
                {record.destinationAccountHolder}
              </strong>
              -<span>{record.destinationAccountNumber}</span>
            </div>
          );
        }
        return null;
      },
    },
    {
      title: TEXT_TRANSLATE.TITLE.TRANSACTION_DIRECTION,
      dataIndex: FORM_NAME.TRANSACTION_DIRECTION,
      key: FORM_NAME.TRANSACTION_DIRECTION,
      render: (transactionDirection: number, record: any) => {
        let color = Colors.colors.red;
        switch (record.type) {
          case TRANSACTION_TYPE.DEPOSIT:
            color = Colors.colors.green;
            break;
          case TRANSACTION_TYPE.TRANSFER:
            color = Colors.colors.red;
            break;
          case TRANSACTION_TYPE.WITHDRAW:
          default:
            color = Colors.colors.red;
        }
        return (
          <Text strong style={{ color }}>
            {formatCurrency(transactionDirection)}
          </Text>
        );
      },
    },
    {
      title: TEXT_TRANSLATE.TITLE.TRANSACTION_TYPE,
      dataIndex: FORM_NAME.TYPE,
      key: FORM_NAME.TYPE,
      render: (type: number) => {
        let color = "red";
        let label = TEXT_TRANSLATE.BUTTON.WITHDRAW;

        switch (type) {
          case TRANSACTION_TYPE.DEPOSIT:
            color = "green";
            label = TEXT_TRANSLATE.BUTTON.DEPOSIT;
            break;
          case TRANSACTION_TYPE.TRANSFER:
            color = "blue";
            label = TEXT_TRANSLATE.BUTTON.TRANSFER;
            break;
          case TRANSACTION_TYPE.WITHDRAW:
          default:
            color = "red";
            label = TEXT_TRANSLATE.BUTTON.WITHDRAW;
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: TEXT_TRANSLATE.TITLE.TRANSACTION_STATUS,
      dataIndex: FORM_NAME.STATUS,
      key: FORM_NAME.STATUS,
      render: (status: string) => (
        <Tag
          color={status === TRANSACTION_STATUS_TEXT.SUCCESS ? "green" : "red"}
        >
          {status === TRANSACTION_STATUS_TEXT.SUCCESS
            ? TEXT_TRANSLATE.TITLE.SUCCESS_STATUS
            : TEXT_TRANSLATE.TITLE.FAILURE_STATUS}
        </Tag>
      ),
    },
    {
      title: TEXT_TRANSLATE.TITLE.TRANSACTION_DATE,
      dataIndex: FORM_NAME.TRANSACTION_DATE,
      key: FORM_NAME.TRANSACTION_DATE,
      render: (transactionDate: string) =>
        formatTimestampWithHour(transactionDate),
    },
  ];

  const transactionButton = [
    {
      type: TRANSACTION_TYPE.DEPOSIT,
      label: TEXT_TRANSLATE.BUTTON.DEPOSIT,
      icon: <ArrowUpOutlined />,
      bg: "bg-green",
      hover: "hover:bg-green/60",
    },
    {
      type: TRANSACTION_TYPE.WITHDRAW,
      label: TEXT_TRANSLATE.BUTTON.WITHDRAW,
      icon: <ArrowDownOutlined />,
      bg: "bg-red",
      hover: "hover:bg-red/60",
    },
    {
      type: TRANSACTION_TYPE.TRANSFER,
      label: TEXT_TRANSLATE.BUTTON.TRANSFER,
      icon: <SwapOutlined />,
      bg: "bg-blue-500",
      hover: "hover:bg-blue-400",
    },
  ];

  return (
    <LoadingSectionWrapper isLoading={state.isLoadingAccountDetail}>
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <Breadcrumb
            items={[
              {
                title: (
                  <span
                    onClick={handler.handleBackToAccount}
                    className="flex cursor-pointer items-center"
                  >
                    {TEXT_TRANSLATE.TITLE.ACCOUNT_LIST}
                  </span>
                ),
              },
              {
                title: state.accountDetail?.data?.accountNumber
                  ? `${TEXT_TRANSLATE.TITLE.ACCOUNT} ${state.accountDetail?.data?.accountNumber}`
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
                <span>
                  {TEXT_TRANSLATE.TITLE.ACCOUNT_DETAIL}{" "}
                  {state.accountDetail?.data?.userName}
                </span>
              </div>
            }
            bordered={false}
            className="rounded-lg bg-white shadow-sm"
            extra={
              <Space className="flex flex-wrap gap-4">
                {transactionButton.map(({ type, label, icon, bg, hover }) => (
                  <ButtonCustom
                    key={type}
                    onClick={() =>
                      handler.showTransactionModal(
                        type as any,
                        state.accountDetail?.data,
                      )
                    }
                    className={`flex min-w-[120px] items-center justify-center gap-2 rounded-xl ${bg} px-6 py-2 text-white shadow-md transition-all ${hover}`}
                  >
                    {icon} <span>{label}</span>
                  </ButtonCustom>
                ))}
              </Space>
            }
          >
            {state.accountDetail?.data && (
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                  <Statistic
                    title="Số tài khoản"
                    prefix={
                      <CreditCardOutlined className="mr-1 text-primary" />
                    }
                    valueRender={() => (
                      <Text className="text-2xl">
                        {state.accountDetail?.data?.accountNumber}
                      </Text>
                    )}
                  />
                </Card>
                <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                  <Statistic
                    title="Số dư hiện tại"
                    value={state.accountDetail?.data?.balance}
                    precision={0}
                    suffix="VND"
                    valueStyle={{
                      color:
                        state.accountDetail?.data?.balance > 0
                          ? Colors.colors.green
                          : Colors.colors.red,
                    }}
                    prefix={
                      state.accountDetail?.data?.balance > 0 ? (
                        <ArrowUpOutlined className="mr-1" />
                      ) : (
                        <ArrowDownOutlined className="mr-1" />
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
                    value={state.accountDetail?.data?.accountHolder}
                    prefix={<UserOutlined className="mr-1 text-primary" />}
                  />
                </Card>
                <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                  <Statistic
                    title="Ngày tạo"
                    value={formatDate(state.accountDetail?.data?.createdAt)}
                    prefix={<BarChartOutlined className="mr-1 text-primary" />}
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
                <span>{TEXT_TRANSLATE.TITLE.TRANSACTION_HISTORY}</span>
              </div>
            }
            bordered={false}
            className="rounded-lg bg-white shadow-sm"
            extra={
              <div className="flex items-center text-sm text-gray-500">
                <Tooltip title="Hiển thị tất cả các giao dịch của tài khoản này">
                  <InfoCircleOutlined className="mr-1" />
                  {state.transactionList?.totalCount}{" "}
                  {TEXT_TRANSLATE.TITLE.TRANSACTION}
                </Tooltip>
              </div>
            }
          >
            <>
              <Table
                dataSource={state.transactionList?.items ?? []}
                columns={transactionColumns}
                rowKey="id"
                pagination={{
                  current: state.pageIndex,
                  total: state.transactionList?.totalCount,
                  pageSize: state.pageSize,
                }}
                className="mt-2"
                rowClassName="hover:bg-light transition-colors"
                onChange={handler.handlePageChange}
              />
            </>
          </Card>
        </div>
        <WebHookTable />
        <TransactionModal
          isVisible={state.isTransactionModalVisible}
          onClose={() => handler.setIsTransactionModalVisible(false)}
          selectedAccount={state.selectedAccount as BankAccount}
          transactionType={state.transactionType as any}
          onFinish={handler.handleTransaction}
          form={state.transactionForm}
          bankOptions={state.accountListFilter}
        />
      </div>
    </LoadingSectionWrapper>
  );
};

export { BankAccountDetail };
