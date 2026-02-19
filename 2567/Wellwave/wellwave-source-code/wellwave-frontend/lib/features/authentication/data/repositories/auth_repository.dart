import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:wellwave_frontend/features/authentication/data/models/auth_model.dart';

import '../../../../config/constants/app_url.dart';

class AuthRepository {
  Map<String, dynamic>? _lastLoginResponse;

  // Register
  Future<bool> register(AuthModel authModel) async {
    final url = Uri.parse('$baseUrl/auth/register');
    final headers = {'Content-Type': 'application/json'};
    final body = json.encode(authModel.toJson());

    try {
      final response = await http.post(url, headers: headers, body: body);

      if (response.statusCode == 201) {
        debugPrint('Register Successful');
        return true;
      } else if (response.statusCode == 401) {
        debugPrint('Unauthorized: 401');
        return false;
      } else {
        debugPrint('Register Error: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      debugPrint('Register Exception: $e');
      return false;
    }
  }

  // Login
  Future<bool> login(AuthModel authModel) async {
    final url = Uri.parse('$baseUrl/auth/login');
    final headers = {'Content-Type': 'application/json'};
    final body = json.encode(authModel.toJson());

    try {
      final response = await http.post(url, headers: headers, body: body);
      debugPrint(response.body);

      if (response.statusCode == 201) {
        debugPrint('Login Successful');
        _lastLoginResponse = json.decode(response.body);
        return true;
      } else if (response.statusCode == 401) {
        debugPrint('Unauthorized: 401');
        return false;
      } else {
        debugPrint('Login Error: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      debugPrint('Login Exception: $e');
      return false;
    }
  }

  // Get the last login response (for token)
  Map<String, dynamic>? getLoginResponse() {
    return _lastLoginResponse;
  }
}
