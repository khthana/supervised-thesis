import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/widget/friend_line_chart.dart';
import 'package:wellwave_frontend/features/friend/presentation/widget/friend_progress_chart_card.dart';

class FriendLogProgressChart<T> extends StatelessWidget {
  final String title;
  final String unit;
  final String logType;
  final String selectedPeriod;
  final Function(String) onPeriodSelected;
  final List<T> logs;
  final double Function(T log) getValue;
  final DateTime Function(T log) getDate;
  final T Function(DateTime date, double value) createLog;

  const FriendLogProgressChart({
    Key? key,
    required this.title,
    required this.unit,
    required this.logType,
    required this.selectedPeriod,
    required this.onPeriodSelected,
    required this.logs,
    required this.getValue,
    required this.getDate,
    required this.createLog,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    List<T> filteredLogs = [];

    if (logs.isNotEmpty) {
      filteredLogs = filterLogsByPeriod(logs, selectedPeriod);

      print('=== FriendLogProgressChart Debug ===');
      print('Filtered Logs: $filteredLogs');

      final chartData = filteredLogs
          .map((log) => {
                'date': getDate(log).toIso8601String(),
                'value': getValue(log),
              })
          .toList();

      return FriendProgressChartCard(
        title: title,
        value: filteredLogs.isNotEmpty ? getValue(filteredLogs.last) : 0.0,
        unit: unit,
        chartValues: filteredLogs.map((log) => getValue(log)).toList(),
        chart: FriendLineChart(
          logType: logType,
          logs: chartData,
          selectedPeriod: selectedPeriod,
        ),
        selectedPeriod: selectedPeriod,
        onPeriodSelected: onPeriodSelected,
        friendUid: context.read<FriendBloc>().state.searchId,
      );
    }

    return const Center(child: Text('No data available'));
  }

  List<T> filterLogsByPeriod(List<T> logs, String period) {
    switch (period) {
      case '14 วัน':
        return logs.length <= 14 ? logs : logs.sublist(logs.length - 14);
      case '1 เดือน':
        return averageLogsByWeek(logs, DateTime.now(), 4);
      case '3 เดือน':
        return averageLogsByWeek(logs, DateTime.now(), 12);
      default:
        print('fetch 7');
        return logs.length <= 6 ? logs : logs.sublist(logs.length - 6);
    }
  }

  List<T> averageLogsByWeek(List<T> logs, DateTime selectedDate, int weeks) {
    List<T> weeklyAverages = [];
    DateTime currentStart = startOfWeek(selectedDate);

    for (int i = 0; i < weeks; i++) {
      DateTime currentEnd = endOfWeek(currentStart);

      List<T> weekLogs = logs.where((log) {
        DateTime logDate = getDate(log);
        return logDate
                .isAfter(currentStart.subtract(const Duration(days: 1))) &&
            logDate.isBefore(currentEnd.add(const Duration(days: 1)));
      }).toList();

      if (weekLogs.isNotEmpty) {
        double average =
            weekLogs.map((log) => getValue(log)).reduce((a, b) => a + b) /
                weekLogs.length;

        weeklyAverages.add(createLog(
          currentEnd,
          double.parse(average.toStringAsFixed(1)),
        ));
      } else if (weeklyAverages.isNotEmpty) {
        weeklyAverages.add(createLog(
          currentEnd,
          getValue(weeklyAverages.last),
        ));
      }

      currentStart = currentStart.subtract(const Duration(days: 7));
    }

    return weeklyAverages.reversed.toList();
  }

  DateTime startOfWeek(DateTime date) {
    int difference = date.weekday - DateTime.monday;
    return date.subtract(Duration(days: difference));
  }

  DateTime endOfWeek(DateTime date) {
    int difference = DateTime.sunday - date.weekday;
    return date.add(Duration(days: difference));
  }
}
