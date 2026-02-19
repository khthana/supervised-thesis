import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import 'package:wellwave_frontend/features/mission/presentation/widgets/calendar_slider_history.dart';
import 'package:wellwave_frontend/features/mission/presentation/widgets/mission_type_and_card_widget.dart';

class MissionHistoryScreen extends StatefulWidget {
  const MissionHistoryScreen({super.key});

  @override
  _MissionHistoryScreenState createState() => _MissionHistoryScreenState();
}

class _MissionHistoryScreenState extends State<MissionHistoryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  DateTime _selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadHistoryData(_selectedDate);
  }

  void _loadHistoryData(DateTime date) {
    BlocProvider.of<MissionBloc>(context).add(LoadHistoryEvent(date));
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: CustomAppBar(
        context: context,
        title: AppStrings.missionHistoryText,
        backgroundColor: AppColors.primaryColor,
        titleColor: AppColors.whiteColor,
        textColor: AppColors.whiteColor,
        onLeading: true,
      ),
      body: BlocBuilder<MissionBloc, MissionState>(
        builder: (context, state) {
          if (state is HistoryLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is HistoryLoaded) {
            return Column(
              children: [
                Container(
                  color: AppColors.primaryColor,
                  child: Column(
                    children: [
                      const SizedBox(height: 20),
                      CalendarSliderHistoryMission(
                        selectedDate: _selectedDate,
                        onDateSelected: (date) {
                          setState(() {
                            _selectedDate = date;
                            _loadHistoryData(date);
                          });
                        },
                      ),
                    ],
                  ),
                ),
                Container(
                  child: TabBar(
                    controller: _tabController,
                    isScrollable: false,
                    labelPadding: const EdgeInsets.symmetric(horizontal: 16),
                    padding: EdgeInsets.zero,
                    dividerColor: Colors.transparent,
                    labelColor: AppColors.blackColor,
                    unselectedLabelColor: AppColors.blackColor.withOpacity(0.4),
                    indicatorColor: AppColors.blackColor,
                    labelStyle: Theme.of(context).textTheme.titleSmall,
                    tabs: const [
                      Tab(text: AppStrings.seeAllMissionStateText),
                      Tab(text: AppStrings.activeMissionStateText),
                      Tab(text: AppStrings.completedMissionStateText),
                      Tab(text: AppStrings.failedMissionStateText),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      MissionTypeAndCardWidget(
                        historyData: state.history.data,
                        status: 'all',
                        selectedDate: _selectedDate,
                      ),
                      MissionTypeAndCardWidget(
                        historyData: state.history.data,
                        status: 'active',
                        selectedDate: _selectedDate,
                      ),
                      MissionTypeAndCardWidget(
                        historyData: state.history.data,
                        status: 'completed',
                        selectedDate: _selectedDate,
                      ),
                      MissionTypeAndCardWidget(
                        historyData: state.history.data,
                        status: 'failed',
                        selectedDate: _selectedDate,
                      ),
                    ],
                  ),
                ),
              ],
            );
          }

          if (state is HistoryError) {
            return Center(child: Text(state.message));
          }

          return const Center(child: Text('No history available'));
        },
      ),
    );
  }
}
