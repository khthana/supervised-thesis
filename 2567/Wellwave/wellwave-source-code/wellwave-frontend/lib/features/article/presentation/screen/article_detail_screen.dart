import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/features/article/presentation/bloc/article_bloc.dart';
import 'package:wellwave_frontend/features/article/presentation/bloc/article_state.dart';

import '../../../../config/constants/app_url.dart';
import '../../data/models/article_model.dart';

class ArticleDetailScreen extends StatelessWidget {
  const ArticleDetailScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final state = GoRouterState.of(context);
    final article = state.extra as ArticleModel?;
    final aid = article?.aid is int ? article?.aid as int : 0;
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          article?.thumbnailUrl.isNotEmpty == true
              ? Image.network(
                  "$baseUrl${article!.thumbnailUrl}",
                  width: double.infinity,
                  height: 250,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      width: double.infinity,
                      height: 250,
                      color: AppColors.blueGrayColor,
                      child: const Center(
                        child: Icon(
                          Icons.error,
                          color: Colors.white,
                        ),
                      ),
                    );
                  },
                )
              : const SizedBox.shrink(),
          Align(
            alignment: Alignment.topCenter,
            child: Container(
              margin: const EdgeInsets.only(top: 230),
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(12),
                  topRight: Radius.circular(12),
                ),
              ),
              child: article == null
                  ? const Center(child: Text("ไม่พบข้อมูลบทความ"))
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 16),
                        Text(
                          article.topic,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        const Row(
                          children: [
                            Icon(Icons.menu_book_rounded,
                                size: 20, color: Colors.grey),
                            SizedBox(width: 4),
                            Text(
                              'readingTime',
                              style:
                                  TextStyle(fontSize: 14, color: Colors.grey),
                            ),
                          ],
                        ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            article.body,
                            style: const TextStyle(
                                fontSize: 14, color: Colors.black),
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          Positioned(
            top: 40,
            left: 8,
            child: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(10.0),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                width: 36,
                child: const Center(
                  child: Icon(
                    Icons.arrow_back_ios,
                    color: Colors.black,
                  ),
                ),
              ),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ),
          BlocBuilder<ArticleBloc, ArticleState>(
            builder: (context, state) {
              bool isBookmarked = false;

              if (state is BookmarkUpdated && state.aid == aid) {
                isBookmarked = state.isBookmarked;
              }

              return Positioned(
                top: 40,
                right: 70,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  width: 40,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: Icon(
                      isBookmarked ? Icons.bookmark : Icons.bookmark_border,
                      color: Colors.black,
                    ),
                    onPressed: () {
                      context.read<ArticleBloc>().add(
                            ToggleBookmarkEvent(
                              aid: aid,
                              isBookmark: isBookmarked,
                            ),
                          );
                    },
                  ),
                ),
              );
            },
          ),
          Positioned(
            top: 40,
            right: 16,
            child: IconButton(
              icon: Container(
                padding: const EdgeInsets.all(6.0),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                width: 40,
                child: const Icon(
                  Icons.share,
                  color: Colors.black,
                ),
              ),
              onPressed: () {
                String articleLink = "$baseUrl/$aid";
                Share.share("อ่านบทความนี้ได้ที่: $articleLink");
              },
            ),
          ),
        ],
      ),
    );
  }
}
