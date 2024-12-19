// types/workshop.ts

import { IAddress } from "./addressesTypes";
import { IImg } from "./imgWorkShopType";
import { IUniversity } from "./university";

export interface JobWork {
  id: number;
  workshopTitle: string;
  workshopDescription: string;
  startTime: string;
  endTime: string;
  estimateCompanyParticipants: number;
  agenda: string;
  moderationStatus: string;
  university: IUniversity,
  address: IAddress;
  imageWorkshops: IImg;
}


// ---------------------company--------------------
