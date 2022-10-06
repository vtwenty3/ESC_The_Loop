package com.escapetheloop; // replace com.your-app-name with your app’s name
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

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
}