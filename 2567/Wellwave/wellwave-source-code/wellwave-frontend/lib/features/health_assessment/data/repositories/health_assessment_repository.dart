import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_health_data_request_model.dart';
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_personal_data_request_model.dart';
import 'package:flutter/foundation.dart';

import '../../../../config/constants/app_url.dart';

class HealthAssessmentRepository {
  HealthAssessmentRepository();

  final _secureStorage = const FlutterSecureStorage();
  final _tokenKey = 'access_token';

  Future<String?> uploadImage(File imageFile, String uid) async {
    final token = await _secureStorage.read(key: _tokenKey);

    try {
      debugPrint('Uploading image for UID: $uid');

      // สร้างชื่อไฟล์ใหม่
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final filename = 'user-$timestamp-${imageFile.path.split('/').last}';

      final url = Uri.parse('$baseUrl/api/v1/upload-profile-image');

      var request = http.MultipartRequest('POST', url);
      request.headers['Authorization'] = 'Bearer $token';

      // เพิ่ม parameters ตามที่เซิร์ฟเวอร์ต้องการ
      request.fields['uid'] = uid;
      request.fields['filename'] = filename;

      var stream = http.ByteStream(imageFile.openRead());
      var length = await imageFile.length();

      var multipartFile = http.MultipartFile(
        'image',
        stream,
        length,
        filename: filename,
      );

      request.files.add(multipartFile);

      var response = await request.send();
      var responseData = await response.stream.bytesToString();
      var jsonResponse = jsonDecode(responseData);

      if (response.statusCode == 200) {
        debugPrint('Successfully got image URL: ${jsonResponse['imagePath']}');
        return jsonResponse['imagePath']; // รับ path จากเซิร์ฟเวอร์
      } else {
        debugPrint('Upload failed. Status: ${response.statusCode}');
        debugPrint('Response: $responseData');
        return null;
      }
    } catch (e, stackTrace) {
      debugPrint('Error uploading image: $e');
      debugPrint('Stack trace: $stackTrace');
      return null;
    }
  }

  Future<bool> sendHealthAssessmentPersonalData(
      HealthAssessmentPersonalDataRequestModel model) async {
    final token = await _secureStorage.read(key: _tokenKey);
    final uid = await _secureStorage.read(key: 'user_uid');
    final url = Uri.parse('$baseUrl/users/$uid');
    final body = jsonEncode(model.toJson());

    debugPrint('Sending request to $url');
    debugPrint('Request body: $body');

    try {
      final response = await http.patch(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: body,
      );

      if (response.statusCode == 200) {
        debugPrint('Success: ${response.body}');
        return true;
      } else {
        debugPrint('Failed to send data: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      debugPrint('Error sending data: $e');
      return false;
    }
  }

  Future<bool> sendHealthAssessmentHealthData(
      HealthAssessmentHealthDataRequestModel model) async {
    final token = await _secureStorage.read(key: _tokenKey);
    final uid = await _secureStorage.read(key: 'user_uid');
    final url = Uri.parse('$baseUrl/risk-assessment/$uid');
    final body = jsonEncode(model.toJson());

    debugPrint('Sending POST request to: $url');
    debugPrint('Request body: $body');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: body,
      );

      if (response.statusCode == 201) {
        return true;
      } else {
        debugPrint('Failed to send data: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      debugPrint('Error sending data: $e');
      return false;
    }
  }
}
