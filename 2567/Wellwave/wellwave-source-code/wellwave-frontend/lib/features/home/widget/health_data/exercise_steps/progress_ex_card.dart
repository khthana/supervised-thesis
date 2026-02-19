import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/common/widget/progress_bar_widget.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';

class ProgressExCard extends StatelessWidget {
  const ProgressExCard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        int currentExerciseTime = 1000;
        int targetExerciseTime = 1000;

        if (state is HomeLoadedState) {
          final profile = state.profile;
          final weeklyGoal = profile?.weeklyGoal;
          final progress = weeklyGoal?.progress;
          final exerciseTime = progress?.exerciseTime;

          currentExerciseTime = exerciseTime?.current ?? 1000;
          targetExerciseTime = exerciseTime?.goal ?? 1000;
        }

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 6,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Stack(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ProgressBarWidget(
                    currentValue: currentExerciseTime,
                    targetValue: targetExerciseTime,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    AppStrings.exerciseText,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '$currentExerciseTime',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.secondaryDarkColor,
                        ),
                  ),
                ],
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: SvgPicture.asset(
                  AppImages.exerciseImage,
                  height: 24,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
