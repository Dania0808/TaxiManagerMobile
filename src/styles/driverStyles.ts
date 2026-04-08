import { StyleSheet } from 'react-native';

export const driverStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#ffffff',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  innerCard: {
    borderWidth: 1,
    borderColor: '#eeeeee',
    padding: 12,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#fcfcfc',
  },
  label: {
    fontWeight: '700',
  },
  map: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusBanner: {
    borderWidth: 1,
    borderColor: '#dbe3f0',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#eff6ff',
    marginBottom: 12,
  },
  statusTitle: {
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontWeight: '700',
    fontSize: 15,
  },
  message: {
    marginBottom: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
});
