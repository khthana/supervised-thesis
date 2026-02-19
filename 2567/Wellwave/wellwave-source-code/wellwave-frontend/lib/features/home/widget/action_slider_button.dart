import 'package:action_slider/action_slider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';

class ActionSliderButton extends StatelessWidget {
  final int stepNumber;
  final DateTime date;
  final String progressId;

  ActionSliderButton({
    required this.stepNumber,
    required this.date,
    required this.progressId,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        final bloc = context.read<HomeBloc>();
        final isComplete = bloc.completionStatus[progressId]?[date] ?? false;

        return Center(
          child: Container(
            width: 164,
            height: 34,
            decoration: BoxDecoration(
              gradient: isComplete
                  ? null
                  : LinearGradient(
                      colors: [AppColors.primaryColor, AppColors.skyblueColor],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                    ),
              color: isComplete ? AppColors.whiteColor : null,
              borderRadius: BorderRadius.circular(40),
            ),
            child: ActionSlider.standard(
              sliderBehavior: SliderBehavior.stretch,
              height: 34,
              backgroundColor: isComplete
                  ? AppColors.whiteColor
                  : AppColors.transparentColor,
              toggleColor: AppColors.whiteColor,
              successIcon: Icon(
                Icons.check,
                color: AppColors.primaryColor,
                size: 20,
              ),
              action: (controller) async {
                controller.loading();
                try {
                  context.read<HomeBloc>().add(UpdateCompletionStatusEvent(
                        progressId: progressId,
                        date: date,
                        isComplete: true,
                      ));

                  controller.success();
                } catch (e) {
                  controller.failure();
                }
              },
              child: Text(
                AppStrings.slideMissionText,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.whiteColor,
                    ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class ActionSliderMissionButton extends StatelessWidget {
  final int stepNumber;
  final DateTime date;
  final String progressId;

  ActionSliderMissionButton({
    required this.stepNumber,
    required this.date,
    required this.progressId,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        final bloc = context.read<HomeBloc>();
        final isComplete = bloc.completionStatus[progressId]?[date] ?? false;
        final now = DateTime.now(); // เพิ่มตัวแปร now ไว้ใช้ใน action

        return Center(
          child: Container(
            width: 300,
            height: 56,
            decoration: BoxDecoration(
              gradient: isComplete
                  ? null
                  : LinearGradient(
                      colors: [AppColors.primaryColor, AppColors.skyblueColor],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                    ),
              color: isComplete ? AppColors.whiteColor : null,
              borderRadius: BorderRadius.circular(40),
            ),
            child: ActionSlider.standard(
              sliderBehavior: SliderBehavior.stretch,
              height: 56,
              backgroundColor: isComplete
                  ? AppColors.whiteColor
                  : AppColors.transparentColor,
              toggleColor: AppColors.whiteColor,
              successIcon: Icon(
                Icons.check,
                color: AppColors.primaryColor,
                size: 28,
              ),
              action: (controller) async {
                controller.loading();
                try {
                  controller.success();

                  context.read<MissionBloc>().add(
                        SubmitDailyTrackEvent(
                          challengeId: int.parse(progressId),
                          trackDate: date.toUtc().toIso8601String(),
                          completed: true,
                        ),
                      );

                  await Future.delayed(const Duration(seconds: 1));

                  Navigator.of(context).pop();
                } catch (e) {
                  controller.failure();
                }
              },
              child: Text(
                AppStrings.slideMissionText,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.whiteColor,
                    ),
              ),
            ),
          ),
        );
      },
    );
  }
}
