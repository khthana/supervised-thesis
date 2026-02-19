import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/data/models/get_user_challenges_request_model.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/enums/thai_date_formatter.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/widget/gradient_button.dart';

import 'action_slider_button.dart';

class ProgressStepperWidget extends StatelessWidget {
  final Challenge progressData;
  final String progressId;

  const ProgressStepperWidget(
      {super.key, required this.progressData, required this.progressId});

  List<DateTime> _generateDates(DateTime startDate, DateTime endDate) {
    final days = endDate.difference(startDate).inDays + 1;
    return List.generate(
      days,
      (index) => startDate.add(Duration(days: index)),
    );
  }

  List<DateTime> _getVisibleDates(List<DateTime> dates, DateTime activeDate) {
    final activeIndex =
        dates.indexWhere((date) => _isSameDay(date, activeDate));

    if (activeIndex == -1) {
      return dates.take(4).toList();
    }

    int startIndex = activeIndex - 2;

    if (startIndex < 0) {
      startIndex = 0;
    } else if (startIndex + 4 > dates.length) {
      startIndex = dates.length - 4;
    }

    return dates.skip(startIndex).take(4).toList();
  }

  bool _isSameDay(DateTime date1, DateTime date2) {
    return date1.year == date2.year &&
        date1.month == date2.month &&
        date1.day == date2.day;
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        final startDate = DateTime.parse(progressData.startDate);
        final endDate = DateTime.parse(progressData.endDate)
            .subtract(const Duration(days: 1));

        final dates = _generateDates(startDate, endDate);

        final activeDate = DateTime.now();
        final visibleDates = _getVisibleDates(dates, activeDate);

        if (visibleDates.isEmpty) {
          return const SizedBox.shrink();
        }

        final stepNumber =
            visibleDates.indexWhere((date) => _isSameDay(date, activeDate)) + 1;

        final visibleDate = stepNumber > 0 && stepNumber <= visibleDates.length
            ? visibleDates[stepNumber - 1]
            : visibleDates.first;

        return Stack(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                for (int i = 0; i < visibleDates.length; i++) ...[
                  _buildStep(
                    i + 1,
                    visibleDates[i],
                    context,
                    visibleDates,
                    context.read<HomeBloc>(),
                    progressData.dailyTracks,
                    progressId,
                  ),
                ],
              ],
            ),
            Positioned(
              bottom: 0,
              left: 0,
              child: Builder(
                builder: (context) {
                  final isCompleted = progressData.dailyTracks.any((track) =>
                      _isSameDay(
                          DateTime.parse(track.trackDate), visibleDate) &&
                      track.completed);

                  if (isCompleted) {
                    return GradientFinishButton(
                      onPressed: () {
                        context.goNamed(AppPages.missionPage);
                      },
                    );
                  }

                  if (progressData.habits.exerciseType != null) {
                    return GradientButton(
                      text: AppStrings.doMissionText,
                      onPressed: () {
                        context.goNamed(AppPages.habitChallengeName);
                      },
                    );
                  }

                  return ActionSliderButton(
                    stepNumber: stepNumber,
                    date: visibleDate,
                    progressId: progressId,
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}

Widget _buildStep(
  int stepNumber,
  DateTime date,
  BuildContext context,
  List<DateTime> visibleDates,
  HomeBloc bloc,
  List<DailyTrack> dailyTracks,
  String progressId,
) {
  bool isComplete = bloc.completionStatus[progressId]?[date] ?? false;
  bool isActive = _isSameDay(date, DateTime.now());

  return Stack(
    children: [
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildStepCircle(
                isComplete,
                isActive,
                date,
                context,
                dailyTracks,
              ),
              if (stepNumber < visibleDates.length)
                _buildStepConnector(visibleDates.length),
            ],
          ),
          const SizedBox(height: 4),
          SizedBox(
            width: 30,
            child: Text(
              ThaiDateFormatter.getThaiDayName(date),
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.blueGrayColor,
                  ),
            ),
          ),
          const SizedBox(height: 48),
        ],
      ),
    ],
  );
}

bool _isSameDay(DateTime date1, DateTime date2) {
  return date1.year == date2.year &&
      date1.month == date2.month &&
      date1.day == date2.day;
}

Widget _buildStepCircle(
  bool isComplete,
  bool isActive,
  DateTime date,
  BuildContext context,
  List<DailyTrack> dailyTracks,
) {
  final track = dailyTracks.firstWhere(
    (track) => _isSameDay(DateTime.parse(track.trackDate), date),
    orElse: () => DailyTrack(
      trackId: -1,
      challengeId: -1,
      trackDate: date.toIso8601String(),
      completed: false,
      durationMinutes: null,
      distanceKm: null,
      countValue: null,
      stepsCalculated: null,
      caloriesBurned: null,
      heartRate: null,
      moodFeedback: null,
    ),
  );

  final hasData = track.trackId != -1;
  final isCompleted = track.completed;
  final isFutureDate = date.isAfter(DateTime.now());
  final isPastDate = date.isBefore(DateTime.now());
  final isToday = _isSameDay(date, DateTime.now());

  final backgroundColor = isCompleted
      ? AppColors.skyblueColor
      : (isToday && !hasData)
          ? AppColors.skyblueColor
          : (isToday && hasData && !isCompleted) ||
                  (isPastDate && !hasData) ||
                  (hasData && !isCompleted)
              ? AppColors.redLevelColor
              : AppColors.lightgrayColor;

  final borderColor = isCompleted
      ? AppColors.skyblueColor
      : (isToday && !hasData)
          ? AppColors.darkSkyBlueColor
          : (isToday && hasData && !isCompleted) ||
                  (isPastDate && !hasData) ||
                  (hasData && !isCompleted)
              ? AppColors.redLevelColor
              : AppColors.lightgrayColor;

  return Stack(
    alignment: Alignment.center,
    children: [
      CustomPaint(
        size: const Size(28, 28),
        painter: InsideBorderCirclePainter(
          borderColor: borderColor,
          strokeWidth: 4.0,
        ),
      ),
      CircleAvatar(
        radius: 12,
        backgroundColor: backgroundColor,
        child: isCompleted
            ? const Icon(
                Icons.check,
                color: Colors.white,
                size: 16,
              )
            : (isToday && !hasData)
                ? Text(
                    '${date.day}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.white,
                        ),
                  )
                : (isToday && hasData && !isCompleted) ||
                        (isPastDate && !hasData) ||
                        (hasData && !isCompleted)
                    ? const Icon(
                        Icons.close,
                        color: Colors.white,
                        size: 16,
                      )
                    : Text(
                        '${date.day}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Colors.white,
                            ),
                      ),
      ),
    ],
  );
}

Widget _buildStepConnector(int totalSteps) {
  double width;
  switch (totalSteps) {
    case 2:
      width = 106;
      break;
    case 3:
      width = 39;
      break;
    default:
      width = 16;
  }

  return Container(
    height: 4,
    width: width,
    color: AppColors.lightgrayColor,
  );
}

class InsideBorderCirclePainter extends CustomPainter {
  final Color borderColor;
  final double strokeWidth;

  InsideBorderCirclePainter({
    required this.borderColor,
    this.strokeWidth = 4.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final double radius = (size.width / 2) - (strokeWidth / 2);
    canvas.drawCircle(size.center(Offset.zero), radius, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
