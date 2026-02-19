import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

import 'custom_dropdown.dart';

class ProgressChartCard extends StatefulWidget {
  final String title;
  final double value;
  final String unit;
  final List<double> chartValues;
  final Widget chart;
  final String selectedPeriod;
  final Function(String) onPeriodSelected;

  const ProgressChartCard({
    Key? key,
    required this.title,
    required this.value,
    required this.unit,
    required this.chartValues,
    required this.chart,
    required this.selectedPeriod,
    required this.onPeriodSelected,
  }) : super(key: key);

  @override
  State<ProgressChartCard> createState() => _ProgressChartCardState();
}

class _ProgressChartCardState extends State<ProgressChartCard> {
  @override
  Widget build(BuildContext context) {
    int periodDays =
        int.tryParse(widget.selectedPeriod.replaceAll('วัน', '').trim()) ?? 7;
    List<double> valuesForAverage =
        widget.chartValues.take(periodDays).toList();
    double average = valuesForAverage.isNotEmpty
        ? valuesForAverage.reduce((a, b) => a + b) / valuesForAverage.length
        : 0;

    double difference = widget.value - average;
    bool isPositive = difference >= 0;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        widget.title,
                        style:
                            Theme.of(context).textTheme.titleSmall?.copyWith(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        widget.value.toStringAsFixed(0),
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontSize: 20),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        widget.unit,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              fontSize: 11.0,
                              color: Colors.black,
                            ),
                      ),
                      const SizedBox(width: 2),
                      Row(
                        children: [
                          Icon(
                            isPositive
                                ? Icons.arrow_upward
                                : Icons.arrow_downward,
                            size: 16,
                            color:
                                isPositive ? AppColors.greenColor : Colors.red,
                          ),
                          Text(
                            '${difference.abs().toStringAsFixed(1)} ${widget.unit} จากค่าเฉลี่ย',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      fontSize: 11.0,
                                      color: isPositive
                                          ? AppColors.greenColor
                                          : Colors.red,
                                    ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
              CustomDropdownButton(
                selectedPeriod: widget.selectedPeriod,
                onPeriodSelected: widget.onPeriodSelected,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(child: widget.chart),
            ],
          ),
        ],
      ),
    );
  }
}
