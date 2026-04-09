import { StyleSheet } from 'react-native';

export const passengerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },

  mainContent: {
    flex: 1,
    backgroundColor: '#f3f4f6',
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
    backgroundColor: '#f3f4f6',
  },

  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#e5e7eb',
  },

  formContainer: {
    flex: 1,
    marginTop: -76,
    paddingHorizontal: 16,
    paddingBottom: 96,
    backgroundColor: '#f3f4f6',
  },

  floatingFormContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 48,
  },

  floatingFormCard: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
    maxHeight: '82%',
    overflow: 'hidden',
  },

  floatingFormHeader: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  floatingHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: 12,
  },

  floatingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  floatingFormTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 3,
  },

  floatingFormSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },

  floatingFormScroll: {
    maxHeight: '100%',
  },

  floatingFormScrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 8,
  },

  collapsedFormSummary: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  collapsedFormText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },

  schedulePreviewCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#f9fafb',
    marginBottom: 10,
  },

  schedulePreviewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  schedulePreviewValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },

  modalSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
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
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },

  coinsBadge: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  coinsText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#ffffff',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  formCard: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: '#ffffff',
  },

  formHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  formHeaderIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  formHeaderTextWrap: {
    flex: 1,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },

  formSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 0,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardTitleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
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
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    backgroundColor: '#e5e7eb',
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
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  mapOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mapOverlayIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  mapOverlayTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  mapOverlaySubtitle: {
    marginTop: 8,
    fontSize: 12,
    color: '#4b5563',
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    color: '#111827',
  },

  searchLoader: {
    marginBottom: 10,
  },

  suggestionsBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
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
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },

  segmentButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
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
    borderRadius: 14,
    padding: 12,
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
    backgroundColor: '#111827',
    paddingVertical: 15,
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
    borderColor: '#d1d5db',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },

  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 16,
  },

  statusBanner: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },

  statusTitle: {
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },

  driverCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
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
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#fcfcfc',
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
    color: '#1d4ed8',
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
    borderRadius: 22,
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
    borderColor: '#e5e7eb',
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 64,
  },

  orderPlacedIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
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

  bottomSheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17,24,39,0.28)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  bottomSheet: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    flex: 1,
  },

  bottomSheetContent: {
    flex: 1,
    justifyContent: 'center',
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

  bottomBackHint: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },

  bottomBackRow: {
    marginTop: 14,
    alignItems: 'flex-start',
  },

  bottomBackButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  bottomMapWrapper: {
    marginBottom: 14,
    marginTop: 4,
    marginHorizontal: -18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
  },

  bottomMap: {
    width: '100%',
    height: 300,
  },

  trackingMap: {
    width: '100%',
    height: 320,
    borderRadius: 16,
    marginBottom: 14,
  },

  linkButton: {
    color: '#111827',
    fontWeight: '700',
  },
});
