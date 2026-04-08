import api from './api';
import { RideTrackingSnapshot } from '../types/liveTracking';

export async function getAvailableRides() {
  const response = await api.get('/Rides/available');
  return response.data;
}

export async function acceptRide(payload: {
  rideId: number;
  driverId: number;
}) {
  const response = await api.put('/Rides/accept', payload);
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

export async function updateDriverLiveLocation(payload: {
  rideId: number;
  driverId: number;
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
}) {
  const response = await api.post('/RideTracking/driver-location', payload);
  return response.data;
}

export async function getDriverRideTracking(
  rideId: number
): Promise<RideTrackingSnapshot> {
  const response = await api.get(`/RideTracking/driver/${rideId}`);
  return response.data;
}
