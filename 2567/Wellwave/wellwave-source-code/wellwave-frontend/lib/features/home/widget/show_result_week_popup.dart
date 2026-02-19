import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/features/home/widget/circular_chart_widget.dart';

void showResultWeekPopup(BuildContext context) {
  showDialog(
    context: context,
    barrierDismissible: false,
    barrierColor: Colors.black.withOpacity(0.8),
    builder: (BuildContext context) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.whiteColor,
                      borderRadius: BorderRadius.circular(16),
                      border: const Border(
                        bottom: BorderSide(
                          color: AppColors.popUpSkyBlueColor,
                          width: 8.0,
                        ),
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const SizedBox(height: 16.0),
                          Text(
                            AppStrings.resultThisWeekText,
                            style: Theme.of(context)
                                .textTheme
                                .headlineLarge
                                ?.copyWith(color: AppColors.blackColor),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8.0),
                          Text(
                            AppStrings.greatjobText,
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  color: AppColors.blackColor,
                                ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24.0),
                          const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CircularChartWidget(),
                              SizedBox(width: 16.0),
                              CircularChartWidget(),
                              SizedBox(width: 16.0),
                              CircularChartWidget(),
                              SizedBox(width: 16.0),
                              CircularChartWidget(),
                            ],
                          ),
                          const SizedBox(height: 24.0),
                          const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CircularChartWidget(),
                              SizedBox(width: 24.0),
                              CircularChartWidget(),
                              SizedBox(width: 24.0),
                              CircularChartWidget(),
                            ],
                          ),
                          const SizedBox(height: 24.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: AppColors.darkPinkColor,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 4.0),
                              Text(
                                AppStrings.exerciseText,
                                style: Theme.of(context)
                                    .textTheme
                                    .titleSmall
                                    ?.copyWith(
                                      color: AppColors.darkPinkColor,
                                    ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(width: 16.0),
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: AppColors.secondaryDarkColor,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 4.0),
                              Text(
                                AppStrings.stepText,
                                style: Theme.of(context)
                                    .textTheme
                                    .titleSmall
                                    ?.copyWith(
                                      color: AppColors.secondaryDarkColor,
                                    ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: Text(
                      "ปิดหน้าต่างนี้",
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.greyColor,
                            decoration: TextDecoration.underline,
                            decorationColor: AppColors.greyColor,
                          ),
                    ),
                  ),
                ],
              ),
              Positioned(
                top: -36,
                right: -16,
                child: SvgPicture.asset(
                  AppImages.hatIcon,
                  height: 84.0,
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}
