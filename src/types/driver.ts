import { LatLng, RideStatus } from './passenger';

export type DriverStoredUser = {
  id?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  passengerId?: number | null;
  driverId?: number | null;
  token?: string;
};

export type DriverProfileType = {
  driverId?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string | null;
  carModel?: string | null;
  licenseNumber?: string | null;
  vehiclePlateNumber?: string | null;
  profileImageUrl?: string | null;
};

export type DriverRideHistoryItemType = {
  id: number;
  pickupLocation?: string;
  destination?: string;
  rideType?: string;
  status?: string;
  createdAt?: string;
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
  passengerCount?: number;
  luggageCount?: number;
  passengerId?: number;
  requestedAt?: string | null;
  createdAt?: string | null;
  estimatedTripDurationMinutes?: number | null;
  estimatedPickupMinutes?: number | null;
  distanceToPickupKm?: number | null;
  offerExpiresAt?: string | null;
  fitStatus?: string | null;
  fitWarnings?: string | null;
  copilotMessage?: string | null;
};

export type DriverIncomingOfferType = AvailableRideType & {
  offerId: number;
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
  passengerCount?: number;
  luggageCount?: number;
  passengerId: number;
  passengerName?: string | null;
  requestedAt?: string | null;
  createdAt?: string | null;
  estimatedTripDurationMinutes?: number | null;
  estimatedPickupMinutes?: number | null;
  fitStatus?: string | null;
  fitWarnings?: string | null;
  copilotMessage?: string | null;
  paymentStatus?: string | null;
  paymentAmount?: number | null;
  paymentCurrencyCode?: string | null;
  paymentPaidAtUtc?: string | null;
};

export type DriverNavigationTarget = {
  title: string;
  subtitle: string;
  coords: LatLng | null;
};

export type DriverScreenState =
  | 'offline'
  | 'online_waiting'
  | 'incoming_request'
  | 'en_route_pickup'
  | 'passenger_on_board'
  | 'ride_complete';
