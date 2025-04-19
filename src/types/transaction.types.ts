export interface Transaction {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string | null;
  sourceAccountNumber: string;
  sourceAccountHolder: string;
  destinationAccountNumber: string;
  destinationAccountHolder: string;
  amount: number;
  type: number;
  description: string;
  transactionDate: string;
  status: string;
  transactionDirection: number;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
}

export type TransactionList = Transaction[];
