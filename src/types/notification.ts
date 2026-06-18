export type NotificationHistoryItem = {
  id: number;
  title: string;
  body: string;
  target?: string | null;
  event?: string | null;
  createdAtUtc: string;
};
