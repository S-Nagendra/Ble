package com.bluetoothlowenergy;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import android.util.Log;
import android.content.Intent;
import java.util.Calendar;

public class CalendarModule extends ReactContextBaseJavaModule {
    CalendarModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "CalendarModule";
    }

    @ReactMethod
    public void createCalendarEvent(String name, String location) {
        Log.d("CalendarModule", "Create event called with name: " + name
                + " and location: " + location);
        ReactApplicationContext context = getReactApplicationContext();
        Intent i = new Intent(Intent.ACTION_EDIT);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Calendar calendarEvent = Calendar.getInstance();
        i.setType("vnd.android.cursor.item/event");
        i.putExtra("allDay", false);
        i.putExtra("rule", "FREQ=YEARLY");
        i.putExtra("beginTime", calendarEvent.getTimeInMillis());
        i.putExtra("endTime", calendarEvent.getTimeInMillis() + 60 * 60 * 1000);
        i.putExtra("title", name);
        i.putExtra("eventLocation", location);
        context.startActivity(i);
    }
}