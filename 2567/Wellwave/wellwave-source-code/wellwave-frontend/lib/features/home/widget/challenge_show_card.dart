import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_request_model.dart';

class HabitShowCard extends StatelessWidget {
  final dynamic challenge;

  const HabitShowCard({Key? key, required this.challenge}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Access the habit data from the challenge
    final habitData = challenge.habits;
    final dailyTracks = challenge.dailyTracks ?? [];

    // Calculate progress information
    final daysGoal = challenge.daysGoal ?? 0;
    final streakCount = challenge.streakCount ?? 0;
    final daysCompleted =
        dailyTracks.where((track) => track.completed == true).length;
    final percentageProgress =
        daysGoal > 0 ? ((daysCompleted / daysGoal) * 100).round() : 0;

    return Container(
      height: 260,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: AppColors.blackColor.withOpacity(0.1),
            spreadRadius: 2,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16.0),
      constraints: BoxConstraints(
        maxWidth: MediaQuery.of(context).size.width * 0.4,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Image.network(
                "$baseUrl${habitData.thumbnailUrl}",
                height: 64,
                width: 64,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(Icons.image_not_supported, size: 64);
                },
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (habitData.exerciseType != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        habitData.exerciseType!,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppColors.greyColor,
                            ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 48,
            child: Text(
              habitData.title,
              overflow: TextOverflow.ellipsis,
              maxLines: 2,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.blackColor,
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              if (habitData.expReward != 0) ...[
                SvgPicture.asset(
                  AppImages.expIcon,
                  height: 20,
                ),
                const SizedBox(width: 4),
                Text(
                  "${habitData.expReward} ${AppStrings.expText.toUpperCase()}",
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.blackColor,
                      ),
                ),
              ] else if (habitData.gemReward != null &&
                  habitData.gemReward != 0) ...[
                SvgPicture.asset(
                  AppImages.gemIcon,
                  height: 20,
                ),
                const SizedBox(width: 4),
                Text(
                  "${habitData.gemReward} ${AppStrings.gemText.toUpperCase()}",
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.blackColor,
                      ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 16),
          CardButton(
            buttonText: AppStrings.seeMissionText,
            onPressed: () {
              context.goNamed(AppPages.missionPage);
            },
          ),
        ],
      ),
    );
  }
}
