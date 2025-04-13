"use client";

import { LoadingSectionWrapper } from "@/components";
import { ButtonCustom } from "@/components/ui/button";
import { Colors } from "@/helpers/constants/color";
import {
  formatCurrency,
  formatDate,
  formatTimestampWithHour,
} from "@/helpers/libs/utils";
import { useGetDetailBankAccountQuery } from "@/services/account";
import { useGetTransactionListQuery } from "@/services/transaction";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Card,
  Space,
  Statistic,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const transactionTypes = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
};

const BankAccountDetail = () => {
  const router = useRouter();
  const { id } = useParams();

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState({});
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [transactionType, setTransactionType] = useState(null);

  const { data: accountDetail, isLoading: isLoadingAccountDetail } =
    useGetDetailBankAccountQuery(id, { skip: !id });
  const { Title, Text, Paragraph } = Typography;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };
  const { data: transactionList } = useGetTransactionListQuery(
    {
      accountId: id,
      PageIndex: 1,
      PageSize: 100,
    },
    { skip: !id },
  );

  useEffect(() => {
    if (accountDetail && accountDetail.data) {
      setSelectedAccount(accountDetail?.data);

      if (accountDetail?.data?.transactions) {
        setTransactions({
          [accountDetail.accountNumber]: accountDetail.transactions,
        });
      }
    }
  }, [accountDetail]);

  const backToAccounts = () => {
    router.push("/bank/manage-bank");
  };

  const showTransactionModal = (type, account) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setIsTransactionModalVisible(true);
  };

  const transactionColumns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, _record: any, index: number) =>
        (pageIndex - 1) * pageSize + index + 1,
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
      render: (amount, record) => (
        <Text
          strong
          style={{
            color:
              record.type === transactionTypes.DEPOSIT
                ? Colors.colors.green
                : Colors.colors.red,
          }}
        >
          {record.type === transactionTypes.DEPOSIT ? "+" : "-"}
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === transactionTypes.DEPOSIT ? "blue" : "red"}>
          {type === transactionTypes.DEPOSIT ? "Nạp tiền" : "Rút tiền"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "SUCCESS" ? "green" : "red"}>
          {status === "SUCCESS" ? "Thành công" : "Thất bại"}
        </Tag>
      ),
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (transactionDate) => formatTimestampWithHour(transactionDate),
    },
  ];

  return (
    <LoadingSectionWrapper isLoading={isLoadingAccountDetail}>
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
                    prefix={
                      <CreditCardOutlined className="mr-1 text-primary" />
                    }
                    valueRender={() => (
                      <Text className="text-2xl">
                        {accountDetail?.data?.accountNumber}
                      </Text>
                    )}
                  />
                </Card>
                <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                  <Statistic
                    title="Số dư hiện tại"
                    value={accountDetail?.data?.balance}
                    precision={0}
                    suffix="VND"
                    valueStyle={{
                      color:
                        accountDetail?.data?.balance > 0
                          ? Colors.colors.green
                          : Colors.colors.red,
                    }}
                    prefix={
                      accountDetail?.data?.balance > 0 ? (
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
                    value={accountDetail?.data?.accountHolder}
                    prefix={<UserOutlined className="mr-1 text-primary" />}
                  />
                </Card>
                <Card className="rounded-lg border bg-thirdly/30 p-4 shadow-sm">
                  <Statistic
                    title="Ngày tạo"
                    value={formatDate(accountDetail?.data?.createdAt)}
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
                  {transactionList?.totalCount} giao dịch
                </Tooltip>
              </div>
            }
          >
            <>
              <Table
                dataSource={transactionList?.items ?? []}
                columns={transactionColumns}
                rowKey="id"
                pagination={{
                  current: pageIndex,
                  total: transactionList?.totalCount,
                  pageSize: pageSize,
                }}
                className="mt-2"
                rowClassName="hover:bg-light transition-colors"
                onChange={handlePageChange}
              />
            </>
          </Card>
        </div>

        {/* Transaction Modal will need to be implemented here or imported */}
      </div>
    </LoadingSectionWrapper>
  );
};

export default BankAccountDetail;
