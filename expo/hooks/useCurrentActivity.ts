import { currentActivity } from '@/modules/usage-stats';

import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const debugLogs = true //reload the app on change


// Fetch the current activity
export async function fetchCurrentActivity() {
  try {
    return await currentActivity()
  } catch (error) {
    debugLogs && console.error('Failed to get current activity:', error)
    return 'default' // or handle this scenario differently
  }
}



const BACKGROUND_TASK_NAME = 'BACKGROUND_TASK';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    console.log('Background task running...');
    // Your task execution logic here

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});







