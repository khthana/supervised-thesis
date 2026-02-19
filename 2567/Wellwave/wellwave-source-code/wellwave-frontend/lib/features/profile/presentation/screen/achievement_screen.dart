import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../../../common/widget/app_bar.dart';
import '../../../../config/constants/app_colors.dart';
import '../bloc/archeivement_bloc/archeivement_bloc.dart';
import '../bloc/archeivement_bloc/archeivement_event.dart';
import '../bloc/archeivement_bloc/archeivement_state.dart';
import '../../../../config/constants/app_url.dart';

class AchievementScreen extends StatelessWidget {
  const AchievementScreen({super.key});

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ArcheivementBloc>()
        ..add(FetchArcheivement())
        ..add(FetchAllArcheivement());
    });

    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      appBar: CustomAppBar(
        title: AppStrings.archeivementText,
        context: context,
        onLeading: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding:
              const EdgeInsets.only(left: 20, top: 36, bottom: 20, right: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
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
                      ),
                    );
                  }

                  if (state is AllArcheivementLoaded) {
                    final earnedAchievementsMap = Map.fromEntries(state
                        .earnedAchievements
                        .map((e) => MapEntry(e.achId, e)));

                    final List<Widget> achievementWidgets = [];
                    final List<Widget> unearnedWidgets = [];

                    for (var achievement in state.allAchievements) {
                      final earnedAchievement =
                          earnedAchievementsMap[achievement.achId];

                      if (earnedAchievement != null) {
                        final selectedLevel = earnedAchievement
                            .achievement.levels
                            .firstWhere((level) =>
                                level.level == earnedAchievement.level);
                        final levelIcon = "$baseUrl${selectedLevel.iconUrl}";

                        context.read<ArcheivementBloc>().add(ReadArcheivement(
                            uid: earnedAchievement.uid,
                            achId: earnedAchievement.achId,
                            level: earnedAchievement.level));

                        achievementWidgets.add(_buildAchievementCard(
                          context,
                          levelIcon,
                          earnedAchievement.achievement.description,
                          isEarned: true,
                        ));
                      } else {
                        final level1Icon = achievement.levels
                            .firstWhere((level) => level.level == 1)
                            .iconUrl;
                        final levelIcon = "$baseUrl$level1Icon";

                        unearnedWidgets.add(_buildAchievementCard(
                          context,
                          levelIcon,
                          achievement.description,
                          isEarned: false,
                        ));
                      }
                    }

                    if (achievementWidgets.isEmpty && unearnedWidgets.isEmpty) {
                      return Center(
                        child: Text(
                          AppStrings.noDataAvaliableText,
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: AppColors.darkGrayColor,
                                  ),
                        ),
                      );
                    }

                    return Wrap(
                      spacing: 8,
                      runSpacing: 16,
                      alignment: WrapAlignment.spaceBetween,
                      children: [
                        ...achievementWidgets,
                        ...unearnedWidgets,
                      ],
                    );
                  }

                  return const Center(child: CircularProgressIndicator());
                },
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAchievementCard(
      BuildContext context, String iconUrl, String description,
      {bool isEarned = false}) {
    return Container(
      width: 152,
      height: 201,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFB2D6E7).withOpacity(0.1),
            offset: const Offset(0, 4),
            blurRadius: 0,
            spreadRadius: 0,
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
      child: Column(
        children: [
          ColorFiltered(
            colorFilter: isEarned
                ? const ColorFilter.mode(Colors.transparent, BlendMode.dst)
                : const ColorFilter.mode(
                    AppColors.blueGrayColor, BlendMode.srcIn),
            child: Image.network(
              iconUrl,
              height: 126,
              errorBuilder: (context, error, stackTrace) {
                return SvgPicture.asset(
                  AppImages.medalSvg,
                  height: 126,
                );
              },
            ),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(),
          ),
        ],
      ),
    );
  }
}
