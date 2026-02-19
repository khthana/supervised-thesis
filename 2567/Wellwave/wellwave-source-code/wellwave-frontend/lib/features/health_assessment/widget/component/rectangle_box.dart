import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class RectangleBox extends StatelessWidget {
  final String title;
  final String? subtitle;
  final String icon;
  final bool isMultiSelect;

  const RectangleBox({
    Key? key,
    required this.title,
    required this.icon,
    this.subtitle,
    required this.isMultiSelect,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double containerWidth = MediaQuery.of(context).size.width / 2 - 32;

    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        bool isSelected;

        final currentStep =
            context.read<HealthAssessmentPageBloc>().state.currentStep;

        if (currentStep == 4) {
          isSelected = (state.alcoholChoose == title);
        } else if (currentStep == 5) {
          isSelected = (state.smokeChoose == title);
        } else if (currentStep == 6) {
          isSelected = (state.goalChoose == title);
        } else {
          isSelected = state.famhisChoose.contains(title);
        }

        return GestureDetector(
          onTap: () {
            String selectionType;

            if (currentStep == 4) {
              selectionType = 'alcohol';
            } else if (currentStep == 5) {
              selectionType = 'smoke';
            } else {
              selectionType = 'famhis';
            }
            debugPrint('SelectionType: $selectionType');
            context.read<HealthAssessmentPageBloc>().add(
                  ToggleSelectionEvent(title, isMultiSelect, selectionType),
                );
          },
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: containerWidth,
                height: 128,
                padding: const EdgeInsets.all(12.0),
                decoration: BoxDecoration(
                  color: AppColors.whiteColor,
                  borderRadius: BorderRadius.circular(12.0),
                  border: Border.all(
                    color: isSelected
                        ? AppColors.primaryColor
                        : Colors.transparent,
                    width: 2.0,
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.blackShadow12Color,
                      blurRadius: 4.0,
                      spreadRadius: 0.0,
                      offset: Offset(0, 0),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    SvgPicture.asset(
                      icon,
                      height: 32,
                    ),
                    const SizedBox(
                      height: 16,
                    ),
                    Text(
                      title,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.blackColor,
                          ),
                    ),
                    if (subtitle != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4.0),
                        child: Text(
                          subtitle ?? '',
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: AppColors.darkGrayColor,
                                  ),
                        ),
                      ),
                  ],
                ),
              ),
              if (isSelected)
                Positioned(
                  top: -8,
                  right: -8,
                  child: Container(
                    width: 24,
                    height: 24,
                    decoration: const BoxDecoration(
                      color: AppColors.primaryColor,
                      shape: BoxShape.circle,
                    ),
                    child: SvgPicture.asset(AppImages.checkmarkIcon),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}
