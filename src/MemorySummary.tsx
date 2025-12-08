import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface MemorySummaryProps {
  value: number;
  before: number;
  after: number;
  dirty: boolean;
  viewCount: number;
}

export function MemorySummary({
  value,
  before,
  after,
  dirty,
  viewCount,
}: MemorySummaryProps) {
  const memoryPerView = viewCount > 0 ? value / viewCount : 0;

  return (
    <View style={styles.memoryPanel}>
      <Text style={styles.primaryLabel}>Memory per View</Text>
      <View style={styles.primaryValueContainer}>
        <Text style={styles.primaryValue}>
          {formatKilobytes(memoryPerView)}
        </Text>
        <Text style={styles.primaryUnit}>KB</Text>
      </View>

      <View style={styles.secondarySection}>
        <Text style={styles.secondaryLabel}>Total Memory</Text>
        <View style={styles.secondaryValueContainer}>
          <Text style={styles.secondaryValue}>{formatMegabytes(value)}</Text>
          <Text style={styles.secondaryUnit}>MB</Text>
        </View>
      </View>

      <View style={styles.memoryDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>from</Text>
          <Text style={styles.detailValue}>{formatMegabytes(before)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>after</Text>
          <Text style={styles.detailValue}>{formatMegabytes(after)}</Text>
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
  primaryLabel: {
    fontSize: 16,
    color: '#2c5f8d',
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  primaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
    justifyContent: 'center',
  },
  primaryValue: {
    fontSize: 64,
    fontWeight: '700',
    color: '#2c5f8d',
    letterSpacing: -1.5,
  },
  primaryUnit: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2c5f8d',
    marginLeft: 8,
  },
  secondarySection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryLabel: {
    fontSize: 12,
    color: '#6b9dc9',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  secondaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  secondaryValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#6b9dc9',
    letterSpacing: -0.5,
  },
  secondaryUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b9dc9',
    marginLeft: 6,
  },
  memoryDetails: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  detailLabel: {
    fontSize: 11,
    color: '#9bb8d3',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 12,
    color: '#9bb8d3',
    fontWeight: '500',
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

function formatMegabytes(bytes: number): string {
  if (!bytes && bytes !== 0) return '—';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1);
}

function formatKilobytes(bytes: number): string {
  if (!bytes && bytes !== 0) return '—';
  const kb = bytes / 1024;
  return kb.toFixed(1);
}
