import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/mission/data/models/get_history_model.dart';
import 'package:wellwave_frontend/features/mission/presentation/widgets/mission_history_card.dart';

class MissionTypeAndCardWidget extends StatelessWidget {
  final HistoryData historyData;
  final String status;
  final DateTime selectedDate;

  const MissionTypeAndCardWidget({
    Key? key,
    required this.historyData,
    required this.status,
    required this.selectedDate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final filteredDailyHabits = status == 'all'
        ? historyData.dailyHabits
        : historyData.dailyHabits
            .where((habit) => habit.status.habitStatus == status)
            .toList();

    final filteredHabits = status == 'all'
        ? historyData.habits
        : historyData.habits
            .where((habit) => habit.status.habitStatus == status)
            .toList();

    final filteredQuests = status == 'all'
        ? historyData.quests
        : historyData.quests.where((quest) => quest.status == status).toList();

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemBuilder: (context, index) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (filteredDailyHabits.isNotEmpty) ...[
              Text(
                AppStrings.dailyTaskText,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 16),
              ...filteredDailyHabits.map((dailyHabit) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: MissionHistoryCard(
                      imagePath: dailyHabit.thumbnailUrl,
                      title: dailyHabit.title,
                      state: dailyHabit.status.habitStatus,
                    ),
                  )),
            ],
            if (filteredHabits.isNotEmpty) ...[
              if (filteredDailyHabits.isNotEmpty) const SizedBox(height: 24),
              Text(
                AppStrings.habitChallengeText,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 16),
              ...filteredHabits.map((habit) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: MissionHistoryCard(
                      imagePath: habit.thumbnailUrl,
                      title: habit.title,
                      state: habit.status.habitStatus,
                    ),
                  )),
            ],
            if (filteredQuests.isNotEmpty) ...[
              if (filteredDailyHabits.isNotEmpty || filteredHabits.isNotEmpty)
                const SizedBox(height: 24),
              Text(
                AppStrings.questText,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 16),
              ...filteredQuests.map((quest) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: MissionHistoryCard(
                      imagePath: quest.thumbnailUrl,
                      title: quest.title,
                      state: quest.status,
                    ),
                  )),
            ],
            if (filteredDailyHabits.isEmpty &&
                filteredHabits.isEmpty &&
                filteredQuests.isEmpty) ...[
              Center(
                child: Text(
                  'ไม่พบข้อมูล',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(color: AppColors.greyColor),
                ),
              ),
            ],
          ],
        );
      },
      itemCount: 1,
    );
  }
}
