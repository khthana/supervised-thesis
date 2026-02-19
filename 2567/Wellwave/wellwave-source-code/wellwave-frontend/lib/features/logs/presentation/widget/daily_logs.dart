import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/logs/presentation/bloc/logs_bloc.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/daily_logs_card.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/input_daily_logs.dart';

class DailyLogs extends StatefulWidget {
  const DailyLogs({super.key});

  @override
  State<DailyLogs> createState() => _DailyLogsState();
}

class _DailyLogsState extends State<DailyLogs> {
  num selectedWaterLevel = 0;
  num selectedSleepHours = 0;
  DateTime selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    // debugPrint('Sending LogsFetched event');
    BlocProvider.of<LogsBloc>(context).add(LogsFetched(DateTime.now()));
  }

  @override
  Widget build(BuildContext context) {
    // debugPrint('WeeklyLogs build called');

    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(AppStrings.dailyLogsText,
              style: Theme.of(context)
                  .textTheme
                  .headlineMedium
                  ?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          BlocBuilder<LogsBloc, LogsState>(
            builder: (context, state) {
              if (state is LogsLoadInProgress) {
                return const Center(child: CircularProgressIndicator());
              } else if (state is LogsLoadSuccess) {
                for (var log in state.logslist) {
                  if (log?.logName == AppStrings.drinkLogText) {
                    selectedWaterLevel = log?.value ?? 0;
                  } else if (log?.logName == AppStrings.sleepLogText) {
                    selectedSleepHours = log?.value ?? 0;
                  }
                }
              } else if (state is LogsError) {
                return Center(
                    child: Column(
                  children: [
                    Image.asset(AppImages.catNoItemimage, height: 128),
                    const SizedBox(height: 32),
                    Text(
                      '${AppStrings.errorLoadingLogsText}: ${state.message}',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.darkGrayColor,
                          ),
                    ),
                  ],
                ));
              }

              return Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  DailyLogCard(
                    title: AppStrings.amoutOfWaterText,
                    unitLabel: AppStrings.glassesText,
                    selectedLevel: selectedWaterLevel.toInt(),
                    maxLevel: 11,
                    svgIcons: const [
                      AppImages.water0Icon,
                      AppImages.water1Icon,
                      AppImages.water2Icon,
                      AppImages.water3Icon,
                      AppImages.water4Icon,
                      AppImages.water5Icon,
                      AppImages.water6Icon,
                      AppImages.water7Icon,
                      AppImages.water8Icon,
                      AppImages.water9Icon,
                      AppImages.water10Icon,
                    ],
                    onTap: () async {
                      int? result = await showModalBottomSheet<int>(
                        backgroundColor: AppColors.whiteColor,
                        context: context,
                        builder: (context) => InputDailyLogs(
                          initialUnits: selectedWaterLevel.toInt(),
                          title: AppStrings.amoutOfWaterText,
                          unitLabel: AppStrings.glassesText,
                          maxLevel: 10,
                          svgIcons: const [
                            // AppImages.water0Icon,
                            AppImages.water1Icon,
                            AppImages.water2Icon,
                            AppImages.water3Icon,
                            AppImages.water4Icon,
                            AppImages.water5Icon,
                            AppImages.water6Icon,
                            AppImages.water7Icon,
                            AppImages.water8Icon,
                            AppImages.water9Icon,
                            AppImages.water10Icon,
                          ],
                        ),
                      );
                      setState(() {
                        selectedWaterLevel =
                            result != null ? result as num : selectedWaterLevel;
                      });

                      BlocProvider.of<LogsBloc>(context).add(
                        SubmitLogEvent(
                          logName: AppStrings.drinkLogText,
                          value: selectedWaterLevel.toInt(),
                          selectedDate: selectedDate.toIso8601String(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(width: 20),
                  DailyLogCard(
                    title: AppStrings.hoursOfSleepText,
                    unitLabel: AppStrings.hoursText,
                    selectedLevel: selectedSleepHours.toInt(),
                    maxLevel: 11,
                    svgIcons: const [
                      AppImages.moon0Icon,
                      AppImages.moon1Icon,
                      AppImages.moon2Icon,
                      AppImages.moon3Icon,
                      AppImages.moon4Icon,
                      AppImages.moon5Icon,
                      AppImages.moon6Icon,
                      AppImages.moon7Icon,
                      AppImages.moon8Icon,
                      AppImages.moon9Icon,
                      AppImages.moon10Icon,
                    ],
                    onTap: () async {
                      int? result = await showModalBottomSheet<int>(
                        backgroundColor: AppColors.whiteColor,
                        context: context,
                        builder: (context) => InputDailyLogs(
                          title: AppStrings.hoursOfSleepText,
                          initialUnits: selectedSleepHours.toInt(),
                          unitLabel: AppStrings.hoursText,
                          maxLevel: 10,
                          svgIcons: const [
                            // AppImages.moon0Icon,
                            AppImages.moon1Icon,
                            AppImages.moon2Icon,
                            AppImages.moon3Icon,
                            AppImages.moon4Icon,
                            AppImages.moon5Icon,
                            AppImages.moon6Icon,
                            AppImages.moon7Icon,
                            AppImages.moon8Icon,
                            AppImages.moon9Icon,
                            AppImages.moon10Icon,
                          ],
                        ),
                      );
                      setState(() {
                        selectedSleepHours =
                            result != null ? result as num : selectedSleepHours;
                      });

                      BlocProvider.of<LogsBloc>(context).add(
                        SubmitLogEvent(
                          logName: AppStrings.sleepLogText,
                          value: selectedSleepHours.toInt(),
                          selectedDate: selectedDate.toIso8601String(),
                        ),
                      );
                    },
                  ),
                ],
              );
            },
          ),
        ]));
  }
}
