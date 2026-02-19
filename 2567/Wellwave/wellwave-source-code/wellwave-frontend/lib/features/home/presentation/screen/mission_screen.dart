import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import '../../../../common/widget/app_bar.dart';

class MissionScreen extends StatefulWidget {
  const MissionScreen({super.key});

  @override
  State<MissionScreen> createState() => _MissionScreenState();
}

class _MissionScreenState extends State<MissionScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkAndLoadDailyTasks(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        title: AppStrings.emptyText,
        backgroundColor: AppColors.whiteColor,
        onLeading: false,
        actionIcon: Text(
          AppStrings.historyText,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.greyColor,
              ),
        ),
        action: () {
          context.goNamed(AppPages.missionHistoryPage);
        },
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                AppStrings.iDoTodayText,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              Text(
                AppStrings.chooseActivityText,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 36),
              _buildActivityButton(
                context,
                AppStrings.dailyTaskText,
                AppImages.dailyTaskImage,
                AppPages.dailyTaskName,
                AppColors.secondaryDarkColor,
              ),
              const SizedBox(height: 24),
              _buildActivityButton(
                context,
                AppStrings.habitChallengeText,
                AppImages.habitChallengeImage,
                AppPages.habitChallengeName,
                AppColors.mintColor,
              ),
              const SizedBox(height: 24),
              _buildActivityButton(
                context,
                AppStrings.questText,
                AppImages.questImage,
                AppPages.questName,
                AppColors.pinkColor,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActivityButton(BuildContext context, String title,
      String imagePath, String routeName, Color color) {
    return GestureDetector(
      onTap: () {
        context.goNamed(routeName);
      },
      child: Container(
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 28.0),
                  child: Image.asset(
                    imagePath,
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 16),
                Text(
                  title,
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: AppColors.whiteColor,
                      ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 2,
                  textAlign: TextAlign.left,
                ),
              ],
            ),
            const Padding(
              padding: EdgeInsets.only(right: 16.0),
              child: Icon(
                Icons.chevron_right_rounded,
                size: 50,
                color: AppColors.whiteColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

Future<void> _checkAndLoadDailyTasks(BuildContext context) async {
  final prefs = await SharedPreferences.getInstance();
  final lastCalledDate = prefs.getString('last_called_date');
  final currentDate = DateTime.now().toIso8601String().split('T')[0];

  if (lastCalledDate != currentDate) {
    context.read<MissionBloc>().add(GetDailyTasksEvent());

    await prefs.setString('last_called_date', currentDate);
  }
}
