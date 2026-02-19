// import 'package:flutter_local_notifications/flutter_local_notifications.dart';
// import 'package:timezone/timezone.dart' as tz;
// import 'package:timezone/data/latest.dart' as tz;
// import 'package:flutter/material.dart';
// import 'package:firebase_messaging/firebase_messaging.dart';

// class NotificationService {
//   static final NotificationService _instance = NotificationService._();
//   factory NotificationService() => _instance;
//   NotificationService._();

//   final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
//       FlutterLocalNotificationsPlugin();
//   final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

//   Future<void> initializeNotifications() async {
//     try {
//       tz.initializeTimeZones();
//       tz.setLocalLocation(tz.getLocation('Asia/Bangkok'));

//       // Log timezone information
//       final now = tz.TZDateTime.now(tz.local);
//       debugPrint('Current local time: $now');
//       debugPrint('Current timezone: ${tz.local}');

//       // Request permissions explicitly
//       final NotificationSettings settings =
//           await _firebaseMessaging.requestPermission(
//         alert: true,
//         badge: true,
//         sound: true,
//       );
//       debugPrint(
//           'Firebase notification settings: ${settings.authorizationStatus}');

//       // Rest of your initialization code...
//     } catch (e) {
//       debugPrint('Error initializing notifications: $e');
//       rethrow; // Rethrow to catch in the UI layer
//     }
//   }

//   Future<void> scheduleBedtimeNotifications({
//     required String bedtime,
//     required Map<String, bool> weekdays,
//   }) async {
//     try {
//       // Cancel all existing notifications
//       await flutterLocalNotificationsPlugin.cancelAll();

//       final List<String> timeParts = bedtime.split(':');
//       final int hour = int.parse(timeParts[0]);
//       final int minute = int.parse(timeParts[1]);

//       // Log the scheduling attempt
//       debugPrint('Attempting to schedule for $hour:$minute');

//       final Map<String, int> dayToNumber = {
//         'Sunday': DateTime.sunday,
//         'Monday': DateTime.monday,
//         'Tuesday': DateTime.tuesday,
//         'Wednesday': DateTime.wednesday,
//         'Thursday': DateTime.thursday,
//         'Friday': DateTime.friday,
//         'Saturday': DateTime.saturday,
//       };

//       const AndroidNotificationDetails androidDetails =
//           AndroidNotificationDetails(
//         'bedtime_reminder_channel',
//         'Bedtime Reminders',
//         channelDescription: 'Daily bedtime reminder notifications',
//         importance: Importance.max,
//         priority: Priority.max,
//         fullScreenIntent: true,
//         category: AndroidNotificationCategory.alarm,
//         visibility: NotificationVisibility.public,
//         autoCancel: true,
//         playSound: true,
//         enableLights: true,
//         enableVibration: true,
//         styleInformation: BigTextStyleInformation(''),
//       );

//       const NotificationDetails notificationDetails =
//           NotificationDetails(android: androidDetails);

//       for (var entry in weekdays.entries) {
//         if (entry.value) {
//           final int dayNumber = dayToNumber[entry.key]!;
//           final tz.TZDateTime scheduledDate =
//               _nextInstanceOfTime(hour, minute, dayNumber);

//           debugPrint('Scheduling for ${entry.key} at $scheduledDate');

//           // Create a unique ID for each day's notification
//           final int notificationId = dayNumber * 1000 + (hour * 60 + minute);

//           await flutterLocalNotificationsPlugin.zonedSchedule(
//             notificationId,
//             'Bedtime Reminder',
//             'It\'s ${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')} - Time for bed!',
//             scheduledDate,
//             notificationDetails,
//             androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
//             uiLocalNotificationDateInterpretation:
//                 UILocalNotificationDateInterpretation.absoluteTime,
//             matchDateTimeComponents: DateTimeComponents.dayOfWeekAndTime,
//             payload: 'bedtime_reminder_${entry.key.toLowerCase()}',
//           );

//           // Check if this notification is scheduled for the next minute
//           final now = tz.TZDateTime.now(tz.local);
//           if (scheduledDate.difference(now).inMinutes <= 1) {
//             debugPrint(
//                 'Scheduling immediate test notification for upcoming bedtime');
//             await showImmediateNotification(
//               'Bedtime Soon',
//               'Your bedtime (${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}) is approaching!',
//             );
//           }
//         }
//       }

//       // Verify scheduled notifications
//       final pendingNotifications =
//           await flutterLocalNotificationsPlugin.pendingNotificationRequests();
//       debugPrint('Scheduled notifications: ${pendingNotifications.length}');
//       for (var notification in pendingNotifications) {
//         debugPrint('Scheduled: ${notification.title} at ID ${notification.id}');
//       }
//     } catch (e) {
//       debugPrint('Error scheduling notifications: $e');
//       rethrow;
//     }
//   }

//   Future<void> showImmediateNotification(String title, String body) async {
//     const AndroidNotificationDetails androidDetails =
//         AndroidNotificationDetails(
//       'bedtime_reminder_channel',
//       'Bedtime Reminders',
//       channelDescription: 'Immediate bedtime notifications',
//       importance: Importance.max,
//       priority: Priority.max,
//       playSound: true,
//       enableLights: true,
//       enableVibration: true,
//     );

//     const NotificationDetails platformDetails =
//         NotificationDetails(android: androidDetails);

//     await flutterLocalNotificationsPlugin.show(
//       DateTime.now().millisecond, // Random ID
//       title,
//       body,
//       platformDetails,
//     );
//   }

//   tz.TZDateTime _nextInstanceOfTime(int hour, int minute, int dayOfWeek) {
//     final tz.TZDateTime now = tz.TZDateTime.now(tz.local);

//     tz.TZDateTime scheduledDate = tz.TZDateTime(
//       tz.local,
//       now.year,
//       now.month,
//       now.day,
//       hour,
//       minute,
//     );

//     if (scheduledDate.isBefore(now)) {
//       scheduledDate = scheduledDate.add(const Duration(days: 1));
//     }

//     while (scheduledDate.weekday != dayOfWeek) {
//       scheduledDate = scheduledDate.add(const Duration(days: 1));
//     }

//     debugPrint('Next occurrence for $dayOfWeek: ${scheduledDate.toString()}');
//     return scheduledDate;
//   }
// }
