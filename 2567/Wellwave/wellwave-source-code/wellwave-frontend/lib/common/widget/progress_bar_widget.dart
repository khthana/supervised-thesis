import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class ProgressBarWidget extends StatelessWidget {
  final int currentValue;
  final int targetValue;

  const ProgressBarWidget({
    Key? key,
    required this.currentValue,
    required this.targetValue,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double progress = (currentValue / targetValue).clamp(0.0, 1.0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 10,
            backgroundColor: AppColors.gray50Color,
            valueColor:
                const AlwaysStoppedAnimation<Color>(AppColors.primaryColor),
          ),
        ),
      ],
    );
  }
}
