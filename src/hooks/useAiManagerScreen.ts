import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  cancelRideAsManager,
  getAiActiveRides,
  getAiAvailableDrivers,
  getAiBestDriver,
  getAiDashboardSummary,
  getAiPendingRecommendations,
} from '../services/aiManagerService';
import {
  AiManagerStoredUser,
  AiRideMonitorItemType,
  AvailableDriverMonitorItemType,
  BestDriverResultType,
  DashboardSummaryType,
  PendingRecommendationType,
} from '../types/aiManager';

function parseDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getRequestedDate(ride?: {
  requestTime?: string | null;
  requestedAt?: string | null;
  createdAt?: string | null;
} | null) {
  return (
    parseDate(ride?.requestedAt) ??
    parseDate(ride?.createdAt) ??
    parseDate(ride?.requestTime)
  );
}

function getWaitMinutes(ride?: {
  requestTime?: string | null;
  requestedAt?: string | null;
  createdAt?: string | null;
} | null) {
  const requestedDate = getRequestedDate(ride);
  if (!requestedDate) return null;

  return Math.max(0, Math.floor((Date.now() - requestedDate.getTime()) / 60000));
}

export function useAiManagerScreen() {
  const [user, setUser] = useState<AiManagerStoredUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [summary, setSummary] = useState<DashboardSummaryType | null>(null);
  const [activeRides, setActiveRides] = useState<AiRideMonitorItemType[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<
    AvailableDriverMonitorItemType[]
  >([]);
  const [pendingRecommendations, setPendingRecommendations] = useState<
    PendingRecommendationType[]
  >([]);
  const [bestDriver, setBestDriver] = useState<BestDriverResultType | null>(null);
  const [rideId, setRideId] = useState('');
  const [message, setMessage] = useState('');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [isRefreshingDashboard, setIsRefreshingDashboard] = useState(false);
  const [isAnalyzingRide, setIsAnalyzingRide] = useState(false);
  const [cancellingRideId, setCancellingRideId] = useState<number | null>(null);

  const loadUser = async () => {
    try {
      setLoadingUser(true);
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        setNotLoggedIn(true);
        return;
      }

      const parsedUser: AiManagerStoredUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setMessage('');
    } catch (error) {
      console.log('LOAD AI MANAGER USER ERROR:', error);
      setNotLoggedIn(true);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleRefreshDashboard = useCallback(async () => {
    try {
      setIsRefreshingDashboard(true);
      const [summaryData, activeRidesData, availableDriversData, recommendationsData] =
        await Promise.all([
          getAiDashboardSummary(),
          getAiActiveRides(),
          getAiAvailableDrivers(),
          getAiPendingRecommendations(),
        ]);

      setSummary(summaryData);
      setActiveRides(activeRidesData);
      setAvailableDrivers(availableDriversData);
      setPendingRecommendations(recommendationsData);
      setLastUpdatedAt(new Date());
      setMessage('');
    } catch (error: any) {
      console.log(
        'AI DASHBOARD REFRESH ERROR:',
        error?.response?.data || error?.message
      );
      setMessage(error?.response?.data || 'Failed to load AI manager dashboard.');
    } finally {
      setIsRefreshingDashboard(false);
    }
  }, []);

  const handleAnalyzeRide = useCallback(async () => {
    const trimmedRideId = rideId.trim();

    if (!trimmedRideId) {
      setMessage('Enter a ride ID to inspect the recommendation.');
      return;
    }

    const parsedRideId = Number(trimmedRideId);

    if (Number.isNaN(parsedRideId)) {
      setMessage('Ride ID must be a valid number.');
      return;
    }

    try {
      setIsAnalyzingRide(true);
      const data = await getAiBestDriver(parsedRideId);
      setBestDriver(data);
      setMessage('');
    } catch (error: any) {
      console.log('AI BEST DRIVER ERROR:', error?.response?.data || error?.message);
      setBestDriver(null);
      setMessage(error?.response?.data || 'Failed to analyze the selected ride.');
    } finally {
      setIsAnalyzingRide(false);
    }
  }, [rideId]);

  const handleCancelRideAsManager = useCallback(
    async (rideIdToCancel: number, reason: string, note = '') => {
      if (!user?.id) {
        setMessage('Manager account data is missing. Please login again.');
        return false;
      }

      try {
        setCancellingRideId(rideIdToCancel);
        const data = await cancelRideAsManager({
          rideId: rideIdToCancel,
          managerId: user.id,
          reason,
          note,
        });
        setMessage(typeof data === 'string' ? data : 'Ride cancelled by manager.');
        await handleRefreshDashboard();
        return true;
      } catch (error: any) {
        const msg = error?.response?.data || 'Failed to cancel ride.';
        setMessage(msg);
        return false;
      } finally {
        setCancellingRideId(null);
      }
    },
    [handleRefreshDashboard, user?.id]
  );

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    handleRefreshDashboard();
  }, [handleRefreshDashboard]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefreshDashboard();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [handleRefreshDashboard]);

  const activeRideMonitor = useMemo(
    () =>
      activeRides.map((ride) => ({
        ...ride,
        waitMinutes: getWaitMinutes(ride),
      })),
    [activeRides]
  );

  const longestWaitingRide = useMemo(() => {
    return activeRideMonitor.reduce<
      (AiRideMonitorItemType & { waitMinutes: number | null }) | null
    >((currentLongestRide, ride) => {
      if (ride.waitMinutes == null) return currentLongestRide;
      if (!currentLongestRide || (currentLongestRide.waitMinutes ?? -1) < ride.waitMinutes) {
        return ride;
      }

      return currentLongestRide;
    }, null);
  }, [activeRideMonitor]);

  return {
    user,
    loadingUser,
    notLoggedIn,
    summary,
    activeRides: activeRideMonitor,
    availableDrivers,
    pendingRecommendations,
    bestDriver,
    rideId,
    message,
    lastUpdatedAt,
    isRefreshingDashboard,
    isAnalyzingRide,
    cancellingRideId,
    longestWaitingRide,
    setRideId,
    handleRefreshDashboard,
    handleAnalyzeRide,
    handleCancelRideAsManager,
  };
}
