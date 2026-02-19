import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/features/article/presentation/bloc/article_bloc.dart';
import 'package:wellwave_frontend/features/article/presentation/bloc/article_state.dart';
import 'package:wellwave_frontend/features/article/presentation/widget/recommendation_card.dart';

class AllArticlesScreen extends StatelessWidget {
  const AllArticlesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final diseaseIds =
        GoRouterState.of(context).uri.queryParameters['diseaseIds'];
    const userId =
        "3"; // Retrieve this value from context or wherever applicable

    print('🔍 OHH diseaseIds from queryParams: $diseaseIds');

    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Trigger fetching of bookmarked articles if diseaseIds is '0' (or based on your logic)
      final articleBloc = context.read<ArticleBloc>();

      if (diseaseIds == '0') {
        articleBloc.add(FetchArticlesBookmarkEvent(userId: userId));
      } else if (diseaseIds == '5') {
        articleBloc.add(FetchRecommendArticleEvent());
      } else {
        articleBloc.add(FetchArticlesEvent(diseaseIds: diseaseIds));
      }
    });

    final Map<String, String> diseaseTitles = {
      '0': 'บทความที่บันทึก',
      '2': 'ความดันโลหิตสูง',
      '1': 'โรคเบาหวาน',
      '4': 'โรคอ้วน',
      '3': 'ไขมันในเลือดสูง',
    };

    final String appBarTitle = diseaseTitles[diseaseIds] ?? 'บทความทั้งหมด';

    return Scaffold(
      appBar: AppBar(
        title: Text(appBarTitle,
            style: Theme.of(context).textTheme.headlineMedium),
        backgroundColor: AppColors.whiteColor,
        foregroundColor: AppColors.blackColor,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: BlocBuilder<ArticleBloc, ArticleState>(
        builder: (context, state) {
          if (state is ArticleInitial || state is ArticleLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is ArticleLoaded) {
            if (state.articles.isEmpty) {
              return Center(
                  child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(AppImages.catNoItemimage, height: 128),
                  const SizedBox(
                    height: 20,
                  ),
                  const Text('ไม่มีบทความที่แสดงในขณะนี้'),
                ],
              ));
            }
            return Padding(
              padding: const EdgeInsets.all(8.0),
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 5,
                  mainAxisSpacing: 4,
                ),
                itemCount: state.articles.length,
                itemBuilder: (context, index) {
                  final article = state.articles[index];
                  return RecommendationCard(
                    aid: article.aid,
                    title: article.topic,
                    readingTime: article.estimatedReadTime,
                    imageUrl: article.thumbnailUrl,
                    article: article,
                  );
                },
              ),
            );
          } else if (state is ArticleBookmarkLoaded) {
            if (state.articlesBookmark.isEmpty) {
              return Center(
                  child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(AppImages.catNoItemimage, height: 128),
                  const SizedBox(
                    height: 20,
                  ),
                  const Text('ไม่มีบทความที่แสดงในขณะนี้'),
                ],
              ));
            }
            return Padding(
              padding: const EdgeInsets.all(8.0),
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 5,
                  mainAxisSpacing: 4,
                ),
                itemCount: state.articlesBookmark.length,
                itemBuilder: (context, index) {
                  final bookmark = state.articlesBookmark[index];
                  final article = bookmark.article;

                  return RecommendationCard(
                    title: article.topic,
                    readingTime: article.estimatedReadTime,
                    imageUrl: article.thumbnailUrl,
                    article: article,
                    aid: article.aid,
                  );
                },
              ),
            );
          } else if (state is ArticleRecommendLoaded) {
            if (state.articles.isEmpty) {
              return Center(
                  child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(AppImages.catNoItemimage, height: 128),
                  const SizedBox(
                    height: 20,
                  ),
                  const Text('ไม่มีบทความที่แสดงในขณะนี้'),
                ],
              ));
            }
            return Padding(
              padding: const EdgeInsets.all(8.0),
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 5,
                  mainAxisSpacing: 4,
                ),
                itemCount: state.articles.length,
                itemBuilder: (context, index) {
                  final article = state.articles[index];

                  return RecommendationCard(
                    title: article.topic,
                    readingTime: article.estimatedReadTime,
                    imageUrl: article.thumbnailUrl,
                    article: article,
                    aid: article.aid,
                  );
                },
              ),
            );
          } else if (state is ArticleError) {
            return Center(child: Text('Error: ${state.errorMessage}'));
          } else {
            return Center(
                child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(AppImages.catNoItemimage, height: 128),
                const SizedBox(
                  height: 20,
                ),
                const Text('ไม่มีบทความที่แสดงในขณะนี้'),
              ],
            ));
          }
        },
      ),
    );
  }
}
