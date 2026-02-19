import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:wellwave_frontend/features/article/data/models/article_model.dart';

import '../../../../config/constants/app_url.dart';
import '../models/article_bookmark.dart';

class ArticleRepository {
  final _secureStorage = const FlutterSecureStorage();

  Future<List<ArticleModel>> fetchRecommendArticle() async {
    final uid = await _secureStorage.read(key: 'user_uid');

    final url =
        Uri.parse('$baseUrl/get-rec/articles?uid=$uid&includeRead=true');

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = json.decode(response.body);

        List<dynamic> articlesJson = jsonResponse['data'];
        return articlesJson.map((json) => ArticleModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load articles: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error fetching articles: $e');
    }
  }

  Future<List<ArticleModel>> fetchArticles({String? diseaseIds}) async {
    debugPrint("🚀 fetchArticles() CALLED with diseaseIds: $diseaseIds");

    try {
      String url = "$baseUrl/article/search";
      if (diseaseIds != null && diseaseIds.isNotEmpty) {
        url += "?diseaseIds=$diseaseIds";
      } else {
        debugPrint("📜 Fetching all articles (no diseaseIds)");
      }
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        debugPrint("Raw Response: ${response.body}");

        final Map<String, dynamic> jsonResponse = json.decode(response.body);

        if (!jsonResponse.containsKey('data')) {
          throw Exception("API response does not contain 'data'");
        }

        List<dynamic> articlesJson = jsonResponse['data'];
        return articlesJson.map((json) => ArticleModel.fromJson(json)).toList();
      } else {
        final errorResponse = json.decode(response.body);
        String errorMessage =
            errorResponse['message'] ?? "Unknown error occurred";

        throw Exception("Failed to load articles: $errorMessage");
      }
    } catch (e) {
      throw Exception("Error fetching articles: $e");
    }
  }

  Future<List<BookmarkModel>> fetchBookmarkedArticles() async {
    final uid = await _secureStorage.read(key: 'user_uid');

    final url = "$baseUrl/user-read-history/bookmarks/$uid";

    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        debugPrint("Response body bookmark: ${response.body}");

        final Map<String, dynamic> jsonResponse = json.decode(response.body);

        if (!jsonResponse.containsKey('data')) {
          throw Exception("API response does not contain 'data'");
        }

        List<dynamic> bookmarkedArticlesJson = jsonResponse['data'] as List;
        return bookmarkedArticlesJson
            .map((json) => BookmarkModel.fromJson(json))
            .toList();
      } else {
        final errorResponse = json.decode(response.body);
        String errorMessage = errorResponse['message'] ?? "Unknown error";
        throw Exception("Failed to load bookmarked articles: $errorMessage");
      }
    } catch (e) {
      debugPrint("Error fetching bookmarked articles: $e");
      throw Exception("Error fetching bookmarked articles: $e");
    }
  }

  Future<bool> toggleBookmark(int aid, bool isBookmark) async {
    final uidString = await _secureStorage.read(key: 'user_uid');
    final uid = int.tryParse(uidString ?? '');

    if (uid == null) {
      throw Exception("Invalid UID");
    }

    const url = "$baseUrl/user-read-history/updateBookmark";

    try {
      final response = await http.patch(
        Uri.parse(url),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "UID": uid,
          "AID": aid,
          "IS_BOOKMARK": !isBookmark,
        }),
      );
      if (response.statusCode == 200) {
        debugPrint(response.body);
        return true;
      } else if (response.statusCode == 409) {
        return true;
      } else {
        throw Exception("Failed to update bookmark");
      }
    } catch (e) {
      debugPrint("Error occurred: $e");
      throw Exception("Failed to toggle bookmark");
    }
  }

  Future<List<ArticleModel>> searchArticles(String query) async {
    try {
      final response =
          await http.get(Uri.parse('$baseUrl/article/search?search=$query'));

      if (response.statusCode == 200) {
        debugPrint('search :${response.body}');

        final Map<String, dynamic> jsonResponse = json.decode(response.body);

        if (!jsonResponse.containsKey('data')) {
          throw Exception('data');
        }

        List<dynamic> data =
            jsonResponse["API response does not contain 'data'"];

        return data.map((e) => ArticleModel.fromJson(e)).toList();
      } else {
        throw Exception('data');
      }
    } catch (e) {
      throw Exception('data');
    }
  }
}
