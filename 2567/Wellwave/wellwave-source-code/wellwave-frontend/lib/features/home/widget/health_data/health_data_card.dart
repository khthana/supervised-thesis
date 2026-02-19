import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/widget/health_data/bar_chart.dart';

class HealthDataCard extends StatelessWidget {
  final List<int> weeklyAverages;
  final List<Map<String, dynamic>> chartData;

  const HealthDataCard({
    super.key,
    required this.weeklyAverages,
    required this.chartData,
  });

  @override
  Widget build(BuildContext context) {
    String message = '';

    if (weeklyAverages.isNotEmpty) {
      bool isLessThanPrevious = weeklyAverages.length > 1 &&
          weeklyAverages.last < weeklyAverages[weeklyAverages.length - 2];

      message = isLessThanPrevious
          ? AppStrings.stepTimeMessageLessThanPrevious
              .replaceFirst('{0}', '${weeklyAverages.last}')
          : AppStrings.stepTimeMessageContinuity
              .replaceFirst('{0}', '${weeklyAverages.last}');
    }

    return Container(
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            spreadRadius: 2,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            message,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.blackColor,
                ),
          ),
          const SizedBox(height: 16),
          BarChart(
            data: chartData,
            weeklyAverages: weeklyAverages,
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
