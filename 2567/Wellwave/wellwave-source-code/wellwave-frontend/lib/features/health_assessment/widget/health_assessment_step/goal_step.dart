import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/component/goal_box.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class GoalStep extends StatelessWidget {
  const GoalStep({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        double weight = state.formData['weight'] != null
            ? double.tryParse(state.formData['weight']!) ?? 0.0
            : 0.0;
        double height = state.formData['height'] != null
            ? (double.tryParse(state.formData['height']!) ?? 0.0) / 100
            : 0.0;

        double bmi = (height > 0) ? (weight / (height * height)) : 0.0;

        if (bmi < 18.5 && state.goalChoose == 'ลดน้ำหนัก') {
          context.read<HealthAssessmentPageBloc>().add(
                ToggleSelectionEvent('', false, 'goal'),
              );
        }

        return SingleChildScrollView(
          child: Column(
            children: [
              Text(
                AppStrings.goalAskText,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(
                height: 48,
              ),
              const GoalBox(
                icon: AppImages.goalMuscleIcon,
                title: AppStrings.goalMuscleText,
                isMultiSelect: false,
              ),
              const SizedBox(
                height: 24,
              ),
              const GoalBox(
                icon: AppImages.goalHealthyIcon,
                title: AppStrings.goalHealthyText,
                isMultiSelect: false,
              ),
              if (bmi > 18.5) ...[
                const SizedBox(
                  height: 24,
                ),
                const GoalBox(
                  icon: AppImages.goalLoseweightIcon,
                  title: AppStrings.goalLoseweightText,
                  isMultiSelect: false,
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
