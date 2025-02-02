package com.escapetheloop; // replace com.your-app-name with your app’s name
import static android.content.Context.USAGE_STATS_SERVICE;

import android.app.Activity;
import android.view.View;
import android.view.WindowManager;
import android.app.KeyguardManager;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.PixelFormat;
import android.graphics.drawable.AdaptiveIconDrawable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.PowerManager;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;

import androidx.core.content.ContextCompat;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.ReactChoreographer;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.bridge.Promise;
import com.google.gson.Gson;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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



    private static String lastKnownActivity = null;

    @ReactMethod
public void currentActivity(Promise promise) {
    try {
        ReactApplicationContext context = getReactApplicationContext();
        PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, -1);
        long endTime = System.currentTimeMillis();
        long startTime = calendar.getTimeInMillis();
        UsageEvents usageEvents = usageStatsManager.queryEvents(startTime, endTime);
        String currentActivity = null;
        UsageEvents.Event event = new UsageEvents.Event();
        // Iterate through the usage events to find the current foreground activity
        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event);
            if (event.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED) {
                currentActivity = event.getPackageName();
                lastKnownActivity = currentActivity;
            }
        }

        if (powerManager.isInteractive()) {
            if (currentActivity != null) {
                promise.resolve(currentActivity);
                // currentActivity=null;
            } else {
                promise.resolve(lastKnownActivity);
                //  callBack.invoke("no activity");
            }
        } else {
            currentActivity = "Screen Off!";
            promise.resolve(currentActivity);
        }

//        if (powerManager.isInteractive()) {
//            if (currentActivity != null) {
//                promise.resolve("no activity");
//            } else {
//                promise.resolve("Screen Off!");
//            }
//        } else {
//            promise.resolve(currentActivity);
//        }
    } catch (Exception e) {
        promise.reject("ACTIVITY_ERROR", "Failed to get current activity", e);
    }
}

    @ReactMethod
    public void getUsageStats(Callback callBack) {
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);

        // Get current time and start of the day (midnight)
        Calendar calendar = Calendar.getInstance();
        long endTime = calendar.getTimeInMillis();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        long startTime = calendar.getTimeInMillis();

        // Use queryEvents to get all events from start time to end time
        UsageEvents usageEvents = usageStatsManager.queryEvents(startTime, endTime);

        HashMap<String, AppUsageData> appUsageTimeMap = new HashMap<>();
        HashMap<String, Long> foregroundTimes = new HashMap<>();

        UsageEvents.Event event = new UsageEvents.Event();

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event);
            String packageName = event.getPackageName();

            if (event.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                foregroundTimes.put(packageName, event.getTimeStamp());
            } else if (event.getEventType() == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                if (foregroundTimes.containsKey(packageName)) {
                    long foregroundTime = foregroundTimes.get(packageName);
                    long backgroundTime = event.getTimeStamp();

                    long usageDuration = backgroundTime - foregroundTime;

                    AppUsageData appUsageData = appUsageTimeMap.get(packageName);
                    if (appUsageData == null) {
                        appUsageData = new AppUsageData();
                        appUsageData.packageName = packageName;
                        appUsageData.usageTimeSeconds = 0;
                        appUsageData.usageTimeMinutes = 0;
                        appUsageTimeMap.put(packageName, appUsageData);
                    }

                    appUsageData.usageTimeSeconds += usageDuration / 1000;
                    appUsageData.usageTimeMinutes += TimeUnit.MILLISECONDS.toMinutes(usageDuration);

                    foregroundTimes.remove(packageName);
                }
            }
        }

        PackageManager pm = context.getPackageManager();

        for (AppUsageData appUsageData : appUsageTimeMap.values()) {
            try {
                ApplicationInfo ai = pm.getApplicationInfo(appUsageData.packageName, 0);
                appUsageData.appName = ai.loadLabel(pm).toString();

                Drawable icon = pm.getApplicationIcon(ai);
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
                if (bitmap != null) { // Add this null check
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    bitmap.compress(Bitmap.CompressFormat.PNG, 10, byteArrayOutputStream);
                    byte[] byteArray = byteArrayOutputStream.toByteArray();
                    appUsageData.iconBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
                }
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace(); // Add this line to print the stack trace

                appUsageData.appName = appUsageData.packageName;
            }
        }

        JSONArray jsonArray = new JSONArray();
        for (Map.Entry<String, AppUsageData> entry : appUsageTimeMap.entrySet()) {
            AppUsageData appUsageData = entry.getValue();
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("packageName", appUsageData.packageName);
                jsonObject.put("appName", appUsageData.appName);
                jsonObject.put("iconBase64", appUsageData.iconBase64);
                jsonObject.put("usageTimeSeconds", appUsageData.usageTimeSeconds);
                jsonObject.put("usageTimeMinutes", appUsageData.usageTimeMinutes);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            jsonArray.put(jsonObject);
        }
        callBack.invoke(jsonArray.toString());
    }




    @ReactMethod
    public void getAppUsageData2(Callback callback) {
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);

        // Get the app usage statistics for the last day
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -1);
        long startTime = calendar.getTimeInMillis();
        long endTime = System.currentTimeMillis();
        List<UsageStats> usageStatsList = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);

        // Convert the UsageStats objects to AppUsageData objects
        List<AppUsageData> appUsageDataList = new ArrayList<>();
        PackageManager pm = context.getPackageManager();
        for (UsageStats usageStats : usageStatsList) {
            long usageTimeSeconds = usageStats.getTotalTimeInForeground() / 1000;
            if (usageTimeSeconds < 10) {
                continue;
            }

            AppUsageData appUsageData = new AppUsageData();
            appUsageData.packageName = usageStats.getPackageName();
            appUsageData.usageTimeSeconds = usageTimeSeconds;
            appUsageData.usageTimeMinutes = TimeUnit.MILLISECONDS.toMinutes(usageStats.getTotalTimeInForeground());

            // Get the app name and icon base64 string
            try {
                ApplicationInfo ai = pm.getApplicationInfo(appUsageData.packageName, 0);
                appUsageData.appName = ai.loadLabel(pm).toString();
                appUsageData.iconBase64 = getIconBase64(pm, ai);
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
                appUsageData.appName = appUsageData.packageName;
            }

            appUsageDataList.add(appUsageData);
        }

        // Convert the AppUsageData objects to a JSON array
        JSONArray jsonArray = new JSONArray();
        for (AppUsageData appUsageData : appUsageDataList) {
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("packageName", appUsageData.packageName);
                jsonObject.put("appName", appUsageData.appName);
                jsonObject.put("iconBase64", appUsageData.iconBase64);
                jsonObject.put("usageTimeSeconds", appUsageData.usageTimeSeconds);
                jsonObject.put("usageTimeMinutes", appUsageData.usageTimeMinutes);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            jsonArray.put(jsonObject);
        }

        // Invoke the callback with the JSON array
        callback.invoke(jsonArray.toString());
    }

    private String getIconBase64(PackageManager pm, ApplicationInfo ai) {
        Drawable icon = pm.getApplicationIcon(ai);
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
        if (bitmap != null) {
            // Convert bitmap to base64 string
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 10, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            return Base64.encodeToString(byteArray, Base64.DEFAULT);
        }
        return null;
    }



    private WindowManager windowManager;
    private WindowManager.LayoutParams params;

    private ReactRootView reactRootView;



































































    @ReactMethod //gives innacurate info sometimes, has to be tested on real device, more flexible than getAppUsageData2
    public void getAppUsageData(Callback callBack) {
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -1);
        long startTime = calendar.getTimeInMillis();
        long endTime = System.currentTimeMillis();
        UsageEvents usageEvents = usageStatsManager.queryEvents(startTime, endTime);
        UsageEvents.Event event = new UsageEvents.Event();
        HashMap<String, AppUsageData> appUsageTimeMap = new HashMap<>();

        PackageManager pm = context.getPackageManager();
        PowerManager powerManager = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
        KeyguardManager keyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event);

            if (event.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED) {
                if (powerManager.isInteractive()) {
                    String packageName = event.getPackageName();
                    long timestamp = event.getTimeStamp();

                    if (pm.getLaunchIntentForPackage(packageName) == null) {
                        continue;
                    }

                    if (!appUsageTimeMap.containsKey(packageName)) {
                        AppUsageData appUsageData = new AppUsageData();
                        appUsageData.usageStartTimestamp = timestamp;
                        appUsageData.packageName = packageName;

                        try {
                            ApplicationInfo ai = pm.getApplicationInfo(packageName, 0);
                            appUsageData.appName = ai.loadLabel(pm).toString();
                            Drawable icon = pm.getApplicationIcon(ai);
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
                            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                            bitmap.compress(Bitmap.CompressFormat.PNG, 10, byteArrayOutputStream);
                            byte[] byteArray = byteArrayOutputStream.toByteArray();
                            appUsageData.iconBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
                        } catch (PackageManager.NameNotFoundException e) {
                            appUsageData.appName = appUsageData.packageName;
                            e.printStackTrace(); // Add this line to print the stack trace
                        }
                        appUsageTimeMap.put(packageName, appUsageData);
                    }
                }
            } else if (event.getEventType() == UsageEvents.Event.ACTIVITY_PAUSED) {
                String packageName = event.getPackageName();
                long timestamp = event.getTimeStamp();
                if (appUsageTimeMap.containsKey(packageName)) {
                    AppUsageData appUsageData = appUsageTimeMap.get(packageName);
                    long usageTime = timestamp - appUsageData.usageStartTimestamp;
                    appUsageData.usageTimeSeconds = usageTime / 1000;
                    appUsageData.usageTimeMinutes = TimeUnit.MILLISECONDS.toMinutes(usageTime);
                }
            }
        }

        JSONArray jsonArray = new JSONArray();
        for (Map.Entry<String, AppUsageData> entry : appUsageTimeMap.entrySet()) {
            AppUsageData appUsageData = entry.getValue();
            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("packageName", appUsageData.packageName);
                jsonObject.put("appName", appUsageData.appName);
                jsonObject.put("iconBase64", appUsageData.iconBase64);
                jsonObject.put("usageTimeSeconds", appUsageData.usageTimeSeconds);
                jsonObject.put("usageTimeMinutes", appUsageData.usageTimeMinutes);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            jsonArray.put(jsonObject);
        }

        callBack.invoke(jsonArray.toString());
    }

    private static class AppUsageData {
        public String packageName;
        public String appName;
        public String iconBase64;
        public long usageStartTimestamp;
        public long usageTimeSeconds;
        public long usageTimeMinutes;
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
        HashMap<String, HashMap<String, Object>> appUsageTimeAggregated = new HashMap<>();
        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event);
            if (event.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED) {
                String packageName = event.getPackageName();
                long timestamp = event.getTimeStamp();
                HashMap<String, Object> packageUsage = new HashMap<>();
                packageUsage.put("usageTime", timestamp);
                //appInfo.put("minutesTotal", timestamp);
                PackageManager packageManager = context.getPackageManager();
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
                // Convert bitmap to Base64 string
                if (bitmap != null) {
                    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                    bitmap.compress(Bitmap.CompressFormat.PNG, 20, outputStream);
                    byte[] bitmapBytes = outputStream.toByteArray();
                    String iconBase64 = Base64.encodeToString(bitmapBytes, Base64.DEFAULT);
                    packageUsage.put("icon", iconBase64);
                }

                appUsageTimeAggregated.put(packageName, packageUsage);

            } else if (event.getEventType() == UsageEvents.Event.ACTIVITY_PAUSED) {
                String packageName = event.getPackageName();
                long timestamp = event.getTimeStamp();
                if (appUsageTimeMap.containsKey(packageName)) {
                    long usageTime = timestamp - appUsageTimeMap.get(packageName);
                    long usageTimeSeconds = TimeUnit.MILLISECONDS.toSeconds(usageTime);
                    if (appUsageTimeAggregated.containsKey(packageName)) {
                        HashMap<String, Object> packageUsage = appUsageTimeAggregated.get(packageName);
                        packageUsage.put("usageTime", ((long) packageUsage.get(packageName)) + usageTimeSeconds);
                        appUsageTimeAggregated.put(packageName, packageUsage);
                    } else {
                        HashMap<String, Object> packageUsage = new HashMap<>();
                        packageUsage.put("usageTime", usageTimeSeconds);
                        PackageManager packageManager = context.getPackageManager();
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
                        // Convert bitmap to Base64 string
                        if (bitmap != null) {
                            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                            bitmap.compress(Bitmap.CompressFormat.PNG, 20, outputStream);
                            byte[] bitmapBytes = outputStream.toByteArray();
                            String iconBase64 = Base64.encodeToString(bitmapBytes, Base64.DEFAULT);
                            packageUsage.put("icon", iconBase64);

                        }
                        appUsageTimeAggregated.put(packageName, packageUsage);
                    }
                    appUsageTimeMap.remove(packageName);
                }
            }
        }
        String appUsageTimeJson = new Gson().toJson(appUsageTimeAggregated);
        callBack.invoke(appUsageTimeJson);
    }


    @ReactMethod
    public void test2(Callback callBack) {
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
                    long usageTimeSeconds = TimeUnit.MILLISECONDS.toSeconds(usageTime);

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


    @ReactMethod
    public void getDataAndroid(Callback callBack) {
        ReactApplicationContext context = getReactApplicationContext();

        // Log.d("javasidde, currentime:", String.valueOf(System.currentTimeMillis() ));
        // Log.d("js side currentime:", String.valueOf(current));
        UsageStatsManager usm = (UsageStatsManager) context.getSystemService(USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, -1);
        long endTime = System.currentTimeMillis();
        long startTime = calendar.getTimeInMillis();
        List<UsageStats> appList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY,  startTime, endTime);
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
                String usageDuration = getDurationBreakdown(usageStats.getTotalTimeVisible());
                String minutesTotal = getDurationInMinutes(usageStats.getTotalTimeVisible());
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