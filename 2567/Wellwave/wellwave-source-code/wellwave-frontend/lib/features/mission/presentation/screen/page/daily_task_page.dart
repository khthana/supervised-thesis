import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import 'package:wellwave_frontend/features/mission/presentation/widgets/success_dialog.dart';
import '../../widgets/daily_task_list.dart';

class DailyTaskPage extends StatefulWidget {
  const DailyTaskPage({super.key});

  @override
  State<DailyTaskPage> createState() => _DailyTaskPageState();
}

class _DailyTaskPageState extends State<DailyTaskPage> {
  bool _rewardsCollected = false;
  final String _rewardsKey = 'daily_rewards_collected';
  final String _lastCollectionDateKey = 'last_collection_date';

  @override
  void initState() {
    super.initState();
    _loadRewardsState();
    context.read<MissionBloc>().add(LoadDailyTasksEvent());
  }

  Future<void> _loadRewardsState() async {
    final prefs = await SharedPreferences.getInstance();
    final lastCollectionDate = prefs.getString(_lastCollectionDateKey);
    final today = DateTime.now().toIso8601String().split('T')[0];

    if (lastCollectionDate != today) {
      await prefs.setBool(_rewardsKey, false);
      await prefs.setString(_lastCollectionDateKey, today);
      setState(() {
        _rewardsCollected = false;
      });
    } else {
      setState(() {
        _rewardsCollected = prefs.getBool(_rewardsKey) ?? false;
      });
    }
  }

  Future<void> _setRewardsCollected() async {
    final prefs = await SharedPreferences.getInstance();
    final today = DateTime.now().toIso8601String().split('T')[0];

    await prefs.setBool(_rewardsKey, true);
    await prefs.setString(_lastCollectionDateKey, today);

    setState(() {
      _rewardsCollected = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        title: AppStrings.dailyTaskText,
        backgroundColor: AppColors.secondaryDarkColor,
        titleColor: AppColors.whiteColor,
        textColor: AppColors.whiteColor,
        onLeading: true,
      ),
      body: BlocBuilder<MissionBloc, MissionState>(
        builder: (context, state) {
          if (state is DailyTaskLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state is DailyTaskLoaded) {
            final habits = state.dailyTasks.data;

            final completedTasks = habits.where((habit) {
              return habit.dailyTracks.any((track) {
                final trackDate = DateTime.parse(track.trackDate);
                final today = DateTime.now();
                return trackDate.year == today.year &&
                    trackDate.month == today.month &&
                    trackDate.day == today.day;
              });
            }).length;

            final allTasksCompleted = completedTasks == habits.length;

            return Stack(
              children: [
                Container(
                  decoration: const BoxDecoration(
                    color: AppColors.secondaryDarkColor,
                  ),
                  height: MediaQuery.of(context).size.height * 0.15,
                ),
                Column(
                  children: [
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (!_rewardsCollected) ...[
                          Text(
                            AppStrings.taskCompletedWithGemText,
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppColors.whiteColor,
                                    ),
                          ),
                          const SizedBox(width: 8),
                          SvgPicture.asset(
                            AppImages.gemIcon,
                            width: 24,
                            height: 24,
                          ),
                          Text(
                            ' +15',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppColors.whiteColor,
                                    ),
                          ),
                          const SizedBox(width: 16),
                          Container(
                            height: 28,
                            decoration: BoxDecoration(
                              color: allTasksCompleted
                                  ? AppColors.mintColor.withOpacity(0.8)
                                  : AppColors.darkGreyWithPurpleColor,
                              border: Border.all(
                                color: AppColors.whiteColor,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.15),
                                  offset: const Offset(0, 2),
                                  blurRadius: 0,
                                  spreadRadius: 0,
                                )
                              ],
                            ),
                            child: ElevatedButton(
                              onPressed: allTasksCompleted
                                  ? () {
                                      showDialog(
                                        context: context,
                                        builder: (_) => SuccessMissionDialog(
                                          reward: 15,
                                          iconPath: SvgPicture.asset(
                                            AppImages.gemIcon,
                                            width: 24,
                                          ),
                                        ),
                                      ).then((_) {
                                        _setRewardsCollected();
                                      });
                                    }
                                  : null,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                elevation: 0,
                              ),
                              child: Text(
                                AppStrings.collectRewards,
                                textAlign: TextAlign.center,
                                style: Theme.of(context)
                                    .textTheme
                                    .titleSmall
                                    ?.copyWith(color: AppColors.whiteColor),
                              ),
                            ),
                          ),
                        ] else ...[
                          Text(
                            AppStrings.successDailyMissionStateText,
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppColors.whiteColor,
                                    ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: ListView.builder(
                        itemCount: habits.length,
                        itemBuilder: (context, index) {
                          final habit = habits[index];

                          final isCompleted = habit.dailyTracks.any((track) {
                            final trackDate = DateTime.parse(track.trackDate);
                            final today = DateTime.now();
                            final isToday = trackDate.year == today.year &&
                                trackDate.month == today.month &&
                                trackDate.day == today.day;

                            return isToday;
                          });

                          return DailyTaskList(
                            imagePath: habit.habits.thumbnailUrl,
                            taskId: habit.habits.hid,
                            taskName: habit.habits.title,
                            exp: habit.habits.expReward,
                            isCompleted: isCompleted,
                            defaultDailyMinuteGoal:
                                habit.habits.defaultDailyMinuteGoal,
                            category: habit.habits.category,
                            adviceText: habit.habits.advice,
                            expReward: habit.habits.expReward,
                            challengeId: habit.challengeId,
                            defaultDaysGoal: 1,
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            );
          }
          return Container();
        },
      ),
    );
  }
}
