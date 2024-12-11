interface Ward {
  id: number;
  wardName: string;
}

export interface WardResponse {
  code: number;
  message: string;
  data: Ward[];
}

interface District {
  id: number;
  districtName: string;
}

export interface DistrictsResponse {
  code: number;
  message: string;
  data: District[];
}

interface Province {
  id: number;
  provinceName: string;
}

export interface ProvinceResponse {
  code: number;
  message: string;
  data: Province[];
}

export interface IAddress {
  houseNumber: string;
  ward: Ward;
  district: District;
  province: Province;
}
