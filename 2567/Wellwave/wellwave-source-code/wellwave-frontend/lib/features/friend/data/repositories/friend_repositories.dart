import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:wellwave_frontend/features/friend/data/models/all_friends_request_model.dart';
import 'package:wellwave_frontend/features/friend/data/models/friend_request_model.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const _secureStorage = FlutterSecureStorage();

class FriendRepositories {
  Future<FriendRequestModel?> getUserById(int uid) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final url = '$baseUrl/friend/search/$uid';
      debugPrint('Calling API: $url'); // Debug log

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      debugPrint('Response status: ${response.statusCode}'); // Debug log
      debugPrint('Response body: ${response.body}'); // Debug log

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return FriendRequestModel.fromJson(jsonData);
      } else {
        debugPrint('Error response: ${response.body}'); // Debug log
        return null;
      }
    } catch (e) {
      debugPrint('Error in getUserById: $e'); // Debug log
      throw Exception('Failed to get user: $e');
    }
  }

  Future<FriendRequestModel?> addFriend(int uid) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final url = '$baseUrl/friend/add/$uid';
      debugPrint('Calling API URL: $url');

      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      debugPrint('Response status: ${response.statusCode}');
      debugPrint('Response body: ${response.body}');

      switch (response.statusCode) {
        case 200:
          final jsonData = jsonDecode(response.body);
          return FriendRequestModel.fromJson({'userInfo': jsonData});

        default:
          throw Exception('Failed to add user by ID: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error caught in addUser: $e');
    }
  }

  Future<AllFriendsRequestModel?> getUserFriends() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      const url = '$baseUrl/friend/user-friends';
      debugPrint('Calling API URL: $url');

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      debugPrint('Response getUserFriends: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return AllFriendsRequestModel.fromJson(jsonData);
      } else {
        throw Exception('Failed to get user friends: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error caught in getUserFriends: $e');
    }
  }

  Future<FriendRequestModel?> unFriend(int uid) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final url = '$baseUrl/friend/unfriend/$uid';
      // debugPrint('Calling API URL: $url');

      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      // debugPrint('Response status: ${response.statusCode}');
      // debugPrint('Response body: ${response.body}');

      switch (response.statusCode) {
        case 200:
          final jsonData = jsonDecode(response.body);
          return FriendRequestModel.fromJson({'userInfo': jsonData});

        default:
          throw Exception('Failed to unfriend user id: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error caught in unfriend: $e');
    }
  }

  Future<FriendRequestModel?> getFriendProfile(
    int uid, {
    DateTime? fromDate,
    DateTime? toDate,
  }) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      var url = '$baseUrl/friend/friend-profile/$uid';

      if (fromDate != null && toDate != null) {
        final queryParams = {
          'stepFromDate': fromDate.toIso8601String().split('T')[0],
          'stepToDate': toDate.toIso8601String().split('T')[0],
          'sleepFromDate': fromDate.toIso8601String().split('T')[0],
          'sleepToDate': toDate.toIso8601String().split('T')[0],
        };

        final queryString = Uri(queryParameters: queryParams).query;
        url = '$url?$queryString';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      debugPrint('Response friends: ${response.body}');

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return FriendRequestModel.fromJson(jsonData);
      }
      return null;
    } catch (e) {
      throw Exception('Error caught in getFriendProfile: $e');
    }
  }

  Future<void> sendWaveNotification(String uid) async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) {
      throw Exception("No access token found");
    }

    try {
      final url = '$baseUrl/friend/send-noti/$uid';

      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );
      debugPrint('Response body: ${response.body}');
      if (response.statusCode != 201) {
        throw Exception(
            'Failed to send wave notification: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error sending wave notification: $e');
      throw Exception('Error caught in sendWaveNotification: $e');
    }
  }
}
