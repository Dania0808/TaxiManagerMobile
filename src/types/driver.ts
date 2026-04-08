import { LatLng, RideStatus } from './passenger';

export type DriverStoredUser = {
  id?: number;
  fullName?: string;
  email?: string;
  role?: string;
  passengerId?: number | null;
  driverId?: number | null;
  token?: string;
};

export type AvailableRideType = {
  id: number;
  pickupLocation: string;
  destination: string;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  rideType: string;
  isShared: boolean;
  passengerId?: number;
};

export type DriverCurrentRideType = {
  id: number;
  pickupLocation: string;
  destination: string;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  rideType: string;
  status: RideStatus | string;
  isShared: boolean;
  passengerId: number;
  passengerName?: string | null;
};

export type DriverNavigationTarget = {
  title: string;
  subtitle: string;
  coords: LatLng | null;
};
