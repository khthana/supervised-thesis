import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/mission/data/models/active_habit_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/daily_task_list_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/get_daily_habit_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/get_history_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_track_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/quest_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/stats_request_model.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/profile_repositories.dart';
import '../../../../config/constants/app_url.dart';

const _secureStorage = FlutterSecureStorage();
String userID = '$AppStrings.uid';

extension GemUpdater on ProfileRepositories {
  static final _secureStorage = const FlutterSecureStorage();
  static const _tokenKey = 'access_token';

  Future<bool> updateGem(int addOn) async {
    try {
      final token = await _secureStorage.read(key: _tokenKey);
      final uid = await _secureStorage.read(key: 'user_uid');

      if (token == null || uid == null) {
        debugPrint('Missing token or user ID');
        return false;
      }

      final url = Uri.parse('$baseUrl/users/$uid');
      final getResponse = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (getResponse.statusCode == 200) {
        final json = jsonDecode(getResponse.body);
        final currentGems = json['GEM'] as int? ?? 0;
        final newTotal = currentGems + addOn;

        final patchResponse = await http.patch(
          url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
          body: jsonEncode({
            'GEM': newTotal,
          }),
        );

        return patchResponse.statusCode == 200;
      } else {
        debugPrint('Failed to get current gems: ${getResponse.statusCode}');
        debugPrint('Response body: ${getResponse.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Error updating gems: $e');
      return false;
    }
  }
}

class HabitRepositories {
  final _secureStorage = const FlutterSecureStorage();

  Future<HabitRequestModel?> getHabitAll({String? category}) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final queryParams = {
        'filter': 'all',
        if (category != null) 'category': category,
      };

      final uri =
          Uri.parse(baseUrl + '/habit').replace(queryParameters: queryParams);
      debugPrint('Calling API URL: $uri');

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return HabitRequestModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error: getHabitAll $e');
      return null;
    }
  }

  Future<QuestRequestModel?> getQuest() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    try {
      final response = await http.get(
        Uri.parse("$baseUrl/quest"),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      debugPrint('Start quest response status: ${response.statusCode}');
      debugPrint('Start quest response body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return QuestRequestModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error: getQuest $e');
      return null;
    }
  }

  Future<bool> startQuest(int questId) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      debugPrint('No access token found');
      throw Exception("No access token found");
    }

    try {
      final response = await http.post(
        Uri.parse("$baseUrl/quest/start/$questId"),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      return response.statusCode == 201;
    } catch (e) {
      debugPrint('Error starting quest: $e');
      return false;
    }
  }

  Future<bool> startHabit({
    required int hid,
    required int daysGoal,
    int? dailyMinuteGoal,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      debugPrint('No access token found');
      throw Exception("No access token found");
    }

    try {
      final Map<String, dynamic> requestBody = {
        'HID': hid,
        'DAYS_GOAL': daysGoal,
      };

      if (dailyMinuteGoal != null && dailyMinuteGoal > 0) {
        requestBody['DAILY_MINUTE_GOAL'] = dailyMinuteGoal;
      }

      debugPrint('Sending request body: $requestBody');

      final response = await http.post(
        Uri.parse("$baseUrl/habit/challenge"),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(requestBody),
      );

      return response.statusCode == 201;
    } catch (e) {
      debugPrint('Error starting habit: $e');
      return false;
    }
  }

  Future<DailyTaskListModel?> getDaily() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final uri = Uri.parse("$baseUrl/habit/daily");
      debugPrint('Calling Daily Tasks API: $uri');

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return DailyTaskListModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting daily tasks: $e');
      return null;
    }
  }

  Future<GetDailyHabitModel?> getHabitDailyTask({String? category}) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final now = DateTime.now();
      final tomorrow = now.add(const Duration(days: 1));

      final startDate =
          "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";
      final endDate =
          "${tomorrow.year}-${tomorrow.month.toString().padLeft(2, '0')}-${tomorrow.day.toString().padLeft(2, '0')}";

      final uri = Uri.parse(baseUrl +
          '/habit/user?isDaily=true&startDate=$startDate&endDate=$endDate');
      debugPrint('Calling API URL: $uri');

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return GetDailyHabitModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error: getHabitDailyTask $e');
      return null;
    }
  }

  Future<GetHistoryModel?> getHistory(DateTime date) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final formattedDate =
          "${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}";

      final queryParams = {
        'date': formattedDate,
      };

      final uri = Uri.parse("$baseUrl/habit/history")
          .replace(queryParameters: queryParams);
      debugPrint('Calling History API: $uri');

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return GetHistoryModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting history: $e');
      return null;
    }
  }

  Future<HabitTrackRequestModel?> postDailyTrack({
    required int challengeId,
    int? durationMinutes,
    required String trackDate,
    required bool completed,
    String? moodFeedback,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final uri = Uri.parse("$baseUrl/habit/track");
      debugPrint('Calling Daily Tasks API: $uri');

      final Map<String, dynamic> requestBody = {
        'CHALLENGE_ID': challengeId,
        'DURATION_MINUTES': durationMinutes,
        'TRACK_DATE': trackDate,
        'COMPLETED': completed,
        'MOOD_FEEDBACK': moodFeedback,
      };

      debugPrint('Sending request body: $requestBody');
      final response = await http.post(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(requestBody),
      );

      debugPrint('post  Status: ${response.statusCode}');
      debugPrint(' Response Body: ${response.body}');

      if (response.statusCode == 201) {
        final jsonData = jsonDecode(response.body);
        return HabitTrackRequestModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting daily tasks: $e');
      return null;
    }
  }

  Future<HabitTrackRequestModel?> patchDailyTrack({
    required int trackId,
    String? moodFeedback,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final uri = Uri.parse("$baseUrl/habit/track");
      debugPrint('Calling Daily Tasks API: $uri');

      final Map<String, dynamic> requestBody = {
        'TRACK_ID': trackId,
        'MOOD_FEEDBACK': moodFeedback,
      };

      debugPrint('Sending request body: $requestBody');
      final response = await http.patch(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(requestBody),
      );

      debugPrint('Update mood Status: ${response.statusCode}');
      debugPrint(' Response Body: ${response.body}');

      if (response.statusCode == 201) {
        final jsonData = jsonDecode(response.body);
        return HabitTrackRequestModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting daily tasks: $e');
      return null;
    }
  }

  Future<StatsRequestModel?> getStat(int challengeId) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }
    try {
      final response = await http.get(
        Uri.parse("$baseUrl/habit/stats/$challengeId"),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      debugPrint('Response Status: ${response.statusCode}');
      debugPrint('getStat Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return StatsRequestModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error: getStat $e');
      return null;
    }
  }

  Future<ActiveHabitModel?> getActiveHabit() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final response = await http.get(
        Uri.parse("$baseUrl/habit/user?status=active"),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return ActiveHabitModel.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      debugPrint('Error getting active habit: $e');
      return null;
    }
  }
}
