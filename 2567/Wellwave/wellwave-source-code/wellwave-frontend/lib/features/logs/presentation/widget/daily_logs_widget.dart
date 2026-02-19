import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/logs/presentation/bloc/logs_bloc.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/logs_history_card.dart';

class DailyLogsWidget extends StatelessWidget {
  final DateTime selectedDate;

  const DailyLogsWidget({
    Key? key,
    required this.selectedDate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    context.read<LogsBloc>().add(
          LogsFetched(selectedDate),
        );

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.dailyLogsText,
            style: Theme.of(context)
                .textTheme
                .headlineMedium
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          BlocBuilder<LogsBloc, LogsState>(
            builder: (context, state) {
              if (state is LogsLoadInProgress) {
                // debugPrint('daily log widget');

                return const Center(child: CircularProgressIndicator());
              } else if (state is LogsLoadSuccess) {
                // debugPrint(
                // 'Received LogsLoadDailySuccess with ${state.logslist.length} logs');
                double? selectedSleepHours;
                double? selectedDrinkLogs;
                double? stepCount;

                for (var log in state.logslist) {
                  if (log?.logName == AppStrings.sleepLogText) {
                    selectedSleepHours = log?.value;
                  } else if (log?.logName == AppStrings.drinkLogText) {
                    selectedDrinkLogs = log?.value;
                  }
                  if (log?.logName == AppStrings.stepLogText) {
                    stepCount = log?.value;
                  }
                }

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (selectedDrinkLogs != null)
                      Row(
                        children: [
                          LogsHistoryCard(
                            svgPath: AppImages.threeWaterIcon,
                            title: AppStrings.drinkText,
                            isShow: false,
                            value: selectedDrinkLogs,
                            unit: AppStrings.glassesText,
                            isSvg: true,
                            svgWidth: 64,
                            svgHeight: 64,
                            isDecimal: false,
                          ),
                        ],
                      ),
                    const SizedBox(height: 8.0),
                    if (selectedSleepHours != null)
                      Row(
                        children: [
                          LogsHistoryCard(
                            svgPath: AppImages.sleepLogsIcon,
                            title: AppStrings.sleepText,
                            value: selectedSleepHours,
                            isShow: false,
                            isSvg: true,
                            unit: AppStrings.hoursText,
                            svgWidth: 64,
                            svgHeight: 64,
                            isDecimal: false,
                          ),
                        ],
                      ),
                    const SizedBox(height: 8.0),
                    if (stepCount != null)
                      Row(
                        children: [
                          LogsHistoryCard(
                            svgPath: AppImages.stepCountImage,
                            title: AppStrings.stepWalkText,
                            isShow: true,
                            value: stepCount,
                            lastWeekValue: 0,
                            unit: AppStrings.stepText,
                            isSvg: true,
                            svgWidth: 64,
                            svgHeight: 64,
                            isOpposite: true,
                            isDecimal: false,
                          ),
                        ],
                      ),
                    if (selectedSleepHours == null &&
                        selectedDrinkLogs == null &&
                        stepCount == null)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            AppStrings.noDataForTodayText,
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppColors.darkGrayColor,
                                    ),
                          )
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
            },
          ),
        ],
      ),
    );
  }
}
