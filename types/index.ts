export type ApartmentStatus = 'EMPTY' | 'RENTED' | 'OWNER_OCCUPIED' | 'REPAIRING';
export type ResidentStatus = 'PERMANENT' | 'TEMPORARY' | 'ABSENT' | 'MOVED';
export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';
export type VehicleType = 'CAR' | 'MOTORBIKE' | 'ELECTRIC_BIKE' | 'BICYCLE';
export type FeedbackCategory = 'NOISE' | 'REPAIR' | 'CLEANING' | 'SECURITY' | 'SERVICE';
export type FeedbackStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Resident {
  id: string;
  fullName: string;
  citizenId: string;
  dateOfBirth: string;
  gender: 'Nam' | 'Nữ';
  phone: string;
  email?: string;
  apartmentId: string;
  roomNumber: string;
  relationship: string;
  residentStatus: ResidentStatus;
  isHead: boolean;
  avatarUrl?: string;
  moveInDate: string;
}

export interface Household {
  id: string;
  householdCode: string;
  apartmentId: string;
  roomNumber: string;
  building: string;
  floor: number;
  headResidentId: string;
  headName: string;
  headPhone: string;
  headCitizenId: string;
  headAvatarUrl?: string;
  memberCount: number;
  vehicleCount: number;
  status: 'ACTIVE' | 'MOVED_OUT';
  residenceType: 'Thường trú' | 'Tạm trú';
  registrationDate: string;
}

export interface Vehicle {
  id: string;
  apartmentId: string;
  roomNumber: string;
  residentName: string;
  licensePlate: string;
  vehicleType: VehicleType;
  parkingSlot?: string;
  brand?: string;
  registeredDate: string;
  status: 'ACTIVE' | 'EXPIRED';
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  apartmentId: string;
  roomNumber: string;
  householdId: string;
  householdHead: string;
  billingMonth: string;
  managementFee: number;
  waterFee: number;
  electricityFee: number;
  vehicleFee: number;
  totalAmount: number;
  paidAmount?: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentMethod?: string;
  paymentDate?: string;
}

export interface Feedback {
  id: string;
  apartmentId: string;
  roomNumber: string;
  residentName: string;
  title: string;
  content?: string;
  category: FeedbackCategory;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: FeedbackStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  id: string;
  building: string;
  roomNumber: string;
  floor: number;
  area: number;
  status: ApartmentStatus;
  roomType: string;
  direction: string;
  ownerName: string;
  ownerPhone: string;
  ownerCitizenId: string;
  handoverDate: string;
  household?: Household;
  residents: Resident[];
  vehicles: Vehicle[];
  invoices: Invoice[];
  feeStatus: InvoiceStatus;
}
