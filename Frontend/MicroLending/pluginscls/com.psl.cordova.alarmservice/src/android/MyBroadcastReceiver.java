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
import android.app.Notification;
import android.app.NotificationManager;
import android.support.v4.app.NotificationCompat;

public class MyBroadcastReceiver extends BroadcastReceiver {  
    
		@Override  
		public void onReceive(Context context, Intent intent) {  
		   
		   try{
		   
				Log.v("TAG", "trying to send");
				Log.v("TAG", String.valueOf(AlarmManager.flag));
				if(AlarmManager.callbackContext!=null){
				
					PluginResult result = new PluginResult(PluginResult.Status.OK,"{\"status\":2}");
					result.setKeepCallback(true);
					AlarmManager.callbackContext.sendPluginResult(result);
					
				}else{
					
						String pakagename = context.getPackageName();
						Intent i = new Intent();
						i.setClassName(pakagename, pakagename+".MainActivity");
						i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
						PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, i,Intent.FLAG_ACTIVITY_NEW_TASK);
						Notification myNotification = new NotificationCompat.Builder(context)
										 .setContentTitle("Ethereum Resource Lending")
										 .setContentText("Some contracts and about to expire..Click to view them!!")
									     .setContentIntent(pendingIntent)
									     .setDefaults(Notification.DEFAULT_SOUND)
									     .setAutoCancel(false)
									     .setSmallIcon(android.R.drawable.ic_menu_save)
									     .build();
	 
						NotificationManager notificationManager = (NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
						notificationManager.notify(1, myNotification);
						 
				}
				
		   
		   }catch(Exception e){
		   
				Log.v("ERROR", e.getMessage());
				
		   
		   }
			
		}
		
}	

