import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:wellwave_frontend/features/notification/data/models/drink_plan_notification_response_model.dart';
import 'package:wellwave_frontend/features/notification/data/models/drink_range_notification_response_model.dart';
import 'package:wellwave_frontend/features/notification/data/models/mission_notification_request_model.dart';
import 'package:wellwave_frontend/features/notification/data/models/sleep_notification_response_model.dart';

import '../../../../config/constants/app_url.dart';

class NotificationSettingRepository {
  final _secureStorage = const FlutterSecureStorage();

  Future<bool> createBedSetting({
    required int uid,
    required bool isActive,
    required String bedtime,
    required Map<String, bool> weekdays,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    final body = {
      "UID": uid,
      "IS_ACTIVE": isActive,
      "BEDTIME": bedtime,
      "WEEKDAYS": weekdays,
    };

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/noti-setting/set-bed-time'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 201) {
        debugPrint(
            'Bedtime setting created successfully for $uid, $isActive, $bedtime,$weekdays');
        return true;
      } else {
        debugPrint('Failed to update bedtime setting: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      debugPrint('Error updating bedtime setting: $error');
      return false;
    }
  }

  Future<SleepNotificationResponseModel?> fetchBedSetting() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/noti-setting/get-noti/BEDTIME'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);

        final isActive = jsonData['IS_ACTIVE'];
        final bedtimeSettings = jsonData['bedtimeSettings'];

        if (bedtimeSettings != null) {
          final bedtime = bedtimeSettings['BEDTIME'];
          final weekdays =
              Map<String, bool>.from(bedtimeSettings['WEEKDAYS'] ?? {});

          // debugPrint(
          //     'Fetched Data: isActive = $isActive, bedtime = $bedtime, weekdays = $weekdays');

          return SleepNotificationResponseModel(
            isActive: isActive,
            setting: SettingDetail(
              bedtime: bedtime,
              weekdays: weekdays,
            ),
          );
        } else {
          debugPrint('Error: bedtimeSettings was null');
        }
      } else {
        debugPrint(
            'Error: Server returned non-200 status code: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error: $e');
    }
    return null;
  }

  Future<bool> updateBedSetting({
    required int uid,
    required bool isActive,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    final body = {
      "UID": uid,
      "IS_ACTIVE": isActive,
    };

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/noti-setting/set-bed-time'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 201) {
        debugPrint('Bedtime setting created successfully for $uid, $isActive');
        return true;
      } else {
        debugPrint('Failed to update bedtime setting: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      debugPrint('Error updating bedtime setting: $error');
      return false;
    }
  }

  Future<bool> createDrinkPlanSetting({
    required int uid,
    required int glassNumber,
    required String notitime,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    final body = {
      "UID": uid,
      "GLASS_NUMBER": glassNumber,
      "NOTI_TIME": notitime
    };

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/noti-setting/set-water-plan'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 201) {
        debugPrint(
            'Drink plan setting created successfully for $uid, $notitime, $glassNumber');
        return true;
      } else {
        debugPrint(
            'Failed to create Drink plan  setting: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      debugPrint('Error create Drink plan  setting: $error');
      return false;
    }
  }

  Future<DrinkPlanNotificationResponseModel?> fetchDrinkPlanSetting() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/noti-setting/get-noti/WATER_PLAN'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);

        final isActive = jsonData['IS_ACTIVE'] as bool? ?? false;

        if (isActive) {
          final settings = jsonData['waterPlanSetting'] as List<dynamic>?;

          if (settings != null) {
            final settingDetails = settings
                .map((e) =>
                    DrinkSettingDetail.fromJson(e as Map<String, dynamic>))
                .toList();

            // debugPrint('repo Fetched Data: isActive = $isActive');
            for (var setting in settingDetails) {
              debugPrint('Setting Detail: ${setting.toJson()}');
            }

            return DrinkPlanNotificationResponseModel(
              settingType: jsonData['settingType'] ?? 'WATER_PLAN',
              isActive: isActive,
              setting: settingDetails,
            );
          } else {
            debugPrint('No settings found in response.');
          }
        } else {
          debugPrint('IS_ACTIVE was false.');
        }
      } else {
        debugPrint(
            'Error: Server returned non-200 status code: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error: $e');
    }
    return null;
  }

  Future<bool> updateDrinkPlanSetting({
    required int uid,
    required bool isActive,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    final body = {
      "UID": uid,
      "IS_ACTIVE": isActive,
    };

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/noti-setting/set-water-plan'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 201) {
        debugPrint(
            'DrinkPlan setting created successfully for $uid, $isActive');
        return true;
      } else {
        debugPrint(
            'Failed to update DrinkPlan setting: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      debugPrint('Error updating DrinkPlan setting: $error');
      return false;
    }
  }

  Future<bool> createDrinkRangeSetting({
    required int uid,
    required String startTime,
    required String endTime,
    required int intervalMinute,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    final body = {
      "UID": uid,
      "START_TIME": startTime,
      "END_TIME": endTime,
      "INTERVAL_MINUTES": intervalMinute
    };

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/noti-setting/set-water-range'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 201) {
        debugPrint(
            'Drink Range setting created successfully for $uid, $startTime, $endTime , $intervalMinute');
        return true;
      } else {
        debugPrint(
            'Failed to create Drink Range  setting: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      debugPrint('Error create Drink Range  setting: $error');
      return false;
    }
  }

  Future<DrinkRangeNotificationResponseModel?> fetchDrinkRangeSetting() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/noti-setting/get-noti/WATER_RANGE'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);

        final isActive = jsonData['IS_ACTIVE'];

        final startTime = jsonData['waterRangeSettings'] != null
            ? jsonData['waterRangeSettings']['START_TIME']
            : null;
        final endTime = jsonData['waterRangeSettings'] != null
            ? jsonData['waterRangeSettings']['END_TIME']
            : null;

        final intervalMinute = jsonData['waterRangeSettings'] != null
            ? jsonData['waterRangeSettings']['INTERVAL_MINUTES']
            : null;

        // debugPrint(
        //     'Fetched Data: isActive = $isActive, $startTime, $endTime , $intervalMinute');

        return DrinkRangeNotificationResponseModel(
          isActive: isActive,
          setting: DrinkRangeSettingDetail(
              startTime: startTime,
              endTime: endTime,
              intervalMinute: intervalMinute),
        );
      } else {
        debugPrint(
            'Error: Server returned non-200 status code: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error: $e');
    }
    return null;
  }

  Future<bool> updateDrinkRangeSetting({
    required int uid,
    required bool isActive,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    final body = {
      "UID": uid,
      "IS_ACTIVE": isActive,
    };

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/noti-setting/set-water-range'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      // debugPrint('Response Body: ${response.body}');
      // debugPrint('Payload: ${jsonEncode(body)}');

      if (response.statusCode == 201) {
        debugPrint(
            'Drink Range setting created successfully for $uid, $isActive');
        return true;
      } else {
        debugPrint(
            'Failed to update Drink Rangesetting: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      debugPrint('Error updating Drink Range setting: $error');
      return false;
    }
  }

  //mission
  Future<List<MissionNotificationModel>> fetchMissionSetting() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/habit/user'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      debugPrint('Fetching from URL: $baseUrl/habit/user');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        final challenges = jsonData['data'] as List;

        final missions = challenges
            .map((challenge) => MissionNotificationModel.fromJson(challenge))
            .toList();

        debugPrint('Fetched ${missions.length} missions:');
        // for (var mission in missions) {
        //   debugPrint('Mission: challengeId = ${mission.challengeId}, '
        //       'title = ${mission.title}, '
        //       'isNotificationEnabled = ${mission.isNotificationEnabled}, '
        //       'weekdaysNoti = ${mission.weekdaysNoti}');
        // }

        return missions;
      } else {
        debugPrint(
            'Error: Server returned non-200 status code: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      debugPrint('Error: $e');
      return [];
    }
  }

  Future<bool> createMissionSetting({
    required int challengeId,
    required bool isNotificationEnabled,
    required String notiTime,
    required Map<String, bool> weekdaysNoti,
    String? title,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    final body = {
      "CHALLENGE_ID": challengeId,
      "IS_NOTIFICATION_ENABLED": isNotificationEnabled,
      "NOTI_TIME": notiTime,
      "WEEKDAYS_NOTI": weekdaysNoti,
    };

    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/habit/noti-set'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        // debugPrint(
        //     'Mission setting created successfully for $challengeId, $isNotificationEnabled, $notiTime,$weekdaysNoti');
        return true;
      } else {
        debugPrint('Failed to update Mission setting: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      debugPrint('Error updating Mission setting: $error');
      return false;
    }
  }

  Future<bool> updateMissionSetting({
    required int challengeId,
    required bool isNotificationEnabled,
    required String notiTime,
    required Map<String, bool> weekdaysNoti,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    // Ensure notiTime is in HH:mm format
    final formattedNotiTime = notiTime.substring(0, 5); // Extract HH:mm

    final body = {
      "CHALLENGE_ID": challengeId,
      "IS_NOTIFICATION_ENABLED": isNotificationEnabled,
      "NOTI_TIME": formattedNotiTime,
      "WEEKDAYS_NOTI": weekdaysNoti,
    };

    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/habit/noti-set'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        // debugPrint(
        //     '✅ Mission setting updated successfully for $challengeId, $isNotificationEnabled');
        return true;
      } else {
        debugPrint(
            '❌ Failed to update Mission setting: ${response.statusCode}');
        debugPrint('Response body: ${response.body}');
        return false;
      }
    } catch (error) {
      debugPrint('❌ Error updating mission setting: $error');
      return false;
    }
  }
}
