import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/component/rectangle_box.dart';

class SmokeStep extends StatelessWidget {
  const SmokeStep({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "คุณสูบบุหรี่หรือไม่?",
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(
            height: 48,
          ),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RectangleBox(
                icon: AppImages.smokeUsuallyIcon,
                title: AppStrings.smokeUsuallyText,
                isMultiSelect: false,
              ),
              RectangleBox(
                icon: AppImages.smokeUedtoIcon,
                title: AppStrings.smokeUedtoText,
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
                icon: AppImages.smokeNeverIcon,
                title: AppStrings.smokeNeverText,
                isMultiSelect: false,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
