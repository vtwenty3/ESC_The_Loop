import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { UsageStatsViewProps } from './UsageStats.types';

const NativeView: React.ComponentType<UsageStatsViewProps> =
  requireNativeViewManager('UsageStats');

export default function UsageStatsView(props: UsageStatsViewProps) {
  return <NativeView {...props} />;
}
