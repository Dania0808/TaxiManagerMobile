import api from './api';
import { NotificationHistoryItem } from '../types/notification';

export async function getNotificationHistory(): Promise<NotificationHistoryItem[]> {
  const response = await api.get<NotificationHistoryItem[]>('/Notifications/history');
  return response.data;
}
