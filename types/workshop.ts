import { IUniversity } from './university';
import { IAddress } from './addressesTypes';
import { IFields } from './index';

export interface ImageWorkshops {
  id: number;
  imageUrl: string;
}

export interface IWorkshop {
  id: number;
  workshopTitle: string;
  workshopDescription: string;
  startTime: string;
  endTime: string;
  estimateCompanyParticipants: number;
  agenda: string;
  moderationStatus: string;
  imageWorkshops: ImageWorkshops[];
  address: IAddress;
  university: IUniversity;
  fields: IFields[];
  createAt: string;
  updateAt: string;
  isDelete: false;
  workshopStatus: string;
}

export interface WorkshopResponse {
  code: number;
  message: string;
  data: {
    content: IWorkshop[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface WorkshopDetailResponse {
  code: number;
  message: string;
  data: IWorkshop;
}
