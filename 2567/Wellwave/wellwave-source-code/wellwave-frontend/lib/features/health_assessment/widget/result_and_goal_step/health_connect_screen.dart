import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_event.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class HealthConnectScreen extends StatelessWidget {
  const HealthConnectScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        return Scaffold(
          body: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Stack(
              children: [
                Center(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SvgPicture.asset(AppImages.healthconnectIcon),
                      const SizedBox(height: 64),
                      Text(
                        AppStrings.connectHealthAskText,
                        textAlign: TextAlign.center,
                        style: Theme.of(context)
                            .textTheme
                            .titleLarge
                            ?.copyWith(color: AppColors.blackColor),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        AppStrings.connectHealthDetailsText,
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
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 48.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CustomButton(
                          width: 250,
                          bgColor: AppColors.primaryColor,
                          textColor: AppColors.backgroundColor,
                          onPressed: () {
                            context
                                .read<HealthAssessmentPageBloc>()
                                .add(ShowFinishEvent());
                          },
                          title: 'เชื่อมต่อทันที',
                        ),
                        const SizedBox(height: 12),
                        CustomButton(
                          bgColor: Colors.transparent,
                          textColor: AppColors.darkGrayColor,
                          width: 250,
                          onPressed: () {
                            context
                                .read<HealthAssessmentPageBloc>()
                                .add(ShowFinishEvent());
                          },
                          title: 'ไว้ภายหลัง',
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
