import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/features/friend/data/models/log_entry_model.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_event.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_state.dart';
import 'package:wellwave_frontend/features/friend/presentation/widget/friend_log_progress_chart.dart';
import '../../../../../config/constants/app_colors.dart';
import '../../../../../config/constants/app_strings.dart';

class FriendChartSectionWidget extends StatefulWidget {
  final String friendUid;
  const FriendChartSectionWidget({
    Key? key,
    required this.friendUid,
  }) : super(key: key);

  @override
  _FriendChartSectionWidgetState createState() =>
      _FriendChartSectionWidgetState();
}

class _FriendChartSectionWidgetState extends State<FriendChartSectionWidget> {
  String selectedPeriod = '7 วัน';

  void updateSelectedPeriod(String newPeriod) {
    setState(() {
      selectedPeriod = newPeriod;
    });
  }

  @override
  void initState() {
    super.initState();
    context.read<FriendBloc>().add(
          LoadFriendEvent(
            friendUid: widget.friendUid,
            selectedPeriod: selectedPeriod,
          ),
        );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
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
                SizedBox(width: 112, child: Tab(text: AppStrings.stepText)),
                SizedBox(width: 112, child: Tab(text: AppStrings.sleepText)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 300,
            child: BlocBuilder<FriendBloc, FriendState>(
              builder: (context, state) {
                if (state is FriendLoading) {
                  return const Center(child: CircularProgressIndicator());
                } else if (state is FriendLoaded &&
                    state.searchId == widget.friendUid) {
                  return TabBarView(
                    children: [
                      // Steps Chart
                      FriendLogProgressChart<LogEntryModel>(
                        title: AppStrings.amoutOfStepText,
                        unit: AppStrings.stepText,
                        logType: AppStrings.stepLogText,
                        selectedPeriod: selectedPeriod,
                        onPeriodSelected: updateSelectedPeriod,
                        logs: state.friends.stepsLog
                            .map((log) => LogEntryModel.fromJson(log))
                            .toList(),
                        getValue: (log) => log.value.toDouble(),
                        getDate: (log) =>
                            DateTime.tryParse(log.date) ?? DateTime.now(),
                        createLog: (date, value) => LogEntryModel(
                          uid: state.friends.uid,
                          logName: AppStrings.stepLogText,
                          date: date.toIso8601String(),
                          value: value.toInt(),
                        ),
                      ),
                      // Sleep Chart
                      FriendLogProgressChart<LogEntryModel>(
                        title: AppStrings.hoursOfSleepText,
                        unit: AppStrings.hoursText,
                        logType: AppStrings.sleepLogText,
                        selectedPeriod: selectedPeriod,
                        onPeriodSelected: updateSelectedPeriod,
                        logs: state.friends.sleepLog
                            .map((log) => LogEntryModel.fromJson(log))
                            .toList(),
                        getValue: (log) => log.value.toDouble(),
                        getDate: (log) =>
                            DateTime.tryParse(log.date) ?? DateTime.now(),
                        createLog: (date, value) => LogEntryModel(
                          uid: state.friends.uid,
                          logName: AppStrings.sleepLogText,
                          date: date.toIso8601String(),
                          value: value.toInt(),
                        ),
                      ),
                    ],
                  );
                }
                return const Center(child: Text('No data available'));
              },
            ),
          ),
        ],
      ),
    );
  }
}
