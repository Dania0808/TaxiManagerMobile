export type AiManagerStoredUser = {
  id?: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  passengerId?: number | null;
  driverId?: number | null;
  token?: string;
};

export type DashboardSummaryType = {
  activeRidesCount?: number;
  pendingRidesCount?: number;
  availableDriversCount?: number;
  completedRidesTodayCount?: number;
  cancelledRidesTodayCount?: number;
  driversOnlineCount?: number;
  driversBusyCount?: number;
  unassignedPendingRidesCount?: number;
  averagePickupEtaMinutes?: number | null;
};

export type AiRideMonitorItemType = {
  id: number;
  status?: string;
  pickupLocation?: string;
  destination?: string;
  rideType?: string;
  isShared?: boolean;
  passengerId?: number | null;
  passengerName?: string | null;
  driverId?: number | null;
  driverName?: string | null;
  requestTime?: string | null;
  requestedAt?: string | null;
  createdAt?: string | null;
  scheduledTime?: string | null;
  estimatedTripDurationMinutes?: number | null;
  estimatedPickupMinutes?: number | null;
};

export type AvailableDriverMonitorItemType = {
  driverId?: number;
  id?: number;
  driverName?: string | null;
  fullName?: string | null;
  phoneNumber?: string | null;
  carModel?: string | null;
  vehiclePlateNumber?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isOnline?: boolean;
  currentRideId?: number | null;
  rating?: number | null;
  recordedAtUtc?: string | null;
};

export type AiDriverDirectoryItemType = {
  driverId?: number;
  id?: number;
  driverName?: string | null;
  fullName?: string | null;
  carModel?: string | null;
  carType?: string | null;
  vehiclePlateNumber?: string | null;
  rating?: number | null;
  score?: number | null;
  profileImageUrl?: string | null;
};

export type PendingRecommendationType = {
  rideId: number;
  passengerId?: number | null;
  pickupLocation?: string | null;
  destination?: string | null;
  rideType?: string | null;
  isShared?: boolean;
  rideStatus?: string | null;
  recommendedDriverId?: number | null;
  recommendedDriverName?: string | null;
  averageRating?: number | null;
  score?: number | null;
  reason?: string | null;
  explanation?: string | null;
};

export type BestDriverResultType = {
  rideId?: number | null;
  driverId?: number | null;
  driverName?: string | null;
  completedRides?: number | null;
  averageRating?: number | null;
  politeCount?: number | null;
  onTimeCount?: number | null;
  cleanVehicleCount?: number | null;
  score?: number | null;
  reason?: string | null;
  explanation?: string | null;
};
