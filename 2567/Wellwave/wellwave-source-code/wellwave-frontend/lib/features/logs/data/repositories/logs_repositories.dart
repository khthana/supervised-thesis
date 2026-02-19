import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:wellwave_frontend/features/logs/data/models/logs_request_model_waistline.dart';
import 'package:wellwave_frontend/features/logs/data/models/logs_request_model_weekly.dart';
import 'package:wellwave_frontend/features/logs/data/models/logs_request_model_weight.dart';
import '../../../../config/constants/app_strings.dart';
import '../../../../config/constants/app_url.dart';
import '../../../logs/data/models/logs_request_model.dart';
import '../models/logs_request_model_sleep.dart';
import '../models/logs_request_model_step.dart';
import '../models/logs_request_model_drink.dart';

class LogsRequestRepository {
  Future<bool> createLogsRequest({
    required int value,
    required String logName,
    required int uid,
    required String date,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/logs'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          "VALUE": value,
          "LOG_NAME": logName,
          "UID": uid,
          "DATE": date,
        }),
      );

      if (response.statusCode == 201) {
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error: $e');
      return false;
    }
  }

  Future<bool> editLogsRequest({
    required int uid,
    required int value,
    required String logName,
    required String date,
  }) async {
    try {
      final response = await http.patch(
        Uri.parse("$baseUrl/logs/$uid/$logName/$date"),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          "VALUE": value,
        }),
      );

      debugPrint(
          'Edit Log Response: ${response.statusCode}, Body: ${response.body}');

      if (response.statusCode == 200) {
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error: $e');
      return false;
    }
  }

  Future<bool> logExists({
    required String logName,
    required int uid,
    required String date,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/logs/$uid/$logName/$date'),
      );

      debugPrint(
          'be Log Exists Check Response: ${response.statusCode}, Body: ${response.body}');

      if (response.statusCode == 200) {
        return true;
      } else if (response.statusCode == 404) {
        return false;
      }
      return false;
    } catch (e) {
      debugPrint('Error checking log existence: $e');
      return false;
    }
  }

  Future<List<LogsRequestModel?>> getLogsById(String uID, DateTime date) async {
    try {
      final response = await http.get(
        Uri.parse(
            "$baseUrl/logs/user/$uID?startDate=${date.toIso8601String()}&&endDate=${date.toIso8601String()}"),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        List<dynamic> logsJson = jsonData['LOGS'];

        return logsJson.map((log) => LogsRequestModel.fromJson(log)).toList();
      }
      return [];
    } catch (e) {
      debugPrint('Error: $e');
      return [];
    }
  }

  Future<List<LogsWeeklyRequestModel?>> getWeeklyLogs(
      String uID, DateTime date) async {
    try {
      final response = await http.get(
        Uri.parse(
          "$baseUrl/logs/userWeekly/$uID?date=${date.toIso8601String()}",
        ),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        List<dynamic> logsJson = jsonData['LOGS'];

        return logsJson
            .map((log) => LogsWeeklyRequestModel.fromJson(log))
            .toList();
      }
      return [];
    } catch (e) {
      debugPrint('Error: $e');
      return [];
    }
  }

  Future<List<T>> _fetchLogs<T>({
    required String uID,
    required DateTime today,
    required String logName,
    required T Function(Map<String, dynamic>) fromJson,
  }) async {
    try {
      List<T> logsList = [];

      for (int i = 0; i < 12; i++) {
        final DateTime targetDate = today.subtract(Duration(days: i * 7));
        final response = await http.get(
          Uri.parse(
            '$baseUrl/logs/userWeekly/$uID?date=${targetDate.toIso8601String()}&&logName=$logName',
          ),
          headers: {'Content-Type': 'application/json'},
        );
        if (response.statusCode == 200) {
          final jsonData = jsonDecode(response.body);
          List<dynamic> logsJson = jsonData['LOGS'];
          logsList.addAll(logsJson.map((log) => fromJson(log)).toList());
        }
      }
      return logsList;
    } catch (e) {
      debugPrint('Error fetching logs: $e');
      return [];
    }
  }

  Future<List<LogsWeightRequestModel>> getWeightLogs(
      String uID, DateTime today) {
    return _fetchLogs(
      uID: uID,
      today: today,
      logName: AppStrings.weightLogText,
      fromJson: (json) => LogsWeightRequestModel.fromJson(json),
    );
  }

  Future<List<LogsWaistLineRequestModel>> getWaistLineLogs(
      String uID, DateTime today) {
    return _fetchLogs(
      uID: uID,
      today: today,
      logName: AppStrings.waistLineLogText,
      fromJson: (json) => LogsWaistLineRequestModel.fromJson(json),
    );
  }

  Future<List<LogsDrinkRequestModel>> getDrinkLogs(String uID, DateTime today) {
    return _fetchLogs(
      uID: uID,
      today: today,
      logName: AppStrings.drinkLogText,
      fromJson: (json) => LogsDrinkRequestModel.fromJson(json),
    );
  }

  Future<List<LogsStepRequestModel>> getStepLogs(String uID, DateTime today) {
    return _fetchLogs(
      uID: uID,
      today: today,
      logName: AppStrings.stepLogText,
      fromJson: (json) => LogsStepRequestModel.fromJson(json),
    );
  }

  Future<List<LogsSleepRequestModel>> getSleepLogs(String uID, DateTime today) {
    return _fetchLogs(
      uID: uID,
      today: today,
      logName: AppStrings.sleepLogText,
      fromJson: (json) => LogsSleepRequestModel.fromJson(json),
    );
  }
}
