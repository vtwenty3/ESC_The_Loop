import * as React from 'react';

import { UsageStatsViewProps } from './UsageStats.types';

export default function UsageStatsView(props: UsageStatsViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
