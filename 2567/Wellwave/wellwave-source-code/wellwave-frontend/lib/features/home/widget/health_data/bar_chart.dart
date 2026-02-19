import 'package:flutter/material.dart';

import 'daily_bar_chart_painter.dart';
import 'weekly_bar_chart_painter.dart';

class BarChart extends StatelessWidget {
  final List<Map<String, dynamic>> data;
  final List<int> weeklyAverages;

  const BarChart({Key? key, required this.data, required this.weeklyAverages})
      : super(key: key);

  List<Map<String, dynamic>> _getPreviousWeekData(
      List<Map<String, dynamic>> data) {
    List<Map<String, dynamic>> sortedData = List.from(data)
      ..sort((a, b) => DateTime.parse(a['date'].toString())
          .compareTo(DateTime.parse(b['date'].toString())));

    DateTime today = DateTime.now();

    DateTime thisWeekSunday = today
        .subtract(Duration(days: today.weekday % 7))
        .toLocal()
        .copyWith(hour: 0, minute: 0, second: 0, millisecond: 0);

    DateTime previousWeekSunday =
        thisWeekSunday.subtract(const Duration(days: 8));

    DateTime previousWeekSaturday =
        previousWeekSunday.add(const Duration(days: 6));

    List<Map<String, dynamic>> previousWeekData = sortedData.where((entry) {
      DateTime entryDate = DateTime.parse(entry['date'].toString())
          .toLocal()
          .copyWith(hour: 0, minute: 0, second: 0, millisecond: 0);

      return entryDate.isAfter(previousWeekSunday) &&
          entryDate.isBefore(previousWeekSaturday.add(const Duration(days: 1)));
    }).toList();

    return previousWeekData;
  }

  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> previousWeekData = _getPreviousWeekData(data);

    return Column(
      children: [
        CustomPaint(
          size: const Size(double.infinity, 64),
          painter: weeklyAverages.length >= 5
              ? WeeklyBarChartPainter(
                  data: data,
                  weeklyAverages: weeklyAverages,
                  context: context,
                )
              : DailyBarChartPainter(
                  data: previousWeekData,
                  weeklyAverages: weeklyAverages,
                  context: context,
                ),
        ),
      ],
    );
  }
}
