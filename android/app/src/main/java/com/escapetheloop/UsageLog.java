package com.escapetheloop; // replace com.your-app-name with your app’s name
import static android.content.Context.USAGE_STATS_SERVICE;

import android.app.ActivityManager;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.AdaptiveIconDrawable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
public class UsageLog extends ReactContextBaseJavaModule {
    public UsageLog(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "UsageLog";
    }




    @ReactMethod
    public void getDataAndroid(Callback callBack) {
        ReactApplicationContext context = getReactApplicationContext();

        // Log.d("javasidde, currentime:", String.valueOf(System.currentTimeMillis() ));
       // Log.d("js side currentime:", String.valueOf(current));
        UsageStatsManager usm = (UsageStatsManager) context.getSystemService(USAGE_STATS_SERVICE);
        List<UsageStats> appList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY,  System.currentTimeMillis() - 1000*3600*24,  System.currentTimeMillis());
        appList = appList.stream().filter(app -> app.getTotalTimeInForeground() > 100).collect(Collectors.toList());
        // Group the usageStats by application and sort them by total time in foreground
        if (appList.size() > 0) {
            Map<String, UsageStats> mySortedMap = new TreeMap<>();
            for (UsageStats usageStats : appList) {
                mySortedMap.put(usageStats.getPackageName(), usageStats);
            }
            ArrayList<Map<String, Object>> appInfoList = new ArrayList<>();
            for (Map.Entry<String, UsageStats> entry : mySortedMap.entrySet()) {
                String packageName = entry.getKey();
                UsageStats usageStats = entry.getValue();
                String[] packageNames = packageName.split("\\.");
                String appName = packageNames[packageNames.length - 1].trim();
                String usageDuration = getDurationBreakdown(usageStats.getTotalTimeInForeground());
                String minutesTotal = getDurationInMinutes(usageStats.getTotalTimeInForeground());
                Drawable icon = null;
                try {
                    icon = context.getPackageManager().getApplicationIcon(packageName);
                } catch (PackageManager.NameNotFoundException e) {
                    // handle the exception
                }
                Bitmap bitmap = null;
                if (icon instanceof BitmapDrawable) {
                    bitmap = ((BitmapDrawable) icon).getBitmap();
                } else if (icon instanceof AdaptiveIconDrawable) {
                    // Convert adaptive icon to bitmap
                    bitmap = Bitmap.createBitmap(icon.getIntrinsicWidth(), icon.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
                    Canvas canvas = new Canvas(bitmap);
                    icon.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
                    icon.draw(canvas);
                }
                Map<String, Object> appInfo = new HashMap<>();
                appInfo.put("appName", appName);
                appInfo.put("usageDuration", usageDuration);
                appInfo.put("minutesTotal", minutesTotal);
                Log.d("---------------APP INFO:::", String.valueOf(appName + " Usage: " + usageDuration));

                // Convert bitmap to Base64 string
                if (bitmap != null) {
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                    bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
                    byte[] bitmapBytes = outputStream.toByteArray();
                    String iconBase64 = Base64.encodeToString(bitmapBytes, Base64.DEFAULT);

                    appInfo.put("icon", iconBase64);
                }
//                appInfo.put("usagePercentage", usagePercentage);
                appInfoList.add(appInfo);
            }
            // convert the list to JSON string
            String appStats = new Gson().toJson(appInfoList);
            // Log.d("loadStatistics2323:", appStats);
            callBack.invoke(appStats);
        }
    }



    @ReactMethod
    public void currentActivity(Callback callBack) {
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, -1);
        long endTime = System.currentTimeMillis();
        long startTime = calendar.getTimeInMillis();
// Retrieve the usage events for the specified time range
        UsageEvents usageEvents = usageStatsManager.queryEvents(startTime, endTime);
// Iterate through the usage events to find the current foreground activity
        String currentActivity = null;
        UsageEvents.Event event = new UsageEvents.Event();
        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event);
            if (event.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                currentActivity = event.getClassName();
                Log.d("************APP INFO:::", String.valueOf( "**** cucurrenct Activity: " + currentActivity));
                //callBack.invoke(currentActivity);
            } else if (event.getEventType() == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                currentActivity = null;
            }
        }
        if (currentActivity != null) {
            // The current foreground activity is `currentActivity`
            callBack.invoke(currentActivity);

        } else {
            // There is no current foreground activity
        }


    }

    @ReactMethod
    public void test(Callback callBack) {
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -1);
        long startTime = calendar.getTimeInMillis();
        long endTime = System.currentTimeMillis();

        UsageEvents usageEvents = usageStatsManager.queryEvents(startTime, endTime);

        UsageEvents.Event event = new UsageEvents.Event();
        HashMap<String, Long> appUsageTimeMap = new HashMap<>();
        HashMap<String, Long> appUsageTimeAggregated = new HashMap<>();

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event);

            if (event.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED) {
                String packageName = event.getPackageName();
                long timestamp = event.getTimeStamp();
                appUsageTimeMap.put(packageName, timestamp);
            } else if (event.getEventType() == UsageEvents.Event.ACTIVITY_PAUSED) {
                String packageName = event.getPackageName();
                long timestamp = event.getTimeStamp();
                if (appUsageTimeMap.containsKey(packageName)) {
                    long usageTime = timestamp - appUsageTimeMap.get(packageName);
                    long usageTimeMinutes = TimeUnit.MILLISECONDS.toMinutes(usageTime);
                    if (appUsageTimeAggregated.containsKey(packageName)) {
                        appUsageTimeAggregated.put(packageName, appUsageTimeAggregated.get(packageName) + usageTimeMinutes);
                    } else {
                        appUsageTimeAggregated.put(packageName, usageTimeMinutes);
                    }
                    appUsageTimeMap.remove(packageName);
                }
            }

        }
        String appUsageTimeJson = new Gson().toJson(appUsageTimeAggregated);
        callBack.invoke(appUsageTimeJson);
    }







    private String getDurationBreakdown(long millis) {
        if (millis < 0) {
            throw new IllegalArgumentException("Duration must be greater than zero!");
        }
        long hours = TimeUnit.MILLISECONDS.toHours(millis);
        millis -= TimeUnit.HOURS.toMillis(hours);
        long minutes = TimeUnit.MILLISECONDS.toMinutes(millis);
        millis -= TimeUnit.MINUTES.toMillis(minutes);
        long seconds = TimeUnit.MILLISECONDS.toSeconds(millis);
        return (hours + " h " +  minutes + " m " + seconds + " s");
    }

    private String getDurationInMinutes(long millis) {
        if (millis < 0) {
            throw new IllegalArgumentException("Duration must be greater than zero!");
        }
        long minutes = TimeUnit.MILLISECONDS.toMinutes(millis);
        return (String.valueOf(minutes));
    }
}