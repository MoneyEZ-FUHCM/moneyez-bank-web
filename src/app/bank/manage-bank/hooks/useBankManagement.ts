"use client";

import { TOAST_STATUS, TRANSACTION_TYPE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatCurrency } from "@/helpers/libs/utils";
import { showToast } from "@/hooks/useShowToast";
import {
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useGetAccountListAllQuery,
  useGetAccountListQuery,
  useGetDetailBankAccountQuery,
} from "@/services/account";
import { useGetUserListQuery } from "@/services/admin/user";
import {
  useCreateTransactionDepositMutation,
  useCreateTransactionTransferMutation,
  useCreateTransactionWithDrawMutation,
  useGetTransactionListQuery,
} from "@/services/transaction";
import { BankAccount } from "@/types/bankAccount.types";
import { UserFilter } from "@/types/user.types";
import { Form, TablePaginationConfig } from "antd";
import { useParams, useRouter } from "next/navigation";
import { SetStateAction, useEffect, useMemo, useState } from "react";

const useBankManagement = () => {
  const { id } = useParams();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedUser, setSelectedUser] = useState<UserFilter>();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount>();
  const [transactions, setTransactions] = useState({});
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [transactionType, setTransactionType] = useState<
    TRANSACTION_TYPE.DEPOSIT | TRANSACTION_TYPE.WITHDRAW
  >();
  const [transactionForm] = Form.useForm();
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: userList, isLoading: isLoadingUserList } = useGetUserListQuery({
    PageIndex: 1,
    PageSize: 100,
  });

  const {
    data: accountDetail,
    isLoading: isLoadingAccountDetail,
    refetch: refetchAccountDetail,
  } = useGetDetailBankAccountQuery(id, { skip: !id });

  const {
    data: accountList,
    isLoading: isLoadingAccountList,
    refetch: refetchAccountList,
  } = useGetAccountListQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
    search: searchQuery || "",
  });
  const { data: accountListAll, isLoading: isLoadingAccountListAll } =
    useGetAccountListAllQuery({});

  const { data: transactionList } = useGetTransactionListQuery(
    {
      accountId: id,
      PageIndex: 1,
      PageSize: 100,
    },
    { skip: !id },
  );

  const { SYSTEM_ERROR } = COMMON_CONSTANT;

  const [deleteAccount] = useDeleteAccountMutation();
  const [createAccount] = useCreateAccountMutation();
  const [createTransactionDeposit] = useCreateTransactionDepositMutation();
  const [createTransactionWithDraw] = useCreateTransactionWithDrawMutation();
  const [createTransactionTransfer] = useCreateTransactionTransferMutation();

  const router = useRouter();

  useEffect(() => {
    if (accountList) {
      const totalPages = accountList?.totalPages || 1;
      if (pageIndex > totalPages) {
        setPageIndex(totalPages);
      }
    }
  }, [accountList?.totalPages]);

  const accountTotalMoney = useMemo(() => {
    return (
      accountList?.items?.reduce((acc, item) => acc + item.balance, 0) || 0
    );
  }, [accountList]);

  const users = userList && userList?.items;

  const accountListFilter =
    accountListAll &&
    accountListAll?.data &&
    accountListAll?.data?.length > 0 &&
    accountListAll?.data?.filter(
      (account: BankAccount) =>
        account.accountNumber !== selectedAccount?.accountNumber,
    );

  const handleDeleteAccount = async (payload: string) => {
    try {
      await deleteAccount(payload).unwrap();
      showToast(
        TOAST_STATUS.SUCCESS,
        "Tài khoản ngân hàng đã được xóa thành công",
      );
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

  const handleCreateAccount = async (payload: BankAccount) => {
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

  const handleTransaction = async (values: {
    amount: number;
    description: string;
    destinationAccountNumber: string;
    destinationBank: string;
  }) => {
    const { amount, description, destinationAccountNumber } = values;

    const payload = {
      accountId: selectedAccount?.id || id,
      amount,
      description,
    };

    const transferPayload = {
      sourceAccountId: selectedAccount?.id || id,
      destinationBank: "EZB",
      destinationAccountNumber,
      amount,
      description,
    };

    try {
      if (transactionType === TRANSACTION_TYPE.DEPOSIT) {
        await createTransactionDeposit(payload).unwrap();
        showToast(
          TOAST_STATUS.SUCCESS,
          `Chuyển thành công ${formatCurrency(amount)} đến số tài khoản ${selectedAccount?.accountNumber}`,
          4000,
        );
      } else if (transactionType === TRANSACTION_TYPE.WITHDRAW) {
        await createTransactionWithDraw(payload).unwrap();
        showToast(
          TOAST_STATUS.SUCCESS,
          `Rút thành công ${formatCurrency(amount)} từ số tài khoản ${selectedAccount?.accountNumber}`,
          4000,
        );
      } else {
        await createTransactionTransfer(transferPayload).unwrap();
        showToast(
          TOAST_STATUS.SUCCESS,
          `Chuyển thành công ${formatCurrency(amount)} đến số tài khoản ${destinationAccountNumber}`,
          4000,
        );
      }
      if (id) {
        await refetchAccountDetail();
      }
      await refetchAccountList();
      setIsTransactionModalVisible(false);
      transactionForm.resetFields();
    } catch (err) {
      console.log("err", err);
      showToast(TOAST_STATUS.ERROR, SYSTEM_ERROR.SERVER_ERROR);
    }
  };

  const showTransactionModal = (
    type: number,
    account: SetStateAction<BankAccount | undefined>,
  ) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setIsTransactionModalVisible(true);
  };

  const showAccountDetail = (account: { id: any }) => {
    if (account) {
      router.push(`/bank/manage-bank/${account.id}`);
    }
  };

  const generateRandomAccountNumber = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  };

  const handleSearch = (value: SetStateAction<string>) => {
    setSearchQuery(value);
  };

  const handlePageChange = (pagination: TablePaginationConfig) => {
    setPageIndex(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleUserSelect = (value: string) => {
    const user = users?.find((u) => u.id === value);
    setSelectedUser(user);
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      handleSearch(inputValue);
    }
  };

  const handleSetRandomAccountNumber = () => {
    const randomNumber = generateRandomAccountNumber();
    form.setFieldsValue({
      accountNumber: randomNumber,
    });
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalVisible(false);
  };

  return {
    state: {
      pageIndex,
      pageSize,
      selectedUser,
      accounts,
      selectedAccount,
      transactions,
      isTransactionModalVisible,
      transactionType,
      transactionForm,
      form,
      inputValue,
      searchQuery,
      userList,
      isLoadingUserList,
      accountList,
      isLoadingAccountList,
      accountTotalMoney,
      users,
      accountDetail,
      isLoadingAccountDetail,
      transactionList,
      accountListFilter,
      accountListAll: accountListAll?.data ?? [],
    },
    handler: {
      setPageIndex,
      setPageSize,
      setSelectedUser,
      setAccounts,
      setSelectedAccount,
      setTransactions,
      setIsTransactionModalVisible,
      setTransactionType,
      setInputValue,
      setSearchQuery,
      handleDeleteAccount,
      handleCreateAccount,
      handleTransaction,
      showTransactionModal,
      showAccountDetail,
      generateRandomAccountNumber,
      handleSearch,
      handlePageChange,
      refetchAccountList,
      handleUserSelect,
      handleInputChange,
      handleInputKeyDown,
      handleSetRandomAccountNumber,
      handleCloseTransactionModal,
    },
  };
};

export { useBankManagement };
