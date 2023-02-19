package com.escapetheloop; // replace com.your-app-name with your app’s name

import static android.content.Context.USAGE_STATS_SERVICE;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.AdaptiveIconDrawable;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


public class UsageLog extends ReactContextBaseJavaModule {
    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    ReactApplicationContext context = getReactApplicationContext();

//    UsageLog(ReactApplicationContext context) {
//        super(context);
//    }

    public UsageLog(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UsageLog";
    }

    @ReactMethod
    public void sendUsageData(String app, String time, Callback callBack) {
        Log.d("sendusagedata:", "dataSample: " + "app:" + loadStatistics(context) + "; usage time:" + time);
        // UsageStatsManager usm = (UsageStatsManager) mContext.getSystemService(USAGE_STATS_SERVICE);
        String eventId = loadStatistics(context);
        callBack.invoke(eventId);
    }

    @ReactMethod
    public void getDataAndroid(Callback callBack) {
        // UsageStatsManager usm = (UsageStatsManager) mContext.getSystemService(USAGE_STATS_SERVICE);

        callBack.invoke(loadStatistics(context));
    }




//    public static Map<String, UsageStats> getAggregateStatsMap(Context context, int durationInDays){
//        UsageStatsManager usm = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
//
//        // Calendar calendar = Calendar.getInstance();
//        // long endTime = calendar.getTimeInMillis();
//        // calendar.add(Calendar.YEAR, -1);
//        // long startTime = calendar.getTimeInMillis();
//
//        List dates = getDates(durationInDays);
//        long startTime = (long)dates.get(0);
//        long endTime = (long)dates.get(1);
//
//        Map<String, UsageStats> aggregateStatsMap = usm.queryAndAggregateUsageStats(startTime, endTime);
//        return aggregateStatsMap;
//    }


    public static boolean isNoSwitch(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            long ts = System.currentTimeMillis();
            UsageStatsManager usageStatsManager = (UsageStatsManager) context
                    .getApplicationContext().getSystemService(
                            USAGE_STATS_SERVICE);
            List<UsageStats> queryUsageStats = usageStatsManager
                    .queryUsageStats(UsageStatsManager.INTERVAL_BEST, 0, ts);
            return !(queryUsageStats == null || queryUsageStats.isEmpty());

        } else {//from  w ww.j a  v  a 2s  . com
            return true;
        }
    }

    public String loadStatistics(Context context) {
        UsageStatsManager usm = (UsageStatsManager) context.getSystemService(USAGE_STATS_SERVICE);

        List<UsageStats> appList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY,  System.currentTimeMillis() - 1000*3600*24,  System.currentTimeMillis());
        appList = appList.stream().filter(app -> app.getTotalTimeInForeground() > 0).collect(Collectors.toList());

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
//                int usagePercentage = (int) (usageStats.getTotalTimeInForeground() * 100 / totalTime);

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
            return appStats;
        }
        return null;
    }


    public String logInfo (Map<String, UsageStats> mySortedMap) {
        //public void showAppsUsage(List<UsageStats> usageStatsList) {
        ArrayList<String> logList = new ArrayList<>();

        List<UsageStats> usageStatsList = new ArrayList<>(mySortedMap.values());

        // sort the applications by time spent in foreground
        Collections.sort(usageStatsList, (z1, z2) -> Long.compare(z1.getTotalTimeInForeground(), z2.getTotalTimeInForeground()));

        // get total time of apps usage to calculate the usagePercentage for each app
        long totalTime = usageStatsList.stream().map(UsageStats::getTotalTimeInForeground).mapToLong(Long::longValue).sum();

        //fill the appsList
        for (UsageStats usageStats : usageStatsList) {
            String packageName = usageStats.getPackageName();
            String[] packageNames = packageName.split("\\.");
            String appName = packageNames[packageNames.length-1].trim();
            String usageDuration = getDurationBreakdown(usageStats.getTotalTimeInForeground());
            int usagePercentage = (int) (usageStats.getTotalTimeInForeground() * 100 / totalTime);
            logList.add(appName);
            logList.add(usageDuration);
        }
        // reverse the list to get most usage first

        //results in loglist string arraylist filled with the data needed


        Log.d("AppList222", "hithere" + logList.toString() );
        return logList.toString();
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
}