import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/component/rectangle_box.dart';

class AlcoholStep extends StatelessWidget {
  const AlcoholStep({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.drinkalcoholAskText,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(
            height: 48,
          ),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RectangleBox(
                icon: AppImages.alcoholUsuallyIcon,
                title: AppStrings.drinkUsuallyText,
                subtitle: AppStrings.more5timesText,
                isMultiSelect: false,
              ),
              RectangleBox(
                icon: AppImages.alcoholSometimesIcon,
                title: AppStrings.drinkSometimesText,
                subtitle: AppStrings.less5timesText,
                isMultiSelect: false,
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
                icon: AppImages.alcoholUsedtoIcon,
                title: AppStrings.drinkUsedtoText,
                isMultiSelect: false,
              ),
              RectangleBox(
                icon: AppImages.alcoholNeverIcon,
                title: AppStrings.drinkNeverText,
                isMultiSelect: false,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
