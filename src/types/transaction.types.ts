export interface Transaction {
  sourceAccountId: string;
  destinationAccountId: string | null;
  amount: number;
  type: number;
  description: string;
  transactionDate: string;
  status: string;
  id: string;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
}

export type TransactionList = Transaction[];
