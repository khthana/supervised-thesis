import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/component/rectangle_box.dart';

class FamilyHistoryStep extends StatelessWidget {
  const FamilyHistoryStep({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.famhisAskText,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(
            height: 48,
          ),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RectangleBox(
                icon: AppImages.famhistoryHyperIcon,
                title: AppStrings.hypertensionText,
                isMultiSelect: true,
              ),
              RectangleBox(
                icon: AppImages.famhistoryArteryIcon,
                title: AppStrings.coronaryArteryText,
                isMultiSelect: true,
              ),
            ],
          ),
          const SizedBox(
            height: 24,
          ),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RectangleBox(
                icon: AppImages.famhistoryDiabetesIcon,
                title: AppStrings.diabetesText,
                isMultiSelect: true,
              ),
              RectangleBox(
                icon: AppImages.famhistoryVascularIcon,
                title: AppStrings.hyperlipidemiaText,
                isMultiSelect: true,
              ),
            ],
          ),
          const SizedBox(
            height: 24,
          ),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RectangleBox(
                icon: AppImages.famhistoryParalysisIcon,
                title: AppStrings.paralysisText,
                isMultiSelect: true,
              ),
              RectangleBox(
                icon: AppImages.famhistoryConfusedIcon,
                title: AppStrings.unknownDiseaseText,
                isMultiSelect: true,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
