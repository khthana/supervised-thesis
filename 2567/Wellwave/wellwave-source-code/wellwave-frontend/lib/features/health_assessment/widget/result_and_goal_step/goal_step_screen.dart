import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/custom_text_form_field.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_event.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class GoalStepScreen extends StatefulWidget {
  const GoalStepScreen({super.key});

  @override
  _GoalStepScreen createState() => _GoalStepScreen();
}

class _GoalStepScreen extends State<GoalStepScreen> {
  String? recommendationText;
  int recommendGoalStep = 0;

  @override
  void initState() {
    super.initState();

    final yearOfBirth =
        context.read<HealthAssessmentPageBloc>().state.formData['birthYear'];

    int age = 0;

    if (yearOfBirth != null) {
      int? birthYear = int.tryParse(yearOfBirth);
      if (birthYear != null) {
        int currentYear = DateTime.now().year + 543;
        age = currentYear - birthYear;
      }
    }

    if (age <= 30) {
      recommendGoalStep = 80000;
    } else if (age > 30 && age <= 60) {
      recommendGoalStep = 60000;
    } else {
      recommendGoalStep = 40000;
    }

    final currentGoalStep = context
        .read<HealthAssessmentPageBloc>()
        .state
        .formData['userGoalStepWeek'];

    if (currentGoalStep == null || currentGoalStep.isEmpty) {
      context
          .read<HealthAssessmentPageBloc>()
          .add(UpdateField('userGoalStepWeek', recommendGoalStep.toString()));
    }

    recommendationText = AppStrings.recommendText;

    debugPrint("age: $age");
    debugPrint("age: $age");
    debugPrint("userGoalStep: $currentGoalStep");
    debugPrint("recommendGoalStep: $recommendGoalStep");
  }

  @override
  void dispose() {
    super.dispose();
  }

  String _calculateAverageStepsPerDay(String weeklySteps) {
    final weekly = int.tryParse(weeklySteps) ?? 0;
    final average = (weekly / 7).round();
    return average.toString();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        final userGoalStep =
            state.formData['userGoalStepWeek'] ?? recommendGoalStep.toString();

        return Scaffold(
          backgroundColor: AppColors.transparentColor,
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                AppStrings.goalStepText,
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(color: AppColors.blackColor),
              ),
              const SizedBox(height: 64),
              if (userGoalStep == recommendGoalStep.toString())
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
                hintText: AppStrings.stepCountText,
                keyboardType: TextInputType.number,
                suffixText: AppStrings.suffixStepText,
                initialValue: userGoalStep,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(6),
                ],
                onChanged: (value) => context
                    .read<HealthAssessmentPageBloc>()
                    .add(UpdateField('userGoalStepWeek', value)),
              ),
              const SizedBox(height: 16),
              RichText(
                text: TextSpan(
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppColors.blueGrayColor),
                  children: [
                    const TextSpan(text: 'เฉลี่ย '),
                    TextSpan(
                      text: _calculateAverageStepsPerDay(userGoalStep),
                    ),
                    const TextSpan(text: ' ก้าว/วัน'),
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
