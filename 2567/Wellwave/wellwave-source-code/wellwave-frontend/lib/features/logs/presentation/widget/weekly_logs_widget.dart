import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/logs/presentation/bloc/logs_bloc.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/logs_history_card.dart';

class WeeklyLogsWidget extends StatelessWidget {
  final DateTime selectedDate;

  const WeeklyLogsWidget({
    Key? key,
    required this.selectedDate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    context.read<LogsBloc>().add(LogsFetched(selectedDate));

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

    final start = startOfWeek(selectedDate);
    final end = endOfWeek(selectedDate);

    // Format the dates
    String formattedStart = formatDateThai(start);
    String formattedEnd = formatDateThai(end);

    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 36.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(
            AppStrings.weeklyLogsText,
            style: Theme.of(context)
                .textTheme
                .headlineMedium
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          BlocBuilder<LogsBloc, LogsState>(builder: (context, state) {
            if (state is LogsLoadInProgress) {
              // debugPrint('weekly log widget');

              return const Center(child: CircularProgressIndicator());
            } else if (state is LogsLoadSuccess) {
              final currentWeekLogs = state.logsWeeklyList;
              final lastWeekLogs = state.logsLastWeekList;

              double? weightCount;
              double? waistLineCount;
              double? hdlCount;
              double? ldlCount;

              double lastWeekWeight = 0.0;
              double lastWeekWaistLine = 0.0;
              double lastWeekHdl = 0.0;
              double lastWeekLdl = 0.0;

              double totalSteps = 0.0;

              for (var log in currentWeekLogs) {
                if (log?.logName == AppStrings.stepLogText) {
                  totalSteps += log?.value ?? 0.0;
                } else if (log?.logName == AppStrings.weightLogText) {
                  weightCount = log?.value;
                } else if (log?.logName == AppStrings.waistLineLogText) {
                  waistLineCount = log?.value;
                } else if (log?.logName == AppStrings.hdlLogText) {
                  hdlCount = log?.value;
                } else if (log?.logName == AppStrings.ldlLogText) {
                  ldlCount = log?.value;
                }
              }

              for (var log in lastWeekLogs) {
                if (log?.logName == AppStrings.weightLogText) {
                  lastWeekWeight = log?.value ?? 0.0;
                } else if (log?.logName == AppStrings.waistLineLogText) {
                  lastWeekWaistLine = log?.value ?? 0.0;
                } else if (log?.logName == AppStrings.hdlLogText) {
                  lastWeekHdl = log?.value ?? 0.0;
                } else if (log?.logName == AppStrings.ldlLogText) {
                  lastWeekLdl = log?.value ?? 0.0;
                }
              }

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        '${AppStrings.xDateText} $formattedStart - $formattedEnd',
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: AppColors.darkGrayColor),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  if (totalSteps != 0.0)
                    Row(
                      children: [
                        LogsHistoryCard(
                          svgPath: AppImages.stepCountImage,
                          title: AppStrings.stepWalkText,
                          isShow: true,
                          value: totalSteps,
                          lastWeekValue: state.logsLastWeekList.fold<double>(
                            0.0,
                            (previousValue, log) =>
                                log?.logName == AppStrings.stepLogText
                                    ? previousValue + (log?.value ?? 0.0)
                                    : previousValue,
                          ),
                          unit: AppStrings.stepText,
                          isSvg: true,
                          svgWidth: 64,
                          svgHeight: 64,
                          isOpposite: true,
                          isDecimal: false,
                        ),
                      ],
                    ),
                  const SizedBox(height: 8.0),
                  if (weightCount != null)
                    Row(
                      children: [
                        LogsHistoryCard(
                          svgPath: AppImages.weightIcon,
                          title: AppStrings.weightText,
                          isShow: true,
                          value: weightCount,
                          lastWeekValue: lastWeekWeight,
                          unit: AppStrings.kgText,
                          isSvg: true,
                          svgWidth: 64,
                          svgHeight: 64,
                        ),
                      ],
                    ),
                  const SizedBox(height: 8.0),
                  if (waistLineCount != null)
                    Row(
                      children: [
                        LogsHistoryCard(
                          svgPath: AppImages.waistLineIcon,
                          title: AppStrings.waistLineText,
                          isShow: true,
                          value: waistLineCount,
                          lastWeekValue: lastWeekWaistLine,
                          unit: AppStrings.cmText,
                          isSvg: true,
                          svgWidth: 64,
                          svgHeight: 64,
                        ),
                      ],
                    ),
                  const SizedBox(height: 8.0),
                  if (hdlCount != null)
                    Row(
                      children: [
                        LogsHistoryCard(
                          pngPath: AppImages.hdlImage,
                          title: AppStrings.hdlText,
                          isShow: true,
                          value: hdlCount,
                          lastWeekValue: lastWeekHdl,
                          unit: AppStrings.mgPerDlText,
                          isSvg: false,
                          pngWidth: 64,
                          pngHeight: 64,
                          isShowCriteria: true,
                          lowerBand: 45,
                          isOpposite: true,
                        ),
                      ],
                    ),
                  const SizedBox(height: 8.0),
                  if (ldlCount != null)
                    Row(
                      children: [
                        LogsHistoryCard(
                          pngPath: AppImages.ldlImage,
                          title: AppStrings.ldlText,
                          isShow: true,
                          value: ldlCount,
                          lastWeekValue: lastWeekLdl,
                          unit: AppStrings.mgPerDlText,
                          isSvg: false,
                          pngWidth: 64,
                          pngHeight: 64,
                          isShowCriteria: true,
                          upperBand: 160,
                        ),
                      ],
                    ),
                  const SizedBox(height: 8.0),
                  if (totalSteps == 0.0 &&
                      weightCount == null &&
                      waistLineCount == null &&
                      hdlCount == null &&
                      ldlCount == null)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          AppStrings.noDataForWeekText,
                          style: Theme.of(context)
                              .textTheme
                              .bodySmall
                              ?.copyWith(color: AppColors.darkGrayColor),
                        ),
                      ],
                    ),
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
          })
        ]));
  }
}

String formatDateThai(DateTime date) {
  int day = date.day;
  String month = AppStrings.thaiMonths[date.month - 1];
  int year = date.year + 543; // Buddhist calendar

  return '$day $month $year';
}
