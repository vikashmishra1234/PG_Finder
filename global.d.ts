export interface PublicPg {
  pgId?:string;

  // Basic Info
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  // PG Details
  roomsCount: number;
  availableBeds: number;
  genderType: "MALE" | "FEMALE" | "UNISEX";
  roomType: "SINGLE" | "DOUBLE" | "TRIPLE" | "DORMITORY";

  // Pricing
  rent: number;
  securityFee: number|null;
  maintenanceFee: number|null;

  // Facilities
  foodAvailable: boolean;
  wifiAvailable: boolean;
  parkingAvailable: boolean;
  laundryAvailable: boolean;
  acAvailable: boolean;

  // Owner Details
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string|null;

  // Media
  images: string[];

  // Status
  isAvailable: boolean;
  isVerified: boolean;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}



export interface ActionResponse<T>{
  success:boolean,
  data?:T,
  // status:number,
  message:string
}


export interface IUser {
  userId: string;

  name: string;
  email: string;
  password: string;

  isDeleted?: boolean;
  isActive?: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  roles?: IRole[];

  pgs?: IPG[];
}

export interface IRole {
  roleId?: string;

  name: string;
}


export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  isPgOwner:boolean;
  roleIds?: string[] ;
}
export interface loginUserDTO {
  email: string;
  password: string;

}

export interface PublicComplaint {
  complaintId?: string;
  userId: string;
  pgId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    name: string;
    email: string;
  };
  pg?: {
    title: string;
  };
}

export interface PublicPayment {
  paymentId?: string;
  userId: string;
  pgId: string;
  amount: number;
  month: string;
  status: string;
  transactionId?: string | null;
  paymentMethod?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    name: string;
    email: string;
  };
  pg?: {
    title: string;
  };
}
