/* eslint-disable @typescript-eslint/no-explicit-any */
interface IOwner {
  createBy: number;
  updateBy: number;
  createAt: string;
  updateAt: string;
  id: number;
  email: string;
  password: string;
  totalAmount: number;
  role: {
    id: number;
    roleName: string;
  };
  statusAccount: string;
}

interface IMember {
  createBy: number;
  updateBy: number;
  createAt: string;
  updateAt: string;
  id: number;
  email: string;
  password: string;
  totalAmount: number;
  role: {
    id: number;
    roleName: string;
  };
  statusAccount: string;
}

interface IUserChat {
  createBy: number;
  updateBy: number;
  createAt: string;
  updateAt: string;
  id: number;
  email: string;
  password: string;
  totalAmount: string;
  role: {
    id: number;
    roleName: string;
  };
  statusAccount: string;
}

interface ChatItem {
  id: number;
  sender: IUserChat;
  receiver: IUserChat;
  chatRoomId: number;
  content: string;
  type: string;
  referChat: any;
  isDeleted: boolean;
  isRead: boolean;
  createAt: string;
  updateAt: string;
}

export interface chatRoomResponse {
  code: number;
  message: string;
  data: {
    content: {
      id: number;
      isDeleted: boolean;
      owner: IOwner;
      ownerName: string;
      member: IMember;
      memberName: string;
      lastMessage: ChatItem;
    }[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface ChatResponse {
  code: number;
  message: string;
  data: {
    content: ChatItem[];
  };
  totalPages: number;
  totalElements: number;
  pageSize: number;
  currentPage: number;
}

export interface CheckChatResponse {
  code: number;
  message: string;
  data: {
    id: number;
    isDeleted: boolean;
    owner: IOwner;
    ownerName: string;
    member: IMember;
    memberName: string;
  };
}
