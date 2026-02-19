import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/enums/thai_date_formatter.dart';

class ProgressStepperDialogWidget extends StatelessWidget {
  final List<Map<String, dynamic>> progressData;
  final String progressId;
  final int totalDays;
  final DateTime startDate;
  final DateTime endDate;

  const ProgressStepperDialogWidget({
    super.key,
    required this.progressData,
    required this.progressId,
    required this.totalDays,
    required this.startDate,
    required this.endDate,
  });

  @override
  Widget build(BuildContext context) {
    final dates = List.generate(
      totalDays,
      (index) => startDate.add(Duration(days: index)),
    );

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(totalDays, (index) {
          final currentDate = dates[index];
          final isPastDate = currentDate.isBefore(today);

          final hasData = progressData.any((data) {
            final trackDate = DateTime.parse(data['TRACK_DATE'] as String);
            return trackDate.year == currentDate.year &&
                trackDate.month == currentDate.month &&
                trackDate.day == currentDate.day;
          });

          final bool isComplete = hasData
              ? progressData.firstWhere(
                  (data) {
                    final trackDate =
                        DateTime.parse(data['TRACK_DATE'] as String);
                    return trackDate.year == currentDate.year &&
                        trackDate.month == currentDate.month &&
                        trackDate.day == currentDate.day;
                  },
                )['COMPLETED'] as bool
              : false;

          final bool isActive = currentDate.day == today.day &&
              currentDate.month == today.month &&
              currentDate.year == today.year;
          final bool isMissed = isPastDate && !hasData;

          return Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isComplete
                            ? AppColors.skyblueColor
                            : isMissed
                                ? AppColors.redLevelColor
                                : isActive
                                    ? AppColors.darkSkyBlueColor
                                    : AppColors.lightgrayColor,
                        width: 4.0,
                      ),
                    ),
                    child: CircleAvatar(
                      radius: 16,
                      backgroundColor: isComplete
                          ? AppColors.skyblueColor
                          : isMissed
                              ? AppColors.redLevelColor
                              : isActive
                                  ? AppColors.skyblueColor
                                  : AppColors.lightgrayColor,
                      child: isComplete
                          ? const Icon(
                              Icons.check,
                              color: Colors.white,
                              size: 16,
                            )
                          : isMissed
                              ? const Icon(
                                  Icons.close,
                                  color: Colors.white,
                                  size: 16,
                                )
                              : Text(
                                  '${currentDate.day}',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall
                                      ?.copyWith(
                                        color: Colors.white,
                                      ),
                                ),
                    ),
                  ),
                  if (index < totalDays - 1)
                    Container(
                      height: 4,
                      width: 16,
                      color: AppColors.lightgrayColor,
                    ),
                ],
              ),
              const SizedBox(height: 4),
              SizedBox(
                width: 20,
                child: Text(
                  ThaiDateFormatter.getThaiDayName(currentDate),
                  textAlign: TextAlign.left,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.blueGrayColor,
                      ),
                ),
              ),
            ],
          );
        }),
      ),
    );
  }
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
