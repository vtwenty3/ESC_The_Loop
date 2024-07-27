import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to UsageStats.web.ts
// and on native platforms to UsageStats.ts
import UsageStatsModule from './src/UsageStatsModule';
import UsageStatsView from './src/UsageStatsView';
import { ChangeEventPayload, UsageStatsViewProps } from './src/UsageStats.types';

// Get the native constant value.
export const PI = UsageStatsModule.PI;

export function hello(): string {
  return UsageStatsModule.hello();
}

export function currentActivity(): Promise<String> {
  return UsageStatsModule.currentActivity();
}

export async function setValueAsync(value: string) {
  return await UsageStatsModule.setValueAsync(value);
}

const emitter = new EventEmitter(UsageStatsModule ?? NativeModulesProxy.UsageStats);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { UsageStatsView, UsageStatsViewProps, ChangeEventPayload };
