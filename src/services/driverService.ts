import api from './api';
import {
  DriverIncomingOfferType,
  DriverProfileType,
  DriverRideHistoryItemType,
} from '../types/driver';
import { RideTrackingSnapshot } from '../types/liveTracking';

export async function updateDriverAvailability(payload: {
  driverId: number;
  isOnline: boolean;
}) {
  const response = await api.post('/dispatch/availability', payload);
  return response.data;
}

export async function getCurrentDriverOffer(
  driverId: number
): Promise<DriverIncomingOfferType | null> {
  try {
    const response = await api.get(`/dispatch/offers/current/${driverId}`);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 204 || error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function acceptDriverOffer(offerId: number) {
  const response = await api.post(`/dispatch/offers/${offerId}/accept`);
  return response.data;
}

export async function declineDriverOffer(offerId: number) {
  const response = await api.post(`/dispatch/offers/${offerId}/decline`);
  return response.data;
}

export async function getOpenRideRequests() {
  const response = await api.get('/dispatch/open-requests');
  return response.data;
}

export async function claimOpenRideRequest(rideId: number, driverId: number) {
  const response = await api.post(
    `/dispatch/open-requests/${rideId}/claim?driverId=${driverId}`
  );
  return response.data;
}

export async function updateActorLiveLocation(payload: {
  actorId: number;
  actorType: 'Driver' | 'Passenger';
  latitude: number;
  longitude: number;
}) {
  const response = await api.post('/RideTracking/location', payload);
  return response.data;
}

export async function getDriverCurrentRide(driverId: number) {
  const response = await api.get(`/Rides/driver-current/${driverId}`);
  return response.data;
}

export async function updateDriverRideStatus(payload: {
  rideId: number;
  status: string;
}) {
  const response = await api.put('/Rides/status', payload);
  return response.data;
}

export async function getDriverRideTracking(
  rideId: number
): Promise<RideTrackingSnapshot> {
  const response = await api.get(`/RideTracking/driver/${rideId}`);
  return response.data;
}

export async function getDriverProfile(driverId: number): Promise<DriverProfileType> {
  const response = await api.get(`/Drivers/${driverId}`);
  return response.data;
}

export async function updateDriverProfile(
  driverId: number,
  payload: {
    phoneNumber?: string;
    carModel?: string;
    licenseNumber?: string;
    vehiclePlateNumber?: string;
  }
) {
  const response = await api.put(`/Drivers/${driverId}`, payload);
  return response.data;
}

export async function uploadDriverProfileImage(
  driverId: number,
  imageFile: {
    uri: string;
    name: string;
    type: string;
  }
) {
  const formData = new FormData();
  formData.append('file', imageFile as any);

  const response = await api.post(`/Drivers/${driverId}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function getDriverRideHistory(
  driverId: number
): Promise<DriverRideHistoryItemType[]> {
  const response = await api.get(`/Rides/driver-history/${driverId}`);
  return response.data;
}
