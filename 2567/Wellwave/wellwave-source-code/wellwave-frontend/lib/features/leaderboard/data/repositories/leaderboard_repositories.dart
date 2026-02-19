import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:wellwave_frontend/features/leaderboard/data/models/leaderboard_request_model.dart';
import 'package:http/http.dart' as http;
import '../../../../config/constants/app_url.dart';

class LeaderboardRepositories {
  final _secureStorage = const FlutterSecureStorage();

  Future<LeaderboardRequestModel?> getUserBoard() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final response = await http.get(
        Uri.parse("$baseUrl/users/leaderboard"),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      debugPrint('Response status: ${response.statusCode}');
      debugPrint('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return LeaderboardRequestModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      debugPrint('Error: $e');
      return null;
    }
  }
}
