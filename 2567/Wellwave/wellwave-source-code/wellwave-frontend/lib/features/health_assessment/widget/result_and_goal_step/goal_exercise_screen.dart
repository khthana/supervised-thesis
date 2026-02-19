import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/custom_text_form_field.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_event.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class GoalExerciseScreen extends StatefulWidget {
  const GoalExerciseScreen({super.key});

  @override
  _GoalExerciseScreen createState() => _GoalExerciseScreen();
}

class _GoalExerciseScreen extends State<GoalExerciseScreen> {
  String? recommendationText;
  int recommendGoalEx = 150;

  String _calculateAverageExPerDay(String weeklySteps) {
    final weekly = int.tryParse(weeklySteps) ?? 0;
    final average = (weekly / 7).round();
    return average.toString();
  }

  @override
  void initState() {
    super.initState();

    final currentGoalEx = context
        .read<HealthAssessmentPageBloc>()
        .state
        .formData['userGoalExTimeWeek'];

    if (currentGoalEx == null || currentGoalEx.isEmpty) {
      context
          .read<HealthAssessmentPageBloc>()
          .add(UpdateField('userGoalExTimeWeek', recommendGoalEx.toString()));
    }

    recommendationText = AppStrings.recommendText;
    debugPrint("userGoalEx: $currentGoalEx");
    debugPrint("recommendGoalEx: $recommendGoalEx");
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        final userGoalEx =
            state.formData['userGoalExTimeWeek'] ?? recommendGoalEx.toString();

        return Scaffold(
          backgroundColor: AppColors.transparentColor,
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                AppStrings.goalExerciseText,
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(color: AppColors.blackColor),
              ),
              const SizedBox(height: 64),
              if (userGoalEx == recommendGoalEx.toString())
                Container(
                  padding: const EdgeInsets.symmetric(
                      vertical: 4.0, horizontal: 24.0),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    recommendationText!,
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                          color: AppColors.whiteColor,
                        ),
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(
                      vertical: 4.0, horizontal: 24.0),
                  decoration: BoxDecoration(
                    color: AppColors.transparentColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    recommendationText!,
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                          color: AppColors.transparentColor,
                        ),
                  ),
                ),
              const SizedBox(height: 16),
              CustomTextFormFieldLarge(
                hintText: AppStrings.exCountText,
                keyboardType: TextInputType.number,
                suffixText: AppStrings.suffixMinuteText,
                initialValue: userGoalEx,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(6),
                ],
                onChanged: (value) => context
                    .read<HealthAssessmentPageBloc>()
                    .add(UpdateField('userGoalExTimeWeek', value)),
              ),
              const SizedBox(height: 16),
              RichText(
                text: TextSpan(
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppColors.blueGrayColor),
                  children: [
                    const TextSpan(text: ' เฉลี่ย '),
                    TextSpan(
                      text: _calculateAverageExPerDay(userGoalEx),
                    ),
                    const TextSpan(text: ' นาที/วัน'),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
