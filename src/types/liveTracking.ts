import { LatLng, RideStatus, RideType } from './passenger';

export type LiveLocationPoint = {
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  recordedAt?: string;
};

export type RideTrackingSnapshot = {
  rideId: number;
  status: RideStatus | string;
  rideType?: RideType | string;
  pickupLocation?: string;
  destination?: string;
  pickupCoords?: LatLng | null;
  destinationCoords?: LatLng | null;
  passengerLocation?: LiveLocationPoint | null;
  driverLocation?: LiveLocationPoint | null;
  driverName?: string | null;
  carModel?: string | null;
  lastUpdatedAt?: string;
};
