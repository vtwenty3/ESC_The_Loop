package expo.modules.usagestats

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.PowerManager
import expo.modules.kotlin.Promise
import java.util.Calendar

class UsageStatsModule : Module() {
  private var lastKnownActivity: String? = null

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('UsageStats')` in JavaScript.
    Name("UsageStats")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello bradar 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    AsyncFunction("currentActivity") { promise: Promise ->
      try {
        val context = appContext.reactContext
        val powerManager = context?.getSystemService(Context.POWER_SERVICE) as PowerManager
        val usageStatsManager = context?.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        val calendar = Calendar.getInstance()
        calendar.add(Calendar.MINUTE, -1)
        val endTime = System.currentTimeMillis()
        val startTime = calendar.timeInMillis

        val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
        var currentActivity: String? = null
        val event = UsageEvents.Event()

        while (usageEvents.hasNextEvent()) {
          usageEvents.getNextEvent(event)
          if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
            currentActivity = event.packageName
            lastKnownActivity = currentActivity
          }
        }

        if (powerManager.isInteractive) {
          if (currentActivity != null) {
            promise.resolve(currentActivity)
          } else {
            promise.resolve(lastKnownActivity)
          }
        } else {
          promise.resolve("Screen Off!")
        }

      } catch (e: Exception) {
        promise.reject("ACTIVITY_ERROR", "Failed to get current activity", e)
      }
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(UsageStatsView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: UsageStatsView, prop: String ->
        println(prop)
      }
    }
  }
}
