import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/common/widget/button_widget.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';

class TaskGoalBottomSheet extends StatelessWidget {
  final int defaultDailyMinuteGoal;
  final int defaultDaysGoal;
  final int expReward;
  final int hid;
  final String? category; // Add category parameter

  const TaskGoalBottomSheet({
    super.key,
    required this.defaultDailyMinuteGoal,
    required this.defaultDaysGoal,
    required this.expReward,
    required this.hid,
    this.category, // Add to constructor
  });

  @override
  Widget build(BuildContext context) {
    context.read<MissionBloc>().add(ResetGoalEvent(
          defaultDailyMinuteGoal: defaultDailyMinuteGoal,
          defaultDaysGoal: defaultDaysGoal,
        ));

    return Container(
      height: defaultDailyMinuteGoal != 0
          ? MediaQuery.of(context).size.height * 0.5
          : MediaQuery.of(context).size.height * 0.4,
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            children: [
              Container(
                height: 5,
                width: 140,
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(10),
                ),
                margin: const EdgeInsets.only(bottom: 8),
              ),
              const SizedBox(height: 16),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  AppStrings.setGoalText,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
            ],
          ),
          Column(
            children: [
              if (defaultDaysGoal != 0)
                Column(
                  children: [
                    BlocBuilder<MissionBloc, MissionState>(
                      builder: (context, state) {
                        if (state is HabitChallengeState &&
                            state.dailyCount == defaultDaysGoal) {
                          return Padding(
                            padding: const EdgeInsets.only(right: 24.0),
                            child: Align(
                              alignment: Alignment.centerRight,
                              child: Container(
                                padding: const EdgeInsets.fromLTRB(8, 0, 8, 0),
                                decoration: BoxDecoration(
                                  color: AppColors.secondaryDarkColor,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Text(
                                  AppStrings.suggestText,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        color: AppColors.whiteColor,
                                      ),
                                ),
                              ),
                            ),
                          );
                        }
                        return Padding(
                          padding: const EdgeInsets.only(right: 22.0),
                          child: Align(
                            alignment: Alignment.centerRight,
                            child: Container(
                              padding: const EdgeInsets.fromLTRB(8, 0, 8, 0),
                              decoration: BoxDecoration(
                                color: AppColors.whiteColor,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Text(
                                AppStrings.suggestText,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(
                                      color: AppColors.whiteColor,
                                    ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    _buildCounterRow(
                      label: AppStrings.setDayText,
                      onDecrease: () => context
                          .read<MissionBloc>()
                          .add(DecrementDailyCountEvent()),
                      onIncrease: () => context
                          .read<MissionBloc>()
                          .add(IncrementDailyCountEvent()),
                      countSelector: (state) {
                        if (state is HabitChallengeState) {
                          return state.dailyCount;
                        }
                        return defaultDaysGoal;
                      },
                    ),
                  ],
                ),
              if (defaultDailyMinuteGoal != 0)
                Column(
                  children: [
                    BlocBuilder<MissionBloc, MissionState>(
                      builder: (context, state) {
                        if (state is HabitChallengeState &&
                            state.minuteCount == defaultDailyMinuteGoal) {
                          return Padding(
                            padding: const EdgeInsets.only(right: 22.0),
                            child: Align(
                              alignment: Alignment.centerRight,
                              child: Container(
                                padding: const EdgeInsets.fromLTRB(8, 0, 8, 0),
                                decoration: BoxDecoration(
                                  color: AppColors.secondaryDarkColor,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Text(
                                  AppStrings.suggestText,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        color: AppColors.whiteColor,
                                      ),
                                ),
                              ),
                            ),
                          );
                        }
                        return Padding(
                          padding: const EdgeInsets.only(right: 22.0),
                          child: Align(
                            alignment: Alignment.centerRight,
                            child: Container(
                              padding: const EdgeInsets.fromLTRB(8, 0, 8, 0),
                              decoration: BoxDecoration(
                                color: AppColors.whiteColor,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Text(
                                AppStrings.suggestText,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(
                                      color: AppColors.whiteColor,
                                    ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    _buildCounterRow(
                      label: AppStrings.minPerDayText,
                      onDecrease: () => context
                          .read<MissionBloc>()
                          .add(DecrementMinuteCountEvent()),
                      onIncrease: () => context
                          .read<MissionBloc>()
                          .add(IncrementMinuteCountEvent()),
                      countSelector: (state) {
                        if (state is HabitChallengeState) {
                          return state.minuteCount;
                        }
                        return defaultDailyMinuteGoal;
                      },
                    ),
                  ],
                ),
              Padding(
                padding: const EdgeInsets.only(right: 16.0),
                child: const Divider(color: AppColors.lightgrayColor),
              ),
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.only(right: 16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      AppStrings.willReceievedText,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    BlocBuilder<MissionBloc, MissionState>(
                        builder: (context, state) {
                      final totalExp = state is HabitChallengeState
                          ? expReward * state.dailyCount
                          : expReward * defaultDaysGoal;

                      return Row(
                        children: [
                          SvgPicture.asset(
                            AppImages.expIcon,
                            width: 24,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '$totalExp',
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                        ],
                      );
                    }),
                  ],
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.only(top: 6.0),
            child: NextButton(
              text: AppStrings.confirmText,
              onPressed: () async {
                final state = context.read<MissionBloc>().state;
                if (state is HabitChallengeState) {
                  context.read<MissionBloc>().add(ConfirmGoalEvent(
                        dailyCount: state.dailyCount,
                        minuteCount: state.minuteCount,
                        hid: hid,
                      ));

                  context.read<MissionBloc>().add(StartProgressEvent());
                  await Future.delayed(const Duration(seconds: 1));

                  Navigator.of(context).pop();
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCounterRow({
    required String label,
    required VoidCallback onDecrease,
    required VoidCallback onIncrease,
    required int Function(MissionState) countSelector,
  }) {
    return BlocBuilder<MissionBloc, MissionState>(
      builder: (context, state) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: Theme.of(context).textTheme.headlineMedium),
            Row(
              children: [
                IconButton(
                  onPressed: onDecrease,
                  icon: const Icon(Icons.remove),
                  iconSize: 24,
                ),
                Text(
                  '${countSelector(state)}',
                  style: Theme.of(context).textTheme.headlineLarge,
                ),
                IconButton(
                  onPressed: onIncrease,
                  icon: const Icon(Icons.add),
                  iconSize: 24,
                ),
              ],
            ),
          ],
        );
      },
    );
  }
}
