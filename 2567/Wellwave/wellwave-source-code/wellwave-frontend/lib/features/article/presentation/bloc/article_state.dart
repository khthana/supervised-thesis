import 'package:wellwave_frontend/features/article/data/models/article_bookmark.dart';

import '../../data/models/article_model.dart';

abstract class ArticleState {}

class ArticleInitial extends ArticleState {}

class ArticleLoading extends ArticleState {}

class ArticleLoaded extends ArticleState {
  final List<ArticleModel> articles;

  ArticleLoaded(this.articles);
}

class ArticleRecommendLoading extends ArticleState {}

class ArticleRecommendLoaded extends ArticleState {
  final List<ArticleModel> articles;

  ArticleRecommendLoaded(this.articles);
}

class ArticleBookmarkLoading extends ArticleState {}

class ArticleBookmarkLoaded extends ArticleState {
  final List<BookmarkModel> articlesBookmark;

  ArticleBookmarkLoaded(this.articlesBookmark);
}

class ArticleError extends ArticleState {
  final String errorMessage;

  ArticleError(this.errorMessage);
}

class BookmarkUpdated extends ArticleState {
  final int aid;
  final bool isBookmarked;

  BookmarkUpdated({required this.aid, required this.isBookmarked});
}

class SearchArticleInitial extends ArticleState {}

class SearchArticleLoading extends ArticleState {}

class SearchArticleLoaded extends ArticleState {
  final List<ArticleModel> articles;

  SearchArticleLoaded(this.articles);
}

class SearchArticleError extends ArticleState {
  final String message;

  SearchArticleError(this.message);
}
