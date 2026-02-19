import 'package:flutter/material.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class CircularChartWidget extends StatelessWidget {
  const CircularChartWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            CircularPercentIndicator(
              radius: 26.0,
              lineWidth: 8.0,
              percent: 0.5,
              animation: false,
              progressColor: AppColors.darkPinkColor,
              backgroundColor: AppColors.lightgrayColor,
              circularStrokeCap: CircularStrokeCap.round,
            ),
            CircularPercentIndicator(
              radius: 16.0,
              lineWidth: 6.0,
              percent: 0.25,
              animation: false,
              progressColor: AppColors.secondaryDarkColor,
              backgroundColor: AppColors.lightgrayColor,
              circularStrokeCap: CircularStrokeCap.round,
            ),
          ],
        ),
        const SizedBox(
          height: 12,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '50%',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.darkPinkColor,
                  ),
            ),
            Text(
              '|',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.lightgrayColor,
                  ),
            ),
            Text(
              '25%',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.secondaryDarkColor,
                  ),
            ),
          ],
        ),
      ],
    );
  }
}

class ChartData {
  final String label;
  final double value;
  final Color color;

  ChartData(this.label, this.value, this.color);
}
