import { StyleSheet } from 'react-native';

export const passengerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f7f3',
  },

  mainContent: {
    flex: 1,
    backgroundColor: '#f8f7f3',
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
    backgroundColor: '#f8f7f3',
  },

  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#e5e7eb',
  },

  passengerScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },

  mapSection: {
    height: 280,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  mapSectionPlanning: {
    height: 360,
  },

  sectionSpacing: {
    marginBottom: 14,
  },

  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  backButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },

  formContainer: {
    flex: 1,
    marginTop: -76,
    paddingHorizontal: 16,
    paddingBottom: 120,
    backgroundColor: '#f3f4f6',
  },

  floatingFormContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
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
    maxHeight: '78%',
    overflow: 'hidden',
  },

  floatingFormHeader: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
  },

  rideComposerContainer: {
    marginBottom: 14,
  },


  rideComposerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  rideComposerTextWrap: {
    flex: 1,
    marginRight: 12,
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

  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    flexDirection: 'column',
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
    backgroundColor: '#fef3c7',
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

  bookingHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },

  bookingHeroTextWrap: {
    flex: 1,
  },

  bookingHeroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },

  bookingHeroSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#6b7280',
  },

  bookingHeroBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fde68a',
  },


  routeBuilderCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 22,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },

  routeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 68,
  },

  routeInputDivider: {
    height: 1,
    backgroundColor: '#eceff3',
    marginLeft: 20,
  },

  routeIconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  routeIconDotPickup: {
    backgroundColor: '#16a34a',
  },

  routeIconDotDestination: {
    backgroundColor: '#dc2626',
  },

  routeInputTextWrap: {
    flex: 1,
  },

  routeInputLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },

  routeInput: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 0,
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
    borderRadius: 28,
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
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.88)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  mapOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mapOverlayTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  mapOverlayIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  mapOverlayTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  mapOverlayBadge: {
    borderRadius: 999,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  mapOverlayBadgeText: {
    color: '#92400e',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  mapOverlaySubtitle: {
    marginTop: 8,
    fontSize: 12,
    color: '#4b5563',
  },

  mapOverlayMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },

  mapOverlayMetaPill: {
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  mapOverlayMetaText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '700',
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#fbfbfa',
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
    flexDirection: 'column',
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
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },

  helperText: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 8,
  },

  rideTypeButtons: {
    flexDirection: 'column',
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
    backgroundColor: '#fbfbfa',
    borderRadius: 16,
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

  segmentButtonHint: {
    marginTop: 4,
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
  },

  segmentButtonHintActive: {
    color: '#e5e7eb',
  },


  tripOptionsCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    backgroundColor: '#fbfbfa',
    padding: 14,
    marginTop: 4,
  },

  quickOptionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  quickOptionTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  quickOptionLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },

  quickOptionInput: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    paddingVertical: 0,
  },

  sharedRideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  sharedRideTextWrap: {
    flex: 1,
  },

  sharedRideTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },

  sharedRideSubtitle: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 18,
  },

  sharedRow: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  sharedTextWrap: {
    width: '100%',
    marginRight: 0,
    marginBottom: 8,
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
    gap: 12,
  },

  primaryButton: {
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderRadius: 16,
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
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#fbfbfa',
  },

  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 16,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  secondaryButtonDisabled: {
    opacity: 0.6,
  },

  statusBanner: {
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 18,
    padding: 13,
    backgroundColor: '#fff8db',
    marginBottom: 12,
  },

  statusTitle: {
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },

  statusBannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },

  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fffdf5',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },

  statusBadgeText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  statusNextStepText: {
    marginTop: 4,
    color: '#1f2937',
    fontSize: 13,
    fontWeight: '700',
  },

  driverCard: {
    flexDirection: 'column',
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
    marginRight: 0,
    marginBottom: 12,
    alignSelf: 'center',
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

  driverSupportPill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#eff6ff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  driverSupportPillText: {
    color: '#1e3a8a',
    fontSize: 12,
    fontWeight: '700',
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

  searchingHelperText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },

  inlineBanner: {
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  infoBanner: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },

  successBanner: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },

  globalBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#1f2937',
    marginBottom: 4,
  },

  globalBannerText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#111827',
    fontWeight: '600',
  },

  orderPlacedCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginBottom: 64,
  },

  orderPlacedIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
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
    borderColor: '#fde68a',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#fff8db',
    marginBottom: 14,
  },

  orderPlacedBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },

  orderPlacedBannerText: {
    color: '#92400e',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
    fontWeight: '600',
  },

  orderPlacedActions: {
    gap: 10,
    marginTop: 14,
  },

  passengerProgressWrap: {
    gap: 10,
    marginBottom: 16,
  },

  passengerProgressDividerActive: {
    backgroundColor: '#111827',
  },

  passengerProgressCaption: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  pendingTrackingHint: {
    borderWidth: 1,
    borderColor: '#fde68a',
    backgroundColor: '#fff8db',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  pendingTrackingHintText: {
    flex: 1,
    color: '#6b4f12',
    fontSize: 13,
    fontWeight: '700',
  },

  passengerProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  passengerProgressStep: {
    alignItems: 'center',
    minWidth: 68,
  },

  passengerProgressDivider: {
    flex: 1,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 6,
  },

  passengerProgressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
    marginBottom: 6,
  },

  passengerProgressDotActive: {
    backgroundColor: '#d97706',
  },

  passengerProgressLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  passengerProgressLabelActive: {
    fontSize: 11,
    color: '#b45309',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
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
    paddingTop: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    maxHeight: '92%',
  },

  bottomSheetHeader: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  bottomSheetBackAction: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 4,
  },

  bottomSheetBackActionText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },

  bottomSheetTitleWrap: {
    paddingTop: 2,
  },

  bottomSheetSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 19,
    textAlign: 'center',
  },

  bottomSheetScroll: {
    flexGrow: 0,
  },

  bottomSheetContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    justifyContent: 'flex-start',
  },

  bottomTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
    textAlign: 'center',
  },

  bottomSummaryBanner: {
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  bottomSummaryTitle: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },

  bottomSummaryText: {
    color: '#1f2937',
    fontSize: 13,
    lineHeight: 19,
  },

  bottomFareCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
    backgroundColor: '#fffdf5',
    borderRadius: 20,
    padding: 14,
  },

  bottomFareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  bottomFareIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  bottomFareTextWrap: {
    flex: 1,
  },

  bottomFareTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },

  bottomFareSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },

  bottomFareStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  bottomFareStatCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f3e8b3',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  bottomFareStatLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a16207',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },

  bottomFareStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  bottomFareTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f3e8b3',
    paddingTop: 12,
  },

  bottomFareTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  bottomFareTotalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },

  bottomSheetRow: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 4,
  },

  bottomLabel: {
    fontWeight: '700',
    color: '#374151',
    minWidth: 80,
  },

  bottomValue: {
    width: '100%',
    textAlign: 'left',
    color: '#111827',
  },

  bottomButtonWrap: {
    marginTop: 14,
  },

  bottomFooter: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 10,
  },

  bottomPrimaryAction: {
    marginTop: 0,
  },

  bottomSecondaryAction: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },

  bottomSecondaryActionText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 15,
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

  completionModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.36)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  completionModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: '92%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },

  completionModalHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
  },

  completionModalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    marginBottom: 14,
  },

  completionModalIcon: {
    color: '#166534',
    fontSize: 28,
    fontWeight: '800',
  },

  completionModalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },

  completionModalSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 4,
  },

  completionModalActionArea: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },

  feedbackHeroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 22,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  feedbackHeroIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fefce8',
    marginBottom: 14,
  },

  paymentHeroIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    marginBottom: 14,
  },

  feedbackHeroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },

  feedbackHeroSubtitle: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  feedbackTripSummary: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#f9fafb',
    marginBottom: 14,
  },

  feedbackTripRowLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },

  feedbackTripRowValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },

  feedbackTripRowArrow: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    marginVertical: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  feedbackSectionTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 10,
  },

  feedbackChoiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  feedbackChip: {
    minWidth: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  feedbackChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },

  feedbackChipText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },

  feedbackChipTextActive: {
    color: '#ffffff',
  },

  feedbackSwitchLabel: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },

  feedbackCommentInput: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 14,
  },

  paymentBreakdownCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#f9fafb',
    marginBottom: 14,
    gap: 10,
  },

  paymentBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  paymentBreakdownLabel: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
  },

  paymentBreakdownValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },

  paymentBreakdownDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },

  paymentTotalLabel: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },

  paymentTotalValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },

  paymentActionsWrap: {
    gap: 14,
    marginTop: 4,
  },

  paymentHeaderCard: {
    backgroundColor: '#fffdf7',
    borderRadius: 28,
    padding: 22,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f3e3a1',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  paymentHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  paymentHeaderEyebrow: {
    color: '#a16207',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },

  paymentHeaderTitle: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
  },

  paymentHeaderSubtitle: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  paymentHeaderIconBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fde68a',
  },

  paymentQuickStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  paymentQuickStatCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3e3a1',
    borderRadius: 18,
    padding: 14,
  },

  paymentQuickStatLabel: {
    color: '#a16207',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  paymentQuickStatValue: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
  },

  paymentQuickStatHint: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 5,
  },

  paymentSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  paymentRideRoute: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    backgroundColor: '#fcfcfb',
    padding: 14,
    marginTop: 12,
    marginBottom: 14,
    gap: 12,
  },

  paymentRouteLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  paymentRouteValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },

  paymentRouteStopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  paymentRouteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 16,
  },

  paymentRouteDotPickup: {
    backgroundColor: '#16a34a',
  },

  paymentRouteDotDestination: {
    backgroundColor: '#dc2626',
  },

  paymentRouteTextWrap: {
    flex: 1,
  },

  paymentRouteDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#d1d5db',
    marginLeft: 5,
  },

  paymentFareHeroCard: {
    borderRadius: 22,
    backgroundColor: '#111827',
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
  },

  paymentFareHeroLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  paymentFareHeroValue: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 6,
  },

  paymentFareHeroHint: {
    color: '#e5e7eb',
    fontSize: 13,
    lineHeight: 19,
  },

  paymentActionHint: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: -4,
  },

  successBannerSoft: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },

  warningBannerSoft: {
    backgroundColor: '#fff8db',
    borderColor: '#fde68a',
  },

  rideSummaryStrip: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 18,
    padding: 12,
    backgroundColor: '#fcfcfc',
    gap: 10,
  },

  rideSummaryStripItem: {
    gap: 3,
  },

  rideSummaryStripLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  rideSummaryStripValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },

  liveRideHomeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },

  liveRideHomeBannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveRideHomeBannerTextWrap: {
    flex: 1,
  },

  liveRideHomeBannerTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },

  liveRideHomeBannerText: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },

  liveTrackingHeroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 22,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  liveTrackingHeroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfccb',
    borderWidth: 1,
    borderColor: '#d9f99d',
    marginBottom: 14,
  },

  liveTrackingHeroIcon: {
    color: '#365314',
    fontSize: 16,
    fontWeight: '800',
  },

  liveTrackingHeroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },

  liveTrackingHeroSubtitle: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  trackingActionsRow: {
    gap: 10,
    marginTop: 14,
  },

  liveRideCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#ffffff',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  liveRideCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },

  liveRideTitleWrap: {
    flex: 1,
  },

  liveRideEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  liveRideEyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },

  liveRideEyebrow: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  liveRideTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },

  liveRideSubtitle: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },

  liveRideStatusPill: {
    borderRadius: 999,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  liveRideStatusPillText: {
    color: '#92400e',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  liveRideTripRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },

  liveRideRouteColumn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 22,
    padding: 14,
    backgroundColor: '#fcfcfc',
  },

  liveRideRouteNodeWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  liveRideRouteNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },

  liveRideRouteNodePickup: {
    backgroundColor: '#16a34a',
  },

  liveRideRouteNodeDestination: {
    backgroundColor: '#dc2626',
  },

  liveRideRouteTextWrap: {
    flex: 1,
  },

  liveRideRouteLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 3,
  },

  liveRideRouteValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },

  liveRideRouteLine: {
    width: 2,
    height: 18,
    backgroundColor: '#d1d5db',
    marginLeft: 5,
    marginVertical: 8,
  },

  liveRideMiniMetaCard: {
    width: 92,
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 22,
    padding: 12,
    backgroundColor: '#fff8db',
    alignItems: 'flex-start',
  },

  liveRideMiniMetaLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },

  liveRideMiniMetaValue: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },

  liveRideMiniMetaSecondary: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },

  liveRideDriverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 22,
    padding: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 14,
    gap: 12,
  },

  liveRideDriverImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  liveRideDriverTextWrap: {
    flex: 1,
  },

  liveRideDriverName: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 3,
  },

  liveRideDriverMeta: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },

  liveRideDriverHint: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
  },

  liveRideDriverBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
  },

  liveRideSoftBanner: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    borderRadius: 18,
    padding: 14,
  },

  liveRideSoftBannerText: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },

  liveRideBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  liveRideActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  liveRideFooterPill: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  liveRideFooterPillText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },

  liveRideRefreshButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  liveRideRefreshButtonText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
  },
  liveRideCancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: '#fff7f7',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  liveRideCancelButtonText: {
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelRideGhostButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff7f7',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelRideGhostButtonText: {
    color: '#991b1b',
    fontSize: 15,
    fontWeight: '700',
  },
});
