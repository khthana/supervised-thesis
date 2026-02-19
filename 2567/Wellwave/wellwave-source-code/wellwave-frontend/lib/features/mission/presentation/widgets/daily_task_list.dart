import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';
import 'package:wellwave_frontend/features/home/widget/show_assessment_popup.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import 'package:wellwave_frontend/features/mission/presentation/widgets/task_info_dialog.dart';

class DailyTaskList extends StatelessWidget {
  final String imagePath;
  final int taskId;
  final String taskName;
  final int? exp;
  final bool isCompleted;
  final int? defaultDailyMinuteGoal;
  final int? defaultDaysGoal;
  final int? expReward;
  final String? category;
  final String? adviceText;
  final int? challengeId;

  const DailyTaskList({
    super.key,
    required this.imagePath,
    required this.taskId,
    required this.taskName,
    required this.exp,
    required this.isCompleted,
    this.defaultDailyMinuteGoal,
    this.defaultDaysGoal,
    this.expReward,
    this.category,
    this.adviceText,
    this.challengeId,
  });

  void _handleAction(BuildContext context) {
    if (isCompleted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('คุณได้ทำภารกิจนี้ไปแล้วในวันนี้'),
        ),
      );
      return;
    }

    if (category == 'exercise') {
      Navigator.of(context).pop();
      context.goNamed(
        AppPages.missionRecordName,
        pathParameters: {'hid': taskId.toString()},
        extra: {
          'title': taskName,
          'adviceText': adviceText ?? '',
          'minutesGoal': defaultDailyMinuteGoal ?? 30,
          'challengeId': challengeId ?? taskId,
          'expReward': expReward ?? exp ?? 0,
        },
      );
    } else {
      context.read<MissionBloc>().add(LoadDailyTasksEvent());
      // Load active habit data for this specific task
      context.read<MissionBloc>().add(LoadActiveHabitEvent(taskId: taskId));
      // Also load daily tasks to ensure data is fresh

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext dialogContext) {
          return BlocListener<MissionBloc, MissionState>(
            listener: (context, state) {},
            child: TaskInfoDailyDialog(
              title: taskName,
              totalDays: defaultDaysGoal ?? 0,
              expReward: expReward ?? 0,
              taskId: taskId,
              adviceText: adviceText ?? '',
              minutesGoal: defaultDailyMinuteGoal ?? 30,
              challengeId: challengeId ?? taskId,
            ),
          );
        },
      ).then((result) {
        // Check if widget is still mounted before using context
        if (!context.mounted) return;

        // Only reload daily tasks if not navigating away
        if (result != 'navigation') {
          context.read<MissionBloc>().add(LoadDailyTasksEvent());
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
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
        padding: const EdgeInsets.all(2.0),
        child: Row(
          children: [
            Padding(
              padding: const EdgeInsets.all(5.0),
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  image: imagePath.isNotEmpty
                      ? DecorationImage(
                          image: NetworkImage('$baseUrl$imagePath'),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: imagePath.isEmpty
                    ? Image.asset(
                        AppImages.emptyComponentImage,
                        fit: BoxFit.cover,
                      )
                    : null,
              ),
            ),
            const SizedBox(width: 5),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    taskName,
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 12.0, left: 4),
              child: isCompleted
                  ? SvgPicture.asset(AppImages.completeProcessIcon, width: 64)
                  : Column(
                      children: [
                        Row(
                          children: [
                            SvgPicture.asset(
                              AppImages.expIcon,
                              width: 20,
                            ),
                            Text(' +${exp ?? 0}',
                                style: Theme.of(context).textTheme.bodySmall),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Container(
                          height: 28,
                          decoration: BoxDecoration(
                            color: AppColors.primaryColor,
                            border: Border.all(
                              color: AppColors.whiteColor,
                              width: 2.0,
                            ),
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.15),
                                offset: const Offset(0, 2),
                                blurRadius: 0,
                                spreadRadius: 0,
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: () => _handleAction(context),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryColor,
                              minimumSize: const Size(64, 28),
                              side: const BorderSide(
                                color: AppColors.whiteColor,
                              ),
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: Text(
                              AppStrings.chooseText,
                              textAlign: TextAlign.center,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleSmall
                                  ?.copyWith(color: AppColors.whiteColor),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
