import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:wellwave_frontend/features/article/presentation/bloc/article_state.dart';
import '../../data/repositories/article_repository.dart';

part 'article_event.dart';

class ArticleBloc extends Bloc<ArticleEvent, ArticleState> {
  final ArticleRepository articleRepository;

  ArticleBloc(this.articleRepository) : super(ArticleInitial()) {
    on<FetchArticlesEvent>((event, emit) async {
      emit(ArticleLoading());

      try {
        final articles =
            await articleRepository.fetchArticles(diseaseIds: event.diseaseIds);
        emit(ArticleLoaded(articles));
      } catch (e) {
        emit(ArticleError("ไม่สามารถโหลดข้อมูลได้: ${e.toString()}"));
        debugPrint("ไม่สามารถโหลดข้อมูลได้: ${e.toString()}");
      }
    });

    on<FetchArticlesBookmarkEvent>((event, emit) async {
      emit(ArticleBookmarkLoading());
      try {
        final articlesBookmark =
            await articleRepository.fetchBookmarkedArticles();
        emit(ArticleBookmarkLoaded(articlesBookmark));
      } catch (e) {
        emit(ArticleError("ไม่สามารถโหลดข้อมูลการบันทึก: ${e.toString()}"));
        debugPrint("ไม่สามารถโหลดข้อมูลการบันทึก: ${e.toString()}");
      }
    });

    on<ToggleBookmarkEvent>((event, emit) async {
      try {
        emit(BookmarkUpdated(aid: event.aid, isBookmarked: !event.isBookmark));

        final success =
            await articleRepository.toggleBookmark(event.aid, event.isBookmark);

        if (success) {
          emit(
              BookmarkUpdated(aid: event.aid, isBookmarked: !event.isBookmark));
        } else {
          emit(ArticleError("❌ ไม่สามารถเปลี่ยนสถานะ Bookmark ได้"));
        }
      } catch (e) {
        emit(ArticleError(
            "❌ เกิดข้อผิดพลาดในการอัปเดต Bookmark: ${e.toString()}"));
      }
    });

    on<FetchRecommendArticleEvent>((event, emit) async {
      emit(ArticleRecommendLoading());

      try {
        final articles = await articleRepository.fetchRecommendArticle();
        emit(ArticleRecommendLoaded(articles));
      } catch (e) {
        emit(ArticleError("ไม่สามารถดึงข้อมูลบทความ: ${e.toString()}"));
      }
    });

    on<SearchArticleEvent>((event, emit) async {
      emit(ArticleRecommendLoading());

      try {
        final articles = await articleRepository.searchArticles(event.query);
        emit(ArticleRecommendLoaded(articles));
      } catch (e) {
        emit(ArticleError("ไม่สามารถดึงข้อมูลบทความ: ${e.toString()}"));
      }
    });
  }
}
