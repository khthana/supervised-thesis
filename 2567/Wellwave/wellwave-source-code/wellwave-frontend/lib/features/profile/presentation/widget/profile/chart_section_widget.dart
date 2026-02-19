import 'package:flutter/material.dart';

import '../../../../../config/constants/app_colors.dart';
import '../../../../../config/constants/app_strings.dart';
import '../../../../logs/data/models/logs_request_model_drink.dart';
import '../../../../logs/data/models/logs_request_model_sleep.dart';
import '../../../../logs/data/models/logs_request_model_step.dart';
import '../../../../logs/presentation/bloc/logs_bloc.dart';
import 'log_progress_chart.dart';

class ChartSectionWidget extends StatefulWidget {
  const ChartSectionWidget({super.key});

  @override
  _ChartSectionWidgetState createState() => _ChartSectionWidgetState();
}

class _ChartSectionWidgetState extends State<ChartSectionWidget> {
  String selectedPeriod = '7 วัน';

  void updateSelectedPeriod(String newPeriod) {
    setState(() {
      selectedPeriod = newPeriod;
    });
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Column(
        children: [
          Container(
            height: 32,
            decoration: BoxDecoration(
              color: AppColors.whiteColor,
              borderRadius: BorderRadius.circular(100),
            ),
            child: TabBar(
              indicatorWeight: 0,
              labelColor: Colors.white,
              unselectedLabelColor: Colors.black,
              indicatorColor: AppColors.primaryColor,
              indicator: BoxDecoration(
                color: AppColors.primaryColor,
                borderRadius: BorderRadius.circular(100),
              ),
              tabs: const [
                SizedBox(width: 112, child: Tab(text: AppStrings.drinkText)),
                SizedBox(width: 112, child: Tab(text: AppStrings.stepText)),
                SizedBox(width: 112, child: Tab(text: AppStrings.sleepText)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 300,
            child: TabBarView(
              children: [
                LogProgressChart<LogsDrinkRequestModel>(
                  title: AppStrings.amoutOfWaterText,
                  unit: AppStrings.glassesText,
                  logType: AppStrings.drinkLogText,
                  selectedPeriod: selectedPeriod,
                  onPeriodSelected: updateSelectedPeriod,
                  getLogs: (state) {
                    if (state is LogsLoadGraphSuccess) {
                      return state.logsDrinklist;
                    }
                    return [];
                  },
                  getValue: (log) => log.value,
                  getDate: (log) => log.date,
                  createLog: (date, value) =>
                      LogsDrinkRequestModel(date: date, value: value),
                ),
                LogProgressChart<LogsStepRequestModel>(
                  title: AppStrings.amoutOfStepText,
                  unit: AppStrings.stepText,
                  logType: AppStrings.stepLogText,
                  selectedPeriod: selectedPeriod,
                  onPeriodSelected: updateSelectedPeriod,
                  getLogs: (state) {
                    if (state is LogsLoadGraphSuccess) {
                      return state.logsSteplist;
                    }
                    return [];
                  },
                  getValue: (log) => log.value,
                  getDate: (log) => log.date,
                  createLog: (date, value) =>
                      LogsStepRequestModel(date: date, value: value),
                ),
                LogProgressChart<LogsSleepRequestModel>(
                  title: AppStrings.hoursOfSleepText,
                  unit: AppStrings.hoursText,
                  logType: AppStrings.sleepLogText,
                  selectedPeriod: selectedPeriod,
                  onPeriodSelected: updateSelectedPeriod,
                  getLogs: (state) {
                    if (state is LogsLoadGraphSuccess) {
                      return state.logsSleeplist;
                    }
                    return [];
                  },
                  getValue: (log) => log.value,
                  getDate: (log) => log.date,
                  createLog: (date, value) =>
                      LogsSleepRequestModel(date: date, value: value),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
