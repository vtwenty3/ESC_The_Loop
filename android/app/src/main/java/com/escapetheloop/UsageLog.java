package com.escapetheloop; // replace com.your-app-name with your app’s name
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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










public class UsageLog extends ReactContextBaseJavaModule {
    UsageLog(ReactApplicationContext context) {
        super(context);
    }
    @Override
    public String getName() {
        return "UsageLog";
    }

    @ReactMethod
    public void sendUsageData(String app, String time) {
        Log.d("sendusagedata:", "dataSample: " + "app:" + app + "; usage time:" + time);
    }
     public static List<Integer> getUsageStatsList(Context context){


         List<Integer> aList = new ArrayList<>();
       return aList;
     }

//
//    public void loadStatistics() {
//        UsageStatsManager usm = (UsageStatsManager) this.getSystemService(USAGE_STATS_SERVICE);
//        List<UsageStats> appList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY,  System.currentTimeMillis() - 1000*3600*24,  System.currentTimeMillis());
//        appList = appList.stream().filter(app -> app.getTotalTimeInForeground() > 0).collect(Collectors.toList());
//
//        // Group the usageStats by application and sort them by total time in foreground
//        if (appList.size() > 0) {
//            Map<String, UsageStats> mySortedMap = new TreeMap<>();
//            for (UsageStats usageStats : appList) {
//                mySortedMap.put(usageStats.getPackageName(), usageStats);
//            }
//            Log.d("loadStatistics2323:", mySortedMap.toString());
//            showAppsUsage(mySortedMap);
//            logInfo(mySortedMap);
//        }
//    }
//
//    private boolean getGrantStatus() {
//        AppOpsManager appOps = (AppOpsManager) getApplicationContext()
//                .getSystemService(Context.APP_OPS_SERVICE);
//
//        int mode = appOps.checkOpNoThrow(OPSTR_GET_USAGE_STATS,
//                android.os.Process.myUid(), getApplicationContext().getPackageName());
//
//        if (mode == AppOpsManager.MODE_DEFAULT) {
//            return (getApplicationContext().checkCallingOrSelfPermission(android.Manifest.permission.PACKAGE_USAGE_STATS) == PackageManager.PERMISSION_GRANTED);
//        } else {
//            return (mode == MODE_ALLOWED);
//        }
//    }





}