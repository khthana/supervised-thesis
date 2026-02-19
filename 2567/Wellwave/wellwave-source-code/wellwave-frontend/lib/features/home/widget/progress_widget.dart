import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/config/constants/enums/greeting_message.dart';
import 'package:wellwave_frontend/features/home/data/models/get_user_challenges_request_model.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/features/home/widget/recommended_habit_card.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_request_model.dart';

import '../../../config/constants/enums/calculate_weekly_averages.dart';
import 'challenge_show_card.dart';
import 'health_data/exercise_steps/progress_ex_card.dart';
import 'health_data/exercise_steps/progress_step_card.dart';
import 'health_data/health_data_card.dart';
import 'progress_show_card.dart';

class ProgressWidget extends StatefulWidget {
  const ProgressWidget({super.key});

  @override
  _ProgressWidgetState createState() => _ProgressWidgetState();
}

class _ProgressWidgetState extends State<ProgressWidget> {
  late String greetingMessage;
  late String dailyMessage;

  @override
  void initState() {
    super.initState();
    greetingMessage = GreetingTimeText.getGreetingMessage();
    dailyMessage = DailyMessage().getMessage();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(builder: (context, state) {
      if (state is HomeLoadedState) {
        final challengesItems = state.userChallengesData?.data ?? [];

        // กรองเฉพาะรายการที่มี IS_DAILY = false
        final filteredChallengesItems = challengesItems
            .where((challenge) => challenge.habits?.isDaily == false)
            .toList();

        final recommendedHabits = state.recData?.data ?? [];

        return Column(
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 128.0),
                  child: Container(
                    padding: const EdgeInsets.only(top: 40),
                    decoration: const BoxDecoration(
                      color: AppColors.backgroundColor,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(16.0),
                        topRight: Radius.circular(16.0),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                AppStrings.progressText,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(color: AppColors.blackColor),
                              ),
                              InputButton(
                                buttonText: 'เพิ่ม',
                                onPressed: () {
                                  context.goNamed(AppPages.missionName);
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        // ความก้าวหน้า - แสดงเฉพาะรายการที่ IS_DAILY = false
                        filteredChallengesItems.isNotEmpty
                            ? SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: Padding(
                                  padding: const EdgeInsets.only(
                                    left: 24.0,
                                    top: 8.0,
                                    bottom: 8.0,
                                    right: 24.0,
                                  ),
                                  child: Row(
                                    children: filteredChallengesItems
                                        .map((challenge) {
                                      return Padding(
                                        padding:
                                            const EdgeInsets.only(right: 16.0),
                                        child: ProgressShowCard(
                                            progressData: challenge),
                                      );
                                    }).toList(),
                                  ),
                                ),
                              )
                            : Container(
                                alignment: Alignment.center,
                                height: 120,
                                child: Text(
                                  'ยังไม่มีรายการ',
                                  textAlign: TextAlign.center,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        color: AppColors.darkGrayColor,
                                      ),
                                ),
                              ),
                        const SizedBox(
                          height: 32,
                        ),
                        (recommendedHabits.isNotEmpty)
                            ? Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 24),
                                    child: Text(
                                      AppStrings.challengeText,
                                      style: Theme.of(context)
                                          .textTheme
                                          .headlineMedium
                                          ?.copyWith(
                                            color: AppColors.blackColor,
                                          ),
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  SingleChildScrollView(
                                    scrollDirection: Axis.horizontal,
                                    child: Padding(
                                      padding: const EdgeInsets.only(
                                        left: 24.0,
                                        top: 8.0,
                                        bottom: 8.0,
                                        right: 24.0,
                                      ),
                                      child: Row(
                                        children:
                                            recommendedHabits.map((challenge) {
                                          return Padding(
                                            padding: const EdgeInsets.only(
                                                right: 16.0),
                                            child: RecommendedHabitCard(
                                                progressData: challenge),
                                          );
                                        }).toList(),
                                      ),
                                    ),
                                  ),
                                ],
                              )
                            : const SizedBox.shrink(),
                        const SizedBox(
                          height: 32,
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          child: Text(
                            AppStrings.healthdataText,
                            style: Theme.of(context)
                                .textTheme
                                .headlineMedium
                                ?.copyWith(
                                  color: AppColors.blackColor,
                                ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          child: Container(
                            child: Column(
                              children: [
                                const Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: ProgressStepCard(),
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: ProgressExCard(),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                BlocBuilder<HomeBloc, HomeState>(
                                  builder: (context, state) {
                                    if (state is HomeLoadedState &&
                                        state.healthStepAndExData != null) {
                                      final healthData =
                                          state.healthStepAndExData!.data;

                                      if (healthData.step.isEmpty) {
                                        return Container();
                                      }

                                      List<Map<String, dynamic>>
                                          weeklyExAverages =
                                          calculateWeeklyAverage(
                                              healthData.step);
                                      List<int> weeklyExValues =
                                          weeklyExAverages
                                              .map((weekData) =>
                                                  weekData['average'] as int)
                                              .toList();

                                      List<Map<String, dynamic>> chartData =
                                          healthData.step.map((entry) {
                                        return {
                                          'date': entry.date,
                                          'value': entry.value,
                                        };
                                      }).toList();

                                      return HealthDataCard(
                                        weeklyAverages: weeklyExValues,
                                        chartData: chartData,
                                      );
                                    }

                                    return Container();
                                  },
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      top: 12, left: 24, right: 24, bottom: 0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '$greetingMessage, ${(state is HomeLoadedState) ? state.profile?.username ?? "User" : "User"}',
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(color: AppColors.whiteColor),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            dailyMessage,
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(color: AppColors.whiteColor),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Text(
                                state.loginStreak?.currentStreak.toString() ??
                                    '0',
                                style: Theme.of(context)
                                    .textTheme
                                    .titleLarge
                                    ?.copyWith(color: AppColors.whiteColor),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'วันต่อเนื่อง',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyMedium
                                    ?.copyWith(color: AppColors.whiteColor),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Positioned(
                  top: 0,
                  right: 24,
                  child: Transform.translate(
                    offset: const Offset(0, 0),
                    child: SvgPicture.asset(
                      AppImages.avatarImage,
                      height: 152,
                    ),
                  ),
                ),
              ],
            ),
          ],
        );
      }
      return const Center(child: CircularProgressIndicator());
    });
  }
}
