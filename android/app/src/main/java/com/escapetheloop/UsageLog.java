package com.escapetheloop; // replace com.your-app-name with your app’s name
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.os.Build;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.stream.Collectors;


import androidx.appcompat.app.AppCompatActivity;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.Drawable;
import android.net.IpSecManager;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static android.app.AppOpsManager.MODE_ALLOWED;
import static android.app.AppOpsManager.OPSTR_GET_USAGE_STATS;
import static android.content.Context.USAGE_STATS_SERVICE;
import com.facebook.react.bridge.Callback;

import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;

import java.text.SimpleDateFormat;

import android.util.Log;
import android.widget.Toast;

import java.util.Map;
import java.util.HashMap;
import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;









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
            String appstats =  mySortedMap.toString();
            Log.d("loadStatistics2323:", mySortedMap.toString());
            return appstats;
//            showAppsUsage(mySortedMap);
//            logInfo(mySortedMap);
        }
        return null;

    }
}