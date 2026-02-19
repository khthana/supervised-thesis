import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../../../../config/constants/app_images.dart';
import '../../../../../config/constants/app_pages.dart';
import '../../../../../config/constants/app_url.dart';
import '../../bloc/archeivement_bloc/archeivement_bloc.dart';
import '../../bloc/archeivement_bloc/archeivement_event.dart';
import '../../bloc/archeivement_bloc/archeivement_state.dart';

class AchievementCard extends StatelessWidget {
  const AchievementCard({super.key});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ArcheivementBloc>()
        ..add(FetchArcheivement())
        ..add(FetchAllArcheivement());
    });

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: AppColors.whiteColor,
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      AppStrings.archeivementText,
                      style: Theme.of(context)
                          .textTheme
                          .titleSmall
                          ?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    GestureDetector(
                      onTap: () {
                        context.goNamed(AppPages.achievementName);
                      },
                      child: Text(
                        AppStrings.seeAllText,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppColors.greyColor,
                            ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                BlocBuilder<ArcheivementBloc, ArcheivementState>(
                  builder: (context, state) {
                    if (state is ArcheivementError) {
                      return Center(
                          child: Column(
                        children: [
                          Image.asset(AppImages.catNoItemimage, height: 128),
                          const SizedBox(height: 32),
                          Text(state.message),
                        ],
                      ));
                    }

                    if (state is AllArcheivementLoaded) {
                      // Create a map of achievement ID to highest level earned
                      final earnedAchievementsMap = Map.fromEntries(state
                          .earnedAchievements
                          .map((e) => MapEntry(e.achId, e)));

                      // Separate earned and unearned achievements
                      final List<Widget> achievementWidgets = [];
                      final List<Widget> unearnedWidgets = [];

                      for (var achievement in state.allAchievements) {
                        final earnedAchievement =
                            earnedAchievementsMap[achievement.achId];

                        if (earnedAchievement != null) {
                          // Earned achievements
                          final selectedLevel = earnedAchievement
                              .achievement.levels
                              .firstWhere((level) =>
                                  level.level == earnedAchievement.level);
                          final levelIcon = "$baseUrl${selectedLevel.iconUrl}";

                          achievementWidgets.add(
                            Padding(
                              padding: const EdgeInsets.only(right: 16),
                              child: Stack(
                                clipBehavior: Clip.none,
                                children: [
                                  Image.network(
                                    levelIcon,
                                    height: 64,
                                    errorBuilder: (context, error, stackTrace) {
                                      return SvgPicture.asset(
                                        AppImages.medalSvg,
                                        height: 64,
                                      );
                                    },
                                  ),
                                  // if (!earnedAchievement.isRead)
                                  //   Positioned(
                                  //     top: -2,
                                  //     right: -2,
                                  //     child: Container(
                                  //       width: 8,
                                  //       height: 8,
                                  //       decoration: const BoxDecoration(
                                  //         color: Colors.red,
                                  //         shape: BoxShape.circle,
                                  //       ),
                                  //     ),
                                  //   ),
                                ],
                              ),
                            ),
                          );
                        } else {
                          // Unearned achievements
                          final level1Icon = achievement.levels
                              .firstWhere((level) => level.level == 1)
                              .iconUrl;
                          final levelIcon = "$baseUrl$level1Icon";

                          unearnedWidgets.add(
                            Padding(
                              padding: const EdgeInsets.only(right: 16),
                              child: ColorFiltered(
                                colorFilter: const ColorFilter.mode(
                                  AppColors.blueGrayColor,
                                  BlendMode.srcIn,
                                ),
                                child: Image.network(
                                  levelIcon,
                                  height: 64,
                                  errorBuilder: (context, error, stackTrace) {
                                    return SvgPicture.asset(
                                      AppImages.medalSvg,
                                      height: 64,
                                    );
                                  },
                                ),
                              ),
                            ),
                          );
                        }
                      }

                      if (achievementWidgets.isEmpty &&
                          unearnedWidgets.isEmpty) {
                        return Center(
                          child: Text(
                            AppStrings.haveNoAchievementYet,
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppColors.darkGrayColor,
                                    ),
                          ),
                        );
                      }

                      return Align(
                        alignment: Alignment.centerLeft,
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              ...achievementWidgets,
                              ...unearnedWidgets,
                            ],
                          ),
                        ),
                      );
                    }
                    return const Center(child: CircularProgressIndicator());
                  },
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
