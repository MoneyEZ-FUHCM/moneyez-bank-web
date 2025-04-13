export interface BankAccount {
  id: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  userId: string;
}

export type BankAccountList = BankAccount[];
