part of 'article_bloc.dart';

abstract class ArticleEvent {}

class FetchArticlesEvent extends ArticleEvent {
  final String? diseaseIds;

  FetchArticlesEvent({this.diseaseIds, String? diseaseId});
}

class FetchArticlesBookmarkEvent extends ArticleEvent {
  final String userId;

  FetchArticlesBookmarkEvent({required this.userId});
}

class ToggleBookmarkEvent extends ArticleEvent {
  final int aid;
  final bool isBookmark;

  ToggleBookmarkEvent({required this.aid, required this.isBookmark});
}

class FetchRecommendArticleEvent extends ArticleEvent {
  FetchRecommendArticleEvent();
}

class SearchArticleEvent extends ArticleEvent {
  final String query;
  
  SearchArticleEvent({required this.query});
}