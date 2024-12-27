// types/workshop.ts

import { IUniversity } from './university';
import { IAddress } from './addressesTypes';
import { JobWork } from './workShopCompany';
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
  workshop: JobWork;
}

export interface IWorkshopPortal {
  id: number;
  workshopTitle: string;
  workshopDescription: string;
  startTime: string;
  endTime: string;
  estimateCompanyParticipants: number;
  agenda: string;
  moderationStatus: string;
  imageWorkshops: string;
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

export interface WorkshopResponseCompany {
  code: number;
  message: string;
  data: {
    content: {
      id: number;
      status: string;
      createAt: string;
      updateAt: string;
      createBy: string;
      updateBy: string;
      workshop: IWorkshop;
    }[];
    totalPages: number;
    totalElements: number;
    pageSize: number;
    currentPage: number;
  };
}

export interface WorkshopResponsePortal {
  code: number;
  message: string;
  data: {
    content: IWorkshopPortal[];
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

// ---------------------company--------------------
