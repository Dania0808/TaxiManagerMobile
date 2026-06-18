import { Region } from 'react-native-maps';

export type StoredUser = {
  id?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  passengerId?: number | null;
  driverId?: number | null;
  token?: string;
};

export type RideType = 'Immediate' | 'Scheduled';

export type RideStatus =
  | 'Pending'
  | 'Accepted'
  | 'OnTheWay'
  | 'PickedUp'
  | 'Completed'
  | 'Cancelled'
  | 'CancelledByPassenger'
  | 'CancelledByDriver'
  | 'CancelledByManager';

export const CANCELLED_RIDE_STATUSES: RideStatus[] = [
  'Cancelled',
  'CancelledByPassenger',
  'CancelledByDriver',
  'CancelledByManager',
];

export function isCancelledRideStatus(status?: string | null) {
  return !!status && CANCELLED_RIDE_STATUSES.includes(status as RideStatus);
}

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type CurrentRideType = {
  id?: number;
  pickupLocation?: string;
  destination?: string;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
  rideType?: string;
  status?: RideStatus | string;
  isShared?: boolean;
  driverId?: number | null;
  driverName?: string | null;
  carModel?: string | null;
  profileImageUrl?: string | null;
};

export type PendingFeedbackRideType = {
  id: number;
  pickupLocation?: string;
  destination?: string;
  driverId?: number;
};

export type RideSummary = {
  from: string;
  to: string;
  rideType: RideType;
  passengers: string;
  luggage: string;
  shared: string;
  scheduledTime: string;
};

export type OrderPlacedRideType = {
  rideSummary: RideSummary;
  rideId?: number;
  status?: string;
};

export type PassengerProfileType = {
  passengerId?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string | null;
  profileImageUrl?: string | null;
};

export type PassengerRideHistoryItemType = {
  id: number;
  pickupLocation?: string;
  destination?: string;
  rideType?: string;
  status?: string;
  createdAt?: string;
};

export type PlaceSuggestion = {
  placeId: string;
  primaryText: string;
  secondaryText: string;
};

export const INITIAL_REGION: Region = {
  latitude: 32.0853,
  longitude: 34.7818,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
