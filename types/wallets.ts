/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IWallets {
  id: number;
  amount: number;
  walletType: string;
  walletStatus: string;
}

export interface IWalletsResponse {
  code: number;
  message: string;
  data: IWallets[];
}

export interface ITransaction {
  id: number;
  amount: number;
  transactionCode: string | null;
  description: string | null;
  payDate: any;
  paymentType: string;
}

export interface ITransactionAllResponse {
  code: number;
  message: string;
  data: {
    content: ITransaction[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}
