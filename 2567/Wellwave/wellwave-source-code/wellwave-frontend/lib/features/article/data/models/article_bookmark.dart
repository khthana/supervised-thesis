import 'package:wellwave_frontend/features/article/data/models/article_model.dart';

class BookmarkModel {
  final int uid;
  final int aid;
  final bool isRead;
  final bool isBookmark;
  final int rating;
  final String firstReadDate;
  final String lastedReadDate;
  final ArticleModel article;

  BookmarkModel({
    required this.uid,
    required this.aid,
    required this.isRead,
    required this.isBookmark,
    required this.rating,
    required this.firstReadDate,
    required this.lastedReadDate,
    required this.article,
  });

  factory BookmarkModel.fromJson(Map<String, dynamic> json) {
    return BookmarkModel(
      uid: json['UID'] ?? 0,
      aid: json['AID'] ?? 0,
      isRead: json['IS_READ'] ?? false,
      isBookmark: json['IS_BOOKMARK'] ?? false,
      rating: json['RATING'] ?? 0,
      firstReadDate: json['FIRST_READ_DATE'] ?? '',
      lastedReadDate: json['LASTED_READ_DATE'] ?? '',
      article: ArticleModel.fromJson(json['article'] ?? {}),
    );
  }
}
