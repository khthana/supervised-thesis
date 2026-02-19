import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/notification/presentation/widget/noti_drinking.dart';
import 'package:wellwave_frontend/features/notification/presentation/widget/noti_mission.dart';
import 'package:wellwave_frontend/features/notification/presentation/widget/noti_sleeping.dart';

import '../../../../common/widget/app_bar.dart';
import '../../../../config/constants/app_colors.dart';

class ReminderScreen extends StatelessWidget {
  const ReminderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      appBar: CustomAppBar(
          title: AppStrings.alertText, context: context, onLeading: true),
      body: const SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 36),
          child: Column(
            children: [
              NotificationMission(),
              SizedBox(height: 24),
              NotificationDrinking(),
              SizedBox(height: 36),
              NotificationSleeping()
            ],
          ),
        ),
      ),
    );
  }
}
