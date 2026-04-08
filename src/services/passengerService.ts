import api from './api';
import { RideTrackingSnapshot } from '../types/liveTracking';

export async function getPassengerCoinBalance(passengerId: number) {
  const response = await api.get(`/Rides/coins/${passengerId}`);
  return response.data;
}

export async function getPassengerCurrentRide(passengerId: number) {
  const response = await api.get(`/Rides/current/${passengerId}`);
  return response.data;
}

export async function getPassengerPendingFeedbackRide(passengerId: number) {
  const response = await api.get(`/Rides/pending-feedback/${passengerId}`);
  return response.data;
}

export async function createPassengerRide(payload: {
  passengerId: number;
  pickupLocation: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destination: string;
  destinationLatitude: number;
  destinationLongitude: number;
  rideType: string;
  isShared: boolean;
  scheduledTime: string | null;
  passengerCount: number;
  luggageCount: number;
}) {
  const response = await api.post('/Rides', payload);
  return response.data;
}

export async function submitPassengerRideFeedback(payload: {
  rideId: number;
  passengerId: number;
  driverId?: number;
  rating: number;
  wasDriverPolite: boolean;
  wasDriverOnTime: boolean;
  wasVehicleClean: boolean;
  luggageHandlingRating: number | null;
  comment: string;
}) {
  const response = await api.post('/Rides/feedback', payload);
  return response.data;
}

export async function updatePassengerLiveLocation(payload: {
  rideId: number;
  passengerId: number;
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
}) {
  const response = await api.post('/RideTracking/passenger-location', payload);
  return response.data;
}

export async function getPassengerRideTracking(
  rideId: number
): Promise<RideTrackingSnapshot> {
  const response = await api.get(`/RideTracking/passenger/${rideId}`);
  return response.data;
}
