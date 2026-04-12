import api from './api';
import {
  AiDriverDirectoryItemType,
  AiRideMonitorItemType,
  AvailableDriverMonitorItemType,
  BestDriverResultType,
  DashboardSummaryType,
  PendingRecommendationType,
} from '../types/aiManager';

export async function getAiDashboardSummary(): Promise<DashboardSummaryType> {
  const response = await api.get('/Rides/dashboard-summary');
  return response.data;
}

export async function getAiActiveRides(): Promise<AiRideMonitorItemType[]> {
  const response = await api.get('/Rides/active');
  return Array.isArray(response.data) ? response.data : [];
}

export async function getAiAvailableDrivers(): Promise<AvailableDriverMonitorItemType[]> {
  const response = await api.get('/Rides/available-drivers');
  return Array.isArray(response.data) ? response.data : [];
}

export async function getAiPendingRecommendations(): Promise<PendingRecommendationType[]> {
  const response = await api.get('/Rides/pending-recommendations');
  return Array.isArray(response.data) ? response.data : [];
}

export async function getAiBestDriver(rideId: number): Promise<BestDriverResultType> {
  const response = await api.get(`/Rides/best-driver/${rideId}`);
  return response.data;
}

export async function getAiAllDrivers(): Promise<AiDriverDirectoryItemType[]> {
  const response = await api.get('/Drivers');
  return Array.isArray(response.data) ? response.data : [];
}
