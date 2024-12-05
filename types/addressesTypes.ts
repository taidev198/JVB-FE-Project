interface Ward {
  id: number;
  wardName: string;
}

interface District {
  id: number;
  districtName: string;
}

interface Province {
  id: number;
  provinceName: string;
}

export interface Address {
  houseNumber: string;
  ward: Ward;
  district: District;
  province: Province;
}
