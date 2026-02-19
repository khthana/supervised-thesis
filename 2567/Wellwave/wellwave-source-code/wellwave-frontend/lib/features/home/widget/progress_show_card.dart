import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/common/widget/gradient_circular_progress_indicator.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/data/models/get_user_challenges_request_model.dart';

import 'progress_stepper.dart';

class ProgressShowCard extends StatelessWidget {
  final Challenge progressData;

  const ProgressShowCard({Key? key, required this.progressData})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final habit = progressData.habits;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
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
        maxWidth: MediaQuery.of(context).size.width * 0.5,
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                flex: 4,
                child: Text(
                  habit.title,
                  textAlign: TextAlign.left,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: AppColors.blackColor,
                      ),
                ),
              ),
              const SizedBox(width: 4),
              Expanded(
                flex: 1,
                child: GradientCircularProgressWithText(
                  value: _calculateProgress(progressData),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  if (habit.expReward != 0) ...[
                    SvgPicture.asset(
                      AppImages.expIcon,
                      height: 20,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      "${habit.expReward.toString()} ${AppStrings.expText.toUpperCase()}",
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.blackColor,
                          ),
                    ),
                  ] else if (habit.gemReward != 0) ...[
                    SvgPicture.asset(
                      AppImages.gemIcon,
                      height: 20,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      "${habit.gemReward.toString()} ${AppStrings.gemText.toUpperCase()}",
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.blackColor,
                          ),
                    ),
                  ],
                ],
              ),
              Text(
                "${progressData.streakCount.toString()}/${progressData.daysGoal.toString()} วัน",
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.darkGrayColor,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ProgressStepperWidget(
            progressData: progressData,
            progressId: progressData.challengeId.toString(),
          ),
        ],
      ),
    );
  }

  double _calculateProgress(Challenge progressData) {
    final totalDays = progressData.daysGoal;
    final completedDays =
        progressData.dailyTracks.where((track) => track.completed).length;
    return completedDays / totalDays;
  }
}
