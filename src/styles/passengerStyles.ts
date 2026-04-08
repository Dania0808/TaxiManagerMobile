import { StyleSheet } from 'react-native';

export const passengerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  mainContent: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  contentWithBottomSheet: {
    paddingBottom: 320,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#dbeafe',
  },

  formContainer: {
    flex: 1,
    marginTop: -12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#f5f7fb',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  headerTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },

  coinsBadge: {
    borderWidth: 1,
    borderColor: '#dbe3f0',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    minWidth: 95,
    backgroundColor: '#ffffff',
  },

  coinsEmoji: {
    fontSize: 22,
  },

  coinsLabel: {
    fontSize: 12,
    color: '#666',
  },

  coinsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },

  coinsOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#dbe3f0',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },

  coinsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#ffffff',
    marginBottom: 14,
  },

  formCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  formSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 14,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },

  map: {
    width: '100%',
    height: 260,
    borderRadius: 14,
    marginTop: 10,
  },

  mapHeroCard: {
    flex: 1,
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#dbeafe',
  },

  mapHero: {
    width: '100%',
    height: '100%',
  },

  mapOverlayInfo: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  mapOverlayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  mapOverlaySubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#4b5563',
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },

  searchLoader: {
    marginBottom: 10,
  },

  suggestionsBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    overflow: 'hidden',
  },

  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  suggestionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#6b7280',
  },

  inlineInputs: {
    flexDirection: 'row',
    gap: 10,
  },

  inlineInputBox: {
    flex: 1,
  },

  inputLabel: {
    fontSize: 13,
    marginBottom: 6,
    color: '#444',
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },

  helperText: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 8,
  },

  rideTypeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  rideTypeButton: {
    flex: 1,
  },

  segmentButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  segmentButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  segmentButtonText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 14,
  },

  segmentButtonTextActive: {
    color: '#ffffff',
  },

  sharedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sharedTextWrap: {
    flex: 1,
    marginRight: 12,
  },

  sharedInfoBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#f9fafb',
  },

  sharedInfoTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },

  orderButtonWrap: {
    marginTop: 12,
  },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 16,
  },

  statusBanner: {
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },

  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },

  driverCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fcfcfc',
  },

  driverImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 12,
  },

  driverDetails: {
    flex: 1,
  },

  driverCardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#111827',
  },

  rideDetailsBox: {
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 12,
    padding: 10,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },

  bold: {
    fontWeight: 'bold',
  },

  message: {
    marginTop: 10,
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '600',
    paddingHorizontal: 16,
  },

  searchingBox: {
    position: 'absolute',
    top: '42%',
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },

  searchingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  orderPlacedCard: {
    borderWidth: 1,
    borderColor: '#dbe3f0',
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  orderPlacedIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
    marginBottom: 14,
  },

  orderPlacedIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#166534',
  },

  orderPlacedTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },

  orderPlacedSubtitle: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 16,
  },

  orderPlacedBanner: {
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#f0fdf4',
    marginBottom: 14,
  },

  orderPlacedBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },

  orderPlacedActions: {
    gap: 10,
    marginTop: 14,
  },

  bottomSheet: {
    position: 'absolute',
    bottom: 20,
    left: 12,
    right: 12,
    backgroundColor: '#ffffff',
    padding: 18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderWidth: 1,
    borderColor: '#dbe3f0',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },

  bottomTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
    textAlign: 'center',
  },

  bottomSheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },

  bottomLabel: {
    fontWeight: '700',
    color: '#374151',
    minWidth: 80,
  },

  bottomValue: {
    flex: 1,
    textAlign: 'right',
    color: '#111827',
  },

  bottomButtonWrap: {
    marginTop: 14,
  },

  bottomMapWrapper: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
  },

  bottomMap: {
    width: '100%',
    height: 150,
  },

  trackingMap: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    marginBottom: 14,
  },

  linkButton: {
    color: '#2563eb',
    fontWeight: '700',
  },

});
