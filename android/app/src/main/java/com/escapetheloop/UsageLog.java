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

    @ReactMethod //hacky way to get the current activity
    public void currentActivity(Callback callBack) {
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
            }
        }
        if (powerManager.isInteractive()) {
            if (currentActivity != null) {
                    callBack.invoke(currentActivity);
                    currentActivity=null;
            } else {
                callBack.invoke("no activity");
            }
        } else {
            currentActivity="Screen Off!";
            callBack.invoke(currentActivity);
        }
    }

    @ReactMethod //this method is better in terms of accuracy
    public void getAppUsageData2(Callback callBack) {
        ReactApplicationContext context = getReactApplicationContext();
        UsageStatsManager usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -1);
        long startTime = calendar.getTimeInMillis();
        long endTime = System.currentTimeMillis();
        List<UsageStats> usageStatsList = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);
        HashMap<String, AppUsageData> appUsageTimeMap = new HashMap<>();
        PackageManager pm = context.getPackageManager();

        for (UsageStats usageStats : usageStatsList) {
//            if (pm.getLaunchIntentForPackage(usageStats.getPackageName()) == null) {
//                continue;
//            }

            long usageTimeSeconds = usageStats.getTotalTimeInForeground() / 1000;
            if (usageTimeSeconds < 10) {
                continue;
            }
            AppUsageData appUsageData = new AppUsageData();
            appUsageData.packageName = usageStats.getPackageName();
            try {
                ApplicationInfo ai = pm.getApplicationInfo(appUsageData.packageName, 0);
//                if ((ai.flags & ApplicationInfo.FLAG_SYSTEM) != 0) { // Add this condition to filter out system apps
//                    continue;
//                }
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
//                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//                bitmap.compress(Bitmap.CompressFormat.PNG, 10, byteArrayOutputStream);
//                byte[] byteArray = byteArrayOutputStream.toByteArray();
//                appUsageData.iconBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace(); // Add this line to print the stack trace

                appUsageData.appName = appUsageData.packageName;

            }
            appUsageData.usageTimeSeconds = usageStats.getTotalTimeInForeground() / 1000;
            appUsageData.usageTimeMinutes = TimeUnit.MILLISECONDS.toMinutes(usageStats.getTotalTimeInForeground());
            appUsageTimeMap.put(appUsageData.packageName, appUsageData);
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




    private WindowManager windowManager;
    private WindowManager.LayoutParams params;

    private ReactRootView reactRootView;



    @ReactMethod
    public void show() {
        ReactApplicationContext context = getReactApplicationContext();
        Activity currentActivity = context.getCurrentActivity();

        windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);

        params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.TOP | Gravity.LEFT;

        ReactInstanceManager reactInstanceManager = ReactInstanceManager.builder()
                .setApplication(currentActivity.getApplication())
                .setCurrentActivity(currentActivity)
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .addPackage(new MainReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        reactRootView = new ReactRootView(context);
        reactRootView.startReactApplication(
                reactInstanceManager,
                "ReactModal",
                null
        );

        windowManager.addView(reactRootView, params);

        View overlayView = new View(context);
        windowManager.addView(overlayView, params);
    }

    @ReactMethod
    public void hide() {
        ReactApplicationContext context = getReactApplicationContext();

        View overlayView = new View(context);
        windowManager.removeView(overlayView);
    }
    private ReactInstanceManager reactInstanceManager;

    @ReactMethod
    public void show2() {
        ReactApplicationContext context = getReactApplicationContext();
        Activity currentActivity = context.getCurrentActivity();

        windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);

        params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.TOP | Gravity.LEFT;

        reactInstanceManager = ReactInstanceManager.builder()
                .setApplication(currentActivity.getApplication())
                .setCurrentActivity(currentActivity)
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .addPackage(new MainReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        reactRootView = new ReactRootView(context);
        reactRootView.startReactApplication(
                reactInstanceManager,
                "modalComp",
                null
        );

        windowManager.addView(reactRootView, params);
    }










//
// NOT GIVING AND ERROR BUT NOT WORKING AS WELL :)
//    private WindowManager windowManager;
//    private LinearLayout overlayView;
//    @ReactMethod
//    public void startOverlay() {
//        if (windowManager == null) {
//            ReactApplicationContext context = getReactApplicationContext();
//
//            windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
//
//            overlayView = new LinearLayout(getReactApplicationContext());
//            overlayView.setBackgroundColor(0xFF000000);
//
//            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
//                    WindowManager.LayoutParams.MATCH_PARENT,
//                    WindowManager.LayoutParams.MATCH_PARENT,
//                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
//                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
//                            | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
//                    PixelFormat.TRANSLUCENT);
//
//            params.gravity = Gravity.LEFT | Gravity.TOP;
//            windowManager.addView(overlayView, params);
//        }
//    }
//
//    @ReactMethod
//    public void stopOverlay() {
//        if (overlayView != null) {
//            windowManager.removeView(overlayView);
//            overlayView = null;
//            windowManager = null;
//        }
//    }
//

































































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