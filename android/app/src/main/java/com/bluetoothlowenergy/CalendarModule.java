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
import java.text.SimpleDateFormat;
import com.facebook.react.bridge.ReadableMap;
import java.util.Date;
import java.text.DateFormat;
import java.time.LocalDate;
import java.util.TimeZone;

public class CalendarModule extends ReactContextBaseJavaModule {
    CalendarModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "CalendarModule";
    }

    @ReactMethod
    public void createCalendarEvent(ReadableMap readableMap, Boolean allDay) {
        Log.i("Calendar Module", readableMap.toString());
        //you can decode it here like:
        String title = readableMap.getString("title");
        String location = readableMap.getString("location");
        String dateStarts = readableMap.getString("startDate");
        String dateEnds = readableMap.getString("endDate");

        Log.d("CalendarModule-Title", title);
        Log.d("CalendarModule-Location", location);
        Log.d("CalendarModule-StartDate", dateStarts);
        Log.d("CalendarModule-EndDate", dateEnds);
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        Calendar calendar = Calendar.getInstance();
        ReactApplicationContext context = getReactApplicationContext();
        Intent i = new Intent(Intent.ACTION_EDIT);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.setType("vnd.android.cursor.item/event");
        i.putExtra("allDay", allDay);
        i.putExtra("rule", "FREQ=YEARLY");
        i.putExtra("beginTime", calendar.getTimeInMillis());
        i.putExtra("endTime", calendar.getTimeInMillis() + 60 * 60 * 1000);
        i.putExtra("title", title);
        i.putExtra("eventLocation", location);
        context.startActivity(i);
    }
}