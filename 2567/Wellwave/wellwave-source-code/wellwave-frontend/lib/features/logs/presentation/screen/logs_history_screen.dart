import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/calendar_slider.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/daily_logs_widget.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/weekly_logs_widget.dart';

class LogsHistoryScreen extends StatefulWidget {
  const LogsHistoryScreen({super.key});

  @override
  _LogsHistoryScreenState createState() => _LogsHistoryScreenState();
}

class _LogsHistoryScreenState extends State<LogsHistoryScreen> {
  DateTime _selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
          backgroundColor: AppColors.primaryColor,
          title: Text(
            AppStrings.healthHistoryText,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: AppColors.whiteColor,
                  fontWeight: FontWeight.bold,
                ),
          )),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(
              width: double.infinity,
              height: 20.0,
              child: DecoratedBox(
                decoration: BoxDecoration(color: AppColors.primaryColor),
              ),
            ),
            CalendarSilder(
              onDateSelected: (date) {
                setState(() {
                  _selectedDate = date;
                });
              },
            ),
            DailyLogsWidget(selectedDate: _selectedDate),
            WeeklyLogsWidget(selectedDate: _selectedDate),
          ],
        ),
      ),
    );
  }
}
