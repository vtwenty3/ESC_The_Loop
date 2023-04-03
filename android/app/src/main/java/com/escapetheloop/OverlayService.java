//Attempt to display an overlay on top of the current activity
//Can be useful for future development
//package com.escapetheloop;
//import android.app.Service;
//import android.content.Intent;
//import android.graphics.PixelFormat;
//import android.os.IBinder;
//import android.view.Gravity;
//import android.view.LayoutInflater;
//import android.view.WindowManager;
//import android.widget.LinearLayout;
//
//public class OverlayService extends Service {
//    private WindowManager windowManager;
//    private LinearLayout overlayView;
//
//    @Override
//    public IBinder onBind(Intent intent) {
//        return null;
//    }
//
//    @Override
//    public void onCreate() {
//        super.onCreate();
//
//        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
//        overlayView = new LinearLayout(this);
//        overlayView.setBackgroundColor(0xFF000000);
//        LayoutInflater inflater = LayoutInflater.from(this);
//        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
//                WindowManager.LayoutParams.MATCH_PARENT,
//                WindowManager.LayoutParams.MATCH_PARENT,
//                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
//                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
//                PixelFormat.TRANSLUCENT);
//
//        params.gravity = Gravity.LEFT | Gravity.TOP;
//        params.x = 0;
//        params.y = 0;
//        windowManager.addView(overlayView, params);
//    }
//
//    @Override
//    public void onDestroy() {
//        super.onDestroy();
//        if (overlayView != null) {
//            windowManager.removeView(overlayView);
//            overlayView = null;
//        }
//    }
//}
//    @ReactMethod
//    public void show() {
//        ReactApplicationContext context = getReactApplicationContext();
//        Activity currentActivity = context.getCurrentActivity();
//
//        windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
//
//        params = new WindowManager.LayoutParams(
//                WindowManager.LayoutParams.MATCH_PARENT,
//                WindowManager.LayoutParams.MATCH_PARENT,
//                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
//                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
//                PixelFormat.TRANSLUCENT
//        );
//
//        params.gravity = Gravity.TOP | Gravity.LEFT;
//
//        ReactInstanceManager reactInstanceManager = ReactInstanceManager.builder()
//                .setApplication(currentActivity.getApplication())
//                .setCurrentActivity(currentActivity)
//                .setBundleAssetName("index.android.bundle")
//                .setJSMainModulePath("index")
//                .addPackage(new MainReactPackage())
//                .setUseDeveloperSupport(BuildConfig.DEBUG)
//                .setInitialLifecycleState(LifecycleState.RESUMED)
//                .build();
//
//        reactRootView = new ReactRootView(context);
//        reactRootView.startReactApplication(
//                reactInstanceManager,
//                "ReactModal",
//                null
//        );
//
//        windowManager.addView(reactRootView, params);
//
//        View overlayView = new View(context);
//        windowManager.addView(overlayView, params);
//    }
//
//    @ReactMethod
//    public void hide() {
//        ReactApplicationContext context = getReactApplicationContext();
//
//        View overlayView = new View(context);
//        windowManager.removeView(overlayView);
//    }
//    private ReactInstanceManager reactInstanceManager;
//
//    @ReactMethod
//    public void show2() {
//        ReactApplicationContext context = getReactApplicationContext();
//        Activity currentActivity = context.getCurrentActivity();
//
//        windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
//
//        params = new WindowManager.LayoutParams(
//                WindowManager.LayoutParams.MATCH_PARENT,
//                WindowManager.LayoutParams.MATCH_PARENT,
//                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
//                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
//                PixelFormat.TRANSLUCENT
//        );
//
//        params.gravity = Gravity.TOP | Gravity.LEFT;
//
//        reactInstanceManager = ReactInstanceManager.builder()
//                .setApplication(currentActivity.getApplication())
//                .setCurrentActivity(currentActivity)
//                .setBundleAssetName("index.android.bundle")
//                .setJSMainModulePath("index")
//                .addPackage(new MainReactPackage())
//                .setUseDeveloperSupport(BuildConfig.DEBUG)
//                .setInitialLifecycleState(LifecycleState.RESUMED)
//                .build();
//
//        reactRootView = new ReactRootView(context);
//        reactRootView.startReactApplication(
//                reactInstanceManager,
//                "modalComp",
//                null
//        );
//
//        windowManager.addView(reactRootView, params);
//    }
//
//








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
