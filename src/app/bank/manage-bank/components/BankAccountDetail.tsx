"use client";

import { LoadingSectionWrapper } from "@/components";
import { ButtonCustom } from "@/components/ui/button";
import { TRANSACTION_TYPE } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import {
  formatCurrency,
  formatDate,
  formatTimestampWithHour,
} from "@/helpers/libs/utils";
import { BankAccount } from "@/types/bankAccount.types";
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
import { useRouter } from "next/navigation";
import { useBankManagement } from "../hooks/useBankManagement";
import { TransactionModal } from "./TransactionModal";

const BankAccountDetail = () => {
  const router = useRouter();
  const { state, handler } = useBankManagement();
  const { Text } = Typography;

  const backToAccounts = () => {
    router.push("/bank/manage-bank");
  };

  const transactionColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, _record: any, index: number) =>
        (state.pageIndex - 1) * state.pageSize + index + 1,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: any) => {
        let color = Colors.colors.red;
        let prefix = "-";

        switch (record.type) {
          case TRANSACTION_TYPE.DEPOSIT:
            color = Colors.colors.green;
            prefix = "+";
            break;
          case TRANSACTION_TYPE.TRANSFER:
            color = Colors.colors.red;
            prefix = "-";
            break;
          case TRANSACTION_TYPE.WITHDRAW:
          default:
            color = Colors.colors.red;
            prefix = "-";
        }
        return (
          <Text strong style={{ color }}>
            {prefix}
            {formatCurrency(amount)}
          </Text>
        );
      },
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
      render: (type: number) => {
        let color = "red";
        let label = "Rút tiền";

        switch (type) {
          case TRANSACTION_TYPE.DEPOSIT:
            color = "blue";
            label = "Nạp tiền";
            break;
          case TRANSACTION_TYPE.TRANSFER:
            color = "orange";
            label = "Chuyển tiền";
            break;
          case TRANSACTION_TYPE.WITHDRAW:
          default:
            color = "red";
            label = "Rút tiền";
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "SUCCESS" ? "green" : "red"}>
          {status === "SUCCESS" ? "Thành công" : "Thất bại"}
        </Tag>
      ),
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (transactionDate: string) =>
        formatTimestampWithHour(transactionDate),
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
                    onClick={backToAccounts}
                    className="flex cursor-pointer items-center"
                  >
                    Danh sách tài khoản
                  </span>
                ),
              },
              {
                title: state.accountDetail?.data?.accountNumber
                  ? `Tài khoản ${state.accountDetail?.data?.accountNumber}`
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
                  Chi tiết tài khoản {state.accountDetail?.data?.userName}
                </span>
              </div>
            }
            bordered={false}
            className="rounded-lg bg-white shadow-sm"
            extra={
              <Space>
                <ButtonCustom
                  onClick={() =>
                    handler.showTransactionModal(
                      TRANSACTION_TYPE.DEPOSIT as any,
                      state.accountDetail?.data,
                    )
                  }
                  className="flex w-[100px] items-center gap-2 bg-green px-5 text-white hover:bg-green/75"
                >
                  <ArrowUpOutlined /> <span>Nạp tiền</span>
                </ButtonCustom>
                <ButtonCustom
                  onClick={() =>
                    handler.showTransactionModal(
                      TRANSACTION_TYPE.WITHDRAW as any,
                      state.accountDetail?.data,
                    )
                  }
                  className="flex w-[100px] items-center gap-2 bg-red px-5 text-white hover:bg-red/75"
                >
                  <ArrowDownOutlined /> <span>Rút tiền</span>
                </ButtonCustom>
                <ButtonCustom
                  onClick={() =>
                    handler.showTransactionModal(
                      TRANSACTION_TYPE.TRANSFER as any,
                      state.accountDetail?.data,
                    )
                  }
                  className="hover:bg-blue/75 flex min-w-[100px] items-center gap-2 bg-blue-500 px-5 text-white"
                >
                  <SwapOutlined /> <span>Chuyển tiền</span>
                </ButtonCustom>
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
                <span>Lịch sử giao dịch</span>
              </div>
            }
            bordered={false}
            className="rounded-lg bg-white shadow-sm"
            extra={
              <div className="flex items-center text-sm text-gray-500">
                <Tooltip title="Hiển thị tất cả các giao dịch của tài khoản này">
                  <InfoCircleOutlined className="mr-1" />
                  {state.transactionList?.totalCount} giao dịch
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
