import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/features/profile/presentation/widget/profile/progress_chart_card.dart';
import 'package:wellwave_frontend/features/logs/presentation/bloc/logs_bloc.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/chart.dart';

class LogProgressChart<T> extends StatelessWidget {
  final String title;
  final String unit;
  final String logType;
  final String selectedPeriod;
  final Function(String) onPeriodSelected;
  final List<T> Function(LogsState state) getLogs;
  final double Function(T log) getValue;
  final DateTime Function(T log) getDate;
  final T Function(DateTime date, double value) createLog;

  const LogProgressChart({
    Key? key,
    required this.title,
    required this.unit,
    required this.logType,
    required this.selectedPeriod,
    required this.onPeriodSelected,
    required this.getLogs,
    required this.getValue,
    required this.getDate,
    required this.createLog,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LogsBloc, LogsState>(
      builder: (context, state) {
        List<T> filteredLogs = [];

        if (state is LogsLoadGraphInProgress) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is LogsLoadGraphSuccess) {
          final logs = getLogs(state);
          if (logs.isNotEmpty) {
            filteredLogs = filterLogsByPeriod(logs, selectedPeriod);
          }
        }

        return ProgressChartCard(
          title: title,
          value: filteredLogs.isNotEmpty ? getValue(filteredLogs.last) : 0.0,
          unit: unit,
          chartValues: filteredLogs.map((log) => getValue(log)).toList(),
          chart: LineChartSample2(
            logType: logType,
            logs: filteredLogs,
            selectedPeriod: selectedPeriod,
          ),
          onPeriodSelected: onPeriodSelected,
          selectedPeriod: selectedPeriod,
        );
      },
    );
  }

  List<T> filterLogsByPeriod(List<T> logs, String period) {
    switch (period) {
      case '7 วัน':
        return logs.length <= 7 ? logs : logs.sublist(logs.length - 7);
      case '14 วัน':
        return logs.length <= 14 ? logs : logs.sublist(logs.length - 14);
      case '1 เดือน':
        return averageLogsByWeek(logs, DateTime.now(), 5);
      case '3 เดือน':
        return averageLogsByWeek(logs, DateTime.now(), 12);
      default:
        return logs;
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
