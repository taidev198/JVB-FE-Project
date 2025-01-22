export interface IWallets {
  id: number;
  amount: number;
  walletType: string;
  walletStatus: string;
}

export interface IWalletsRespone {
  code: number;
  messegae: string;
  data: IWallets[];
}
