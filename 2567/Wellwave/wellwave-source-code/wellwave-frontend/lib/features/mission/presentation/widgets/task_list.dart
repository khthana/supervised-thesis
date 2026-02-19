import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import 'package:wellwave_frontend/features/mission/presentation/widgets/task_info_dialog.dart';

import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_images.dart';
import '../../../../config/constants/app_strings.dart';
import 'task_goal_bottom_sheet.dart';

class TaskList extends StatelessWidget {
  final String imagePath;
  final int taskId;
  final String taskName;
  final int? expReward;
  final int? gemReward;
  final VoidCallback? onTap;
  final bool? isActive;
  final num? progressPercentage;
  final bool isQuest;
  final int? defaultDailyMinuteGoal;
  final int? defaultDaysGoal;
  final String? adviceText;
  final int? challengeId;
  final String? category;
  final int? tabIndex; // Add tab index parameter

  const TaskList({
    super.key,
    required this.imagePath,
    required this.taskId,
    required this.taskName,
    this.expReward,
    this.gemReward,
    this.onTap,
    this.isActive,
    this.progressPercentage,
    this.isQuest = false,
    this.defaultDailyMinuteGoal,
    this.defaultDaysGoal,
    this.adviceText,
    this.challengeId,
    this.category,
    this.tabIndex, // Initialize tab index
  });

  void _handleAction(BuildContext context) {
    if (isQuest) {
      context.goNamed(
        AppPages.questDetailName,
        pathParameters: {'questId': taskId.toString()},
      );
      return;
    }

    // Determine the correct category to use based on tab index
    final String categoryToUse;
    if (tabIndex != null) {
      switch (tabIndex) {
        case 0:
          categoryToUse = 'rec';
          break;
        case 1:
          categoryToUse = 'diet';
          break;
        case 2:
          categoryToUse = 'exercise';
          break;
        case 3:
          categoryToUse = 'sleep';
          break;
        default:
          categoryToUse = category ?? 'rec';
      }
    } else {
      categoryToUse = category ?? 'rec';
    }

    // Store reference to bloc before showing any dialogs
    final missionBloc = context.read<MissionBloc>();

    if (isActive == false) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        barrierColor: Colors.black.withOpacity(0.3),
        backgroundColor: Colors.transparent,
        builder: (BuildContext context) {
          return TaskGoalBottomSheet(
            defaultDailyMinuteGoal: defaultDailyMinuteGoal ?? 0,
            defaultDaysGoal: defaultDaysGoal ?? 0,
            expReward: expReward ?? 0,
            hid: taskId,
            category: categoryToUse,
          );
        },
      ).then((_) {
        // Check if widget is still mounted before using context
        if (!context.mounted) return;

        // Use the captured bloc instance
        missionBloc.add(LoadHabitsEvent(category: categoryToUse));
      });
      return;
    }

    if (isActive == true) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext dialogContext) {
          return BlocProvider.value(
            value: missionBloc,
            child: TaskInfoDialog(
              title: taskName,
              totalDays: defaultDaysGoal ?? 0,
              expReward: expReward ?? 0,
              taskId: taskId,
              adviceText: adviceText ?? '',
              minutesGoal: defaultDailyMinuteGoal ?? 30,
              challengeId: challengeId ?? 0,
              category: categoryToUse,
            ),
          );
        },
      ).then((result) {
        // Check if the widget is still mounted before using its context
        if (!context.mounted) return;

        // Only reload habits if we're not navigating to mission record page
        if (result != 'navigation') {
          missionBloc.add(LoadHabitsEvent(category: categoryToUse));
        }
      });

      Future.delayed(Duration.zero, () {
        if (!context.mounted) return;
        missionBloc.add(LoadActiveHabitEvent(taskId: taskId));
      });

      return;
    }

    // Load active habit but don't wait for state to change
    missionBloc.add(LoadActiveHabitEvent(taskId: taskId));

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dialogContext) {
        return TaskInfoDialog(
          title: taskName,
          totalDays: defaultDaysGoal ?? 0,
          expReward: expReward ?? 0,
          taskId: taskId,
          adviceText: adviceText ?? '',
          minutesGoal: defaultDailyMinuteGoal ?? 30,
          challengeId: challengeId ?? 0,
          category: categoryToUse,
        );
      },
    ).then((result) {
      // Check if the widget is still mounted
      if (!context.mounted) return;

      // Only reload habits if we're not navigating to mission record page
      if (result != 'navigation') {
        missionBloc.add(LoadHabitsEvent(category: categoryToUse));
        debugPrint(
            'Reloading habits for category: $categoryToUse (tab: $tabIndex)');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    double progressValue = (progressPercentage ?? 0.0).clamp(0.0, 100.0) / 100;
    double progressBarWidth = MediaQuery.of(context).size.width - 176;

    return BlocBuilder<MissionBloc, MissionState>(
      builder: (context, state) {
        bool isProgressVisible = state is ProgressState || isActive == true;
        return GestureDetector(
          onTap: onTap ?? () => _handleAction(context),
          child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
            child: Container(
              decoration: BoxDecoration(
                color: AppColors.whiteColor,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.25),
                    spreadRadius: 0.5,
                    blurRadius: 4,
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Flexible(
                          flex: 1,
                          child: Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              color: AppColors.transparentColor,
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                '$baseUrl${imagePath}',
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) =>
                                    const Icon(
                                  Icons.error,
                                  size: 32,
                                  color: AppColors.darkGrayColor,
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        if (progressValue < 1.0) ...[
                          Flexible(
                            flex: 2,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        taskName,
                                        style: Theme.of(context)
                                            .textTheme
                                            .headlineSmall,
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    if (expReward != null &&
                                        gemReward == null &&
                                        progressValue < 1.0)
                                      Row(
                                        children: [
                                          SvgPicture.asset(
                                            AppImages.expIcon,
                                            width: 20,
                                          ),
                                          Text(
                                            ' +$expReward/วัน',
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodySmall,
                                          ),
                                        ],
                                      ),
                                    if (expReward == null &&
                                        gemReward != null &&
                                        progressValue < 1.0)
                                      Row(
                                        children: [
                                          SvgPicture.asset(
                                            AppImages.gemIcon,
                                            width: 20,
                                          ),
                                          Text(
                                            ' +$gemReward',
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodySmall,
                                          ),
                                        ],
                                      ),
                                  ],
                                ),
                                SizedBox(height: 16),
                                isProgressVisible
                                    ? Container(
                                        child: Stack(
                                          clipBehavior: Clip.none,
                                          children: [
                                            Container(
                                              width: progressBarWidth,
                                              child: ClipRRect(
                                                borderRadius:
                                                    BorderRadius.circular(8),
                                                child: LinearProgressIndicator(
                                                  backgroundColor: AppColors
                                                      .grayProgressColor,
                                                  color: AppColors.skyBlueColor,
                                                  minHeight: 16,
                                                  value: progressValue,
                                                ),
                                              ),
                                            ),
                                            Positioned(
                                              left: ((progressBarWidth *
                                                          progressValue) -
                                                      24)
                                                  .clamp(0.0,
                                                      progressBarWidth - 24),
                                              top: -6,
                                              child: SvgPicture.asset(
                                                AppImages.processIcon,
                                                height: 24,
                                                width: 24,
                                              ),
                                            ),
                                          ],
                                        ),
                                      )
                                    : SizedBox(
                                        height: 28,
                                        width: double.infinity,
                                        child: ElevatedButton(
                                          onPressed: () =>
                                              _handleAction(context),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor:
                                                AppColors.primaryColor,
                                            foregroundColor:
                                                AppColors.whiteColor,
                                            minimumSize: const Size(64, 28),
                                            side: const BorderSide(
                                              color: AppColors.whiteColor,
                                              width: 2.0,
                                            ),
                                            elevation: 2,
                                            shadowColor:
                                                AppColors.darkGrayColor,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                          ),
                                          child: Text(
                                            AppStrings.chooseText,
                                            textAlign: TextAlign.center,
                                            style: Theme.of(context)
                                                .textTheme
                                                .titleSmall
                                                ?.copyWith(
                                                    color:
                                                        AppColors.whiteColor),
                                          ),
                                        ),
                                      ),
                              ],
                            ),
                          ),
                        ] else ...[
                          Flexible(
                            flex: 2,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    taskName,
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineSmall,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                SvgPicture.asset(AppImages.completeProcessIcon,
                                    width: 64),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
