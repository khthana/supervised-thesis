import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/health_assessment/data/repositories/health_assessment_repository.dart';
import 'package:wellwave_frontend/features/health_assessment/presentation/screen/health_assessment_screen.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/profile_repositories.dart';

import '../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';

class StartHealthStep extends StatelessWidget {
  const StartHealthStep({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              SvgPicture.asset(
                AppImages.healthassessmentIMG,
                width: 238,
              ),
              const SizedBox(
                height: 48,
              ),
              Text(
                AppStrings.healthAssessmentText,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(
                height: 16,
              ),
              Text(
                AppStrings.healthAssessmentDetailsText,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.blackColor,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(
                height: 48,
              ),
              CustomButton(
                width: 250,
                bgColor: AppColors.primaryColor,
                textColor: AppColors.whiteColor,
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => BlocProvider(
                        create: (context) => HealthAssessmentPageBloc(
                          healthAssessmentRepository:
                              HealthAssessmentRepository(),
                          profileRepositories: ProfileRepositories(),
                        ),
                        child: const AssessmentScreenView(),
                      ),
                    ),
                  );
                },
                title: 'เข้าสู่แบบประเมิน',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
