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
