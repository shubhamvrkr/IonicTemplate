package com.psl.cordova.alarmservice;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.BroadcastReceiver;  
import android.content.Context;
import android.widget.Toast;
import android.os.Bundle;   
import android.app.PendingIntent;  
import java.lang.Exception;
import android.content.Intent;
import org.apache.cordova.PluginResult;
import android.content.pm.PackageManager;
import android.util.Log;
import java.util.Calendar;
import android.util.Log;
import android.os.Bundle;


public class AlarmManager extends CordovaPlugin {

	public static CallbackContext callbackContext;
	public static boolean flag = false;
	
    public AlarmManager() {

    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("startAlarm".equals(action)) {
		
			AlarmManager.callbackContext = callbackContext;
			AlarmManager.flag = true;
            this.startAlarm(args.getString(0),args.getString(1));
		
        }else{
            return false;
        }
        return true;
    }

    public void startAlarm(String hrs,String mins){
	
		try{
		
			Log.v("TAG", String.valueOf(flag));
			Context context = this.cordova.getActivity().getApplicationContext();
			int i = Integer.parseInt(hrs);
			int j = Integer.parseInt(mins);
			Intent intent = new Intent(context, MyBroadcastReceiver.class);
			PendingIntent pendingIntent = PendingIntent.getBroadcast(  
										  context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);  
			android.app.AlarmManager alarmManager = (android.app.AlarmManager) context.getSystemService(context.ALARM_SERVICE);
			
			//set the time to user defined
			Calendar sixCalendar = Calendar.getInstance();
			sixCalendar.set(Calendar.HOUR_OF_DAY, i);
			sixCalendar.set(Calendar.MINUTE,j);
			sixCalendar.set(Calendar.SECOND, 0);

			
			alarmManager.setRepeating(android.app.AlarmManager.RTC_WAKEUP, sixCalendar.getTimeInMillis(),android.app.AlarmManager.INTERVAL_DAY,pendingIntent);									  
			//Toast.makeText(context, "Started alarm service....", Toast.LENGTH_LONG).show();
			PluginResult result = new PluginResult(PluginResult.Status.OK,"{\"status\":1}");
			result.setKeepCallback(true);									  
			AlarmManager.callbackContext.sendPluginResult(result);
		
		}catch(Exception e){
		
			PluginResult result = new PluginResult(PluginResult.Status.ERROR,"{\"status\":0,\"err\":"+e.getMessage()+"}");
			result.setKeepCallback(true);
			AlarmManager.callbackContext.sendPluginResult(result);
		}
		
    }	
}
