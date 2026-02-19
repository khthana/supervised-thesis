import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class RecommendScreen extends StatelessWidget {
  const RecommendScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        String recommendText = '';
        if (state.goalChoose == 'สร้างกล้ามเนื้อ') {
          recommendText = AppStrings.recommendMuscleText;
        } else if (state.goalChoose == 'ลดน้ำหนัก') {
          recommendText = AppStrings.recommendLoseWeightText;
        } else {
          recommendText = AppStrings.recommendHealthyText;
        }

        return Scaffold(
          body: Center(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SvgPicture.asset(
                  AppImages.recommendPlanIcon,
                  width: 196,
                ),
                const SizedBox(height: 48),
                Text(
                  AppStrings.recommendForYouText,
                  textAlign: TextAlign.center,
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(color: AppColors.blackColor),
                ),
                const SizedBox(height: 16),
                Text(
                  recommendText,
                  textAlign: TextAlign.center,
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppColors.blackColor),
                ),
                const SizedBox(height: 72),
              ],
            ),
          ),
        );
      },
    );
  }
}
