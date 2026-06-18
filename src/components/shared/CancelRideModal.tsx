import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type CancelRideModalProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  confirmLabel: string;
  reasons: string[];
  onClose: () => void;
  onConfirm: (reason: string, note: string) => void;
  isSubmitting?: boolean;
  allowNote?: boolean;
};

export default function CancelRideModal({
  visible,
  title,
  subtitle,
  confirmLabel,
  reasons,
  onClose,
  onConfirm,
  isSubmitting = false,
  allowNote = false,
}: CancelRideModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!visible) return;
    setSelectedReason(reasons[0] ?? '');
    setNote('');
  }, [visible, reasons]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <ScrollView
            style={styles.reasonsScroll}
            contentContainerStyle={styles.reasonsContent}
            showsVerticalScrollIndicator={false}
          >
            {reasons.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <TouchableOpacity
                  key={reason}
                  style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
                  onPress={() => setSelectedReason(reason)}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[styles.reasonChipText, isSelected && styles.reasonChipTextSelected]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {allowNote ? (
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add a short note"
              placeholderTextColor="#9ca3af"
              style={styles.noteInput}
              multiline
            />
          ) : null}

          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
            onPress={() => onConfirm(selectedReason, note)}
            disabled={isSubmitting || !selectedReason}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Processing...' : confirmLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onClose}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>Keep ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17,24,39,0.38)',
  },
  sheet: {
    backgroundColor: '#fffdf8',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderColor: '#efe4bf',
    maxHeight: '72%',
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  reasonsScroll: {
    maxHeight: 180,
  },
  reasonsContent: {
    gap: 10,
    paddingBottom: 8,
  },
  reasonChip: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  reasonChipSelected: {
    borderColor: '#fcd34d',
    backgroundColor: '#fff8db',
  },
  reasonChipText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  reasonChipTextSelected: {
    color: '#92400e',
  },
  noteInput: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#111827',
    textAlignVertical: 'top',
    marginTop: 8,
    marginBottom: 12,
  },
  primaryButton: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#111827',
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
});
