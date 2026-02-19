import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/features/logs/presentation/bloc/logs_bloc.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/chart.dart';

class WeeklyLogsCard<T> extends StatelessWidget {
  final String title;
  final String unit;
  final String logType;
  final List<T> Function(LogsState state) getLogs;
  final double Function(T log) getValue;
  final DateTime Function(T log) getDate;
  final T Function(DateTime date, double value) createLog;

  const WeeklyLogsCard({
    Key? key,
    required this.title,
    required this.unit,
    required this.logType,
    required this.getLogs,
    required this.getValue,
    required this.getDate,
    required this.createLog,
  }) : super(key: key);

  List<T> filterLogsByPeriod(List<T> logs) {
    logs.sort((a, b) => getDate(a).compareTo(getDate(b)));

    return logs.length <= 4 ? logs : logs.sublist(logs.length - 4);
  }

  T? getLastLog(List<T> logs) {
    return logs.isNotEmpty ? logs.last : null;
  }

  T? getPreviousLog(List<T> logs) {
    return logs.length > 1 ? logs[logs.length - 2] : null;
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LogsBloc, LogsState>(
      builder: (context, state) {
        List<T> filteredLogs = [];
        T? lastLog;
        T? previousLog;

        if (state is LogsLoadGraphSuccess) {
          final logs = getLogs(state);
          if (logs.isNotEmpty) {
            filteredLogs = filterLogsByPeriod(logs);
            lastLog = getLastLog(filteredLogs);
            previousLog = getPreviousLog(filteredLogs);
          }
        }

        return Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.25),
                  offset: const Offset(0, 0),
                  blurRadius: 4,
                  spreadRadius: 0,
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    if (lastLog != null) ...[
                      Text(
                        '${getValue(lastLog)}',
                        style: Theme.of(context)
                            .textTheme
                            .headlineLarge
                            ?.copyWith(
                                color: Colors.black,
                                fontWeight: FontWeight.bold,
                                fontSize: 20),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        unit,
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: Colors.black, fontSize: 11.0),
                      ),
                      const SizedBox(width: 2),
                      if (previousLog != null) ...[
                        _buildDifferenceWidget(
                            context, getValue(lastLog), getValue(previousLog))
                      ]
                    ] else ...[
                      Text(
                        'No data',
                        style: Theme.of(context).textTheme.bodyMedium,
                      )
                    ]
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: LineChartSample2(
                        logType: logType,
                        logs: filteredLogs,
                        selectedPeriod: '7 วัน',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDifferenceWidget(
      BuildContext context, double currentValue, double previousValue) {
    double difference = currentValue - previousValue;
    bool isPositive = difference >= 0;

    return Row(
      children: [
        Icon(
          isPositive ? Icons.arrow_upward : Icons.arrow_downward,
          size: 16,
          color: isPositive ? Colors.red : AppColors.greenColor,
        ),
        Text(
          '${difference.abs().toStringAsFixed(1)} $unit',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: isPositive ? Colors.red : AppColors.greenColor,
              fontSize: 11.0),
        ),
      ],
    );
  }
}
