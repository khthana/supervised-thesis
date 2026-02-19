import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/logs/data/models/logs_request_model_waistline.dart';
import 'package:wellwave_frontend/features/logs/presentation/bloc/logs_bloc.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/input_button.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/weekly_logs_card.dart';

import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_images.dart';
import '../../data/models/logs_request_model_weight.dart';

class WeeklyLogs extends StatefulWidget {
  const WeeklyLogs({super.key});

  @override
  State<WeeklyLogs> createState() => _WeeklyLogsState();
}

class _WeeklyLogsState extends State<WeeklyLogs> {
  @override
  void initState() {
    super.initState();
    final today = DateTime.now();
    context.read<LogsBloc>().add(LogsFetchedGraph(today));
    // debugPrint('Dispatched LogsFetchedGraph event');
  }

  @override
  Widget build(BuildContext context) {
    // debugPrint('WeeklyLogs build called');

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BlocBuilder<LogsBloc, LogsState>(
            builder: (context, state) {
              bool logsRecorded = false;
              DateTime startOfWeek(DateTime date) {
                // Monday
                int difference = date.weekday - DateTime.monday;
                return date.subtract(Duration(days: difference));
              }

              DateTime endOfWeek(DateTime date) {
                // Sunday
                int difference = DateTime.sunday - date.weekday;
                return date.add(Duration(days: difference));
              }

              if (state is LogsLoadGraphInProgress) {
                return const Center(child: CircularProgressIndicator());
              } else if (state is LogsLoadGraphSuccess) {
                bool isCurrentWeek(DateTime logDate, DateTime today) {
                  DateTime startOfCurrentWeek = startOfWeek(today);
                  DateTime endOfCurrentWeek = endOfWeek(today);

                  return logDate.isAfter(startOfCurrentWeek
                          .subtract(const Duration(days: 1))) &&
                      logDate.isBefore(
                          endOfCurrentWeek.add(const Duration(days: 1)));
                }

                logsRecorded = (state.logsWaistLinelist.any(
                        (log) => isCurrentWeek(log.date, DateTime.now())) ||
                    state.logsWeightlist
                        .any((log) => isCurrentWeek(log.date, DateTime.now())));

                return Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          children: [
                            Text(
                              AppStrings.weeklyLogsText,
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineMedium
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        logsRecorded
                            ? Container(
                                padding: const EdgeInsets.symmetric(
                                    vertical: 4.0, horizontal: 8.0),
                                decoration: BoxDecoration(
                                  color: Colors.grey[400],
                                  borderRadius: BorderRadius.circular(16.0),
                                ),
                                child: Text(
                                  AppStrings.dataRecordingCompletedText,
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleSmall
                                      ?.copyWith(color: Colors.white),
                                ),
                              )
                            : const InputButton(
                                buttonText: AppStrings.dataRecordingText,
                              ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    BlocBuilder<LogsBloc, LogsState>(
                      builder: (context, state) {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                WeeklyLogsCard<LogsWeightRequestModel>(
                                  title: AppStrings.weightText,
                                  unit: AppStrings.kgText,
                                  logType: AppStrings.weightLogText,
                                  getLogs: (state) {
                                    if (state is LogsLoadGraphSuccess) {
                                      return state.logsWeightlist;
                                    }
                                    return [];
                                  },
                                  getValue: (log) => log.value,
                                  getDate: (log) => log.date,
                                  createLog: (date, value) =>
                                      LogsWeightRequestModel(
                                          date: date, value: value),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                WeeklyLogsCard<LogsWaistLineRequestModel>(
                                  title: AppStrings.waistLineText,
                                  unit: AppStrings.cmText,
                                  logType: AppStrings.waistLineLogText,
                                  getLogs: (state) {
                                    if (state is LogsLoadGraphSuccess) {
                                      return state.logsWaistLinelist;
                                    }
                                    return [];
                                  },
                                  getValue: (log) => log.value,
                                  getDate: (log) => log.date,
                                  createLog: (date, value) =>
                                      LogsWaistLineRequestModel(
                                          date: date, value: value),
                                ),
                              ],
                            )
                          ],
                        );
                      },
                    )
                  ],
                );
              } else if (state is LogsError) {
                return Center(
                    child: Column(
                  children: [
                    Image.asset(AppImages.catNoItemimage, height: 128),
                    const SizedBox(height: 32),
                    Text(
                      AppStrings.errorLoadingLogsText,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.darkGrayColor,
                          ),
                    ),
                  ],
                ));
              }

              return Center(
                  child: Column(
                children: [
                  Image.asset(AppImages.catNoItemimage, height: 128),
                  const SizedBox(height: 32),
                  Text(
                    AppStrings.noLogsAvailableText,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.darkGrayColor,
                        ),
                  ),
                ],
              ));
            },
          ),
        ],
      ),
    );
  }
}
