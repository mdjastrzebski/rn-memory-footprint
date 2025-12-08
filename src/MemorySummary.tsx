import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface MemorySummaryProps {
  value: number;
  before: number;
  after: number;
  dirty: boolean;
}

export function MemorySummary({
  value,
  before,
  after,
  dirty,
}: MemorySummaryProps) {
  return (
    <View style={styles.memoryPanel}>
      <Text style={styles.memoryLabel}>Memory Consumption</Text>
      <View style={styles.memoryValueContainer}>
        <Text style={styles.memoryValue}>{formatMemory(value)}</Text>
        <Text style={styles.memoryUnit}>MB</Text>
      </View>
      <View style={styles.memoryDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>from</Text>
          <Text style={styles.detailValue}>{formatMemory(before)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>after</Text>
          <Text style={styles.detailValue}>{formatMemory(after)}</Text>
        </View>
      </View>
      {dirty && (
        <View style={styles.dirtyBadge}>
          <Text style={styles.dirtyText}>Dirty</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  memoryPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#d6ebff',
    alignItems: 'center',
  },
  memoryLabel: {
    fontSize: 14,
    color: '#6b9dc9',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memoryValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
    justifyContent: 'center',
  },
  memoryValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#2c5f8d',
    letterSpacing: -1,
  },
  memoryUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6b9dc9',
    marginLeft: 8,
  },
  memoryDetails: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9bb8d3',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#7fa8cc',
    fontWeight: '600',
  },
  dirtyBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b8d9f5',
  },
  dirtyText: {
    fontSize: 12,
    color: '#4a90e2',
    fontWeight: '600',
  },
});

function formatMemory(bytes: number): string {
  if (!bytes && bytes !== 0) return '—';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1);
}
