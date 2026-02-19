import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class GoalBox extends StatelessWidget {
  final String title;
  final String icon;
  final bool isMultiSelect;

  const GoalBox({
    Key? key,
    required this.title,
    required this.icon,
    required this.isMultiSelect,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double containerWidth = MediaQuery.of(context).size.width;

    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        bool isSelected;
        isSelected = (state.goalChoose == title);

        return GestureDetector(
          onTap: () {
            String selectionType;

            selectionType = 'goal';

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
                decoration: BoxDecoration(
                  color: AppColors.whiteColor,
                  borderRadius: BorderRadius.circular(12.0),
                  border: Border.all(
                    color: isSelected
                        ? AppColors.primaryColor
                        : AppColors.transparentColor,
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
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(left: 12.0),
                      child: Text(
                        title,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.blackColor,
                            ),
                      ),
                    ),
                    const SizedBox(
                      height: 16,
                    ),
                    SvgPicture.asset(
                      icon,
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
