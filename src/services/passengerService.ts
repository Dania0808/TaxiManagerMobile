import { RideTrackingSnapshot } from '../types/liveTracking';
import api from './api';

export async function getPassengerCoinBalance(passengerId: number) {
  const response = await api.get(`/Rides/coins/${passengerId}`);
  return response.data;
}

export async function getPassengerCurrentRide(passengerId: number) {
  try {
    const response = await api.get(`/Rides/current/${passengerId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 204 || error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
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
  passengerId: number;
  latitude: number;
  longitude: number;
}) {
  const response = await api.post('/RideTracking/location', {
    actorId: payload.passengerId,
    actorType: 'Passenger',
    latitude: payload.latitude,
    longitude: payload.longitude,
  });
  return response.data;
}

export async function getPassengerRideTracking(
  rideId: number
): Promise<RideTrackingSnapshot> {
  const response = await api.get(`/RideTracking/passenger/${rideId}`);
  return response.data;
}

export async function getPassengerProfile(passengerId: number) {
  const response = await api.get(`/Passengers/${passengerId}`);
  return response.data;
}

export async function getPassengerRideHistory(passengerId: number) {
  const response = await api.get(`/Rides/history/${passengerId}`);
  return response.data;
}

export async function updatePassengerProfile(
  passengerId: number,
  payload: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  }
) {
  const response = await api.put(`/Passengers/${passengerId}`, payload);
  return response.data;
}

export async function uploadPassengerProfileImage(
  passengerId: number,
  imageFile: {
    uri: string;
    name: string;
    type: string;
  }
) {
  const formData = new FormData();
  formData.append('file', imageFile as any);

  const response = await api.post(`/Passengers/${passengerId}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
