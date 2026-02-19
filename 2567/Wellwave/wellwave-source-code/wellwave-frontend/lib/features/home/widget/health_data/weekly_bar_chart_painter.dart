import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'dart:ui' as ui;

import 'package:wellwave_frontend/config/constants/enums/thai_date_formatter.dart';

class WeeklyBarChartPainter extends CustomPainter {
  final List<Map<String, dynamic>> data;
  final List<int> weeklyAverages;
  final BuildContext context;

  WeeklyBarChartPainter({
    required this.data,
    required this.weeklyAverages,
    required this.context,
  });

  @override
  void paint(Canvas canvas, Size size) {
    double maxHeight = 64;

    // คำนวณค่าเฉลี่ยรายสัปดาห์
    List<double> weeklyAverages = [];
    for (int i = 0; i < data.length; i += 7) {
      int end = (i + 7 < data.length) ? i + 7 : data.length;
      List<Map<String, dynamic>> weeklyData = data.sublist(i, end);
      double weeklyAverage =
          weeklyData.fold(0.0, (sum, item) => sum + item['value'].toDouble()) /
              weeklyData.length;
      weeklyAverages.add(weeklyAverage);
    }

    double maxData =
        weeklyAverages.fold(0.0, (max, value) => value > max ? value : max);

    double barWidth = size.width / weeklyAverages.length;

    for (int i = 0; i < weeklyAverages.length; i++) {
      bool isRecentWeek = i == weeklyAverages.length - 1;

      Paint barPaint = Paint()
        ..color = isRecentWeek ? AppColors.green25Color : AppColors.gray50Color;

      double barHeight = (weeklyAverages[i] / maxData) * maxHeight;

      canvas.drawRect(
        Rect.fromLTWH(
            i * barWidth, size.height - barHeight, barWidth - 4, barHeight),
        barPaint,
      );
    }

    num recentAverage = weeklyAverages.isNotEmpty
        ? (weeklyAverages.last.toDouble()).ceil()
        : 0.0;

    double overallAverage = weeklyAverages.isNotEmpty
        ? weeklyAverages.reduce((a, b) => a + b) / weeklyAverages.length
        : 0.0;

    Paint recentAveragePaint = Paint()
      ..color = AppColors.greenColor
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    Paint overallAveragePaint = Paint()
      ..color = AppColors.greyColor
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    double recentAverageHeight = (recentAverage / maxData) * maxHeight;
    double recentStartX = (weeklyAverages.length - 1) * barWidth;
    double recentEndX = recentStartX + barWidth - 4;

    // ใช้เส้นประสำหรับเส้นเฉลี่ยล่าสุด
    Path recentAveragePath = Path();
    double distance = 0.0;
    while (distance < recentEndX - recentStartX) {
      recentAveragePath.moveTo(
          recentStartX + distance, size.height - recentAverageHeight);
      distance += 8.0;
      recentAveragePath.lineTo(
          recentStartX + distance, size.height - recentAverageHeight);
      distance += 5.0;
    }
    canvas.drawPath(recentAveragePath, recentAveragePaint);

    // วาดข้อความค่าเฉลี่ยของ 7 วันล่าสุด
    TextPainter recentTextPainter = TextPainter(
      text: TextSpan(
        text: 'เฉลี่ย ${recentAverage.toInt()} ก้าว',
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.greenColor,
              fontWeight: FontWeight.bold,
            ),
      ),
      textDirection: ui.TextDirection.ltr,
    )..layout(minWidth: 0, maxWidth: double.infinity);

    double recentTextX = size.width - recentTextPainter.width;
    double recentTextY = size.height - recentAverageHeight - 20;

    recentTextPainter.paint(canvas, Offset(recentTextX, recentTextY));

    double overallAverageHeight = (overallAverage / maxData) * maxHeight;
    double overallStartX = 0;
    double overallEndX = (weeklyAverages.length - 1) * barWidth - 4;

    Path overallAveragePath = Path();
    distance = 0.0;
    while (distance < overallEndX - overallStartX) {
      overallAveragePath.moveTo(
          overallStartX + distance, size.height - overallAverageHeight);
      distance += 8.0;
      overallAveragePath.lineTo(
          overallStartX + distance, size.height - overallAverageHeight);
      distance += 5.0;
    }
    canvas.drawPath(overallAveragePath, overallAveragePaint);

    // วาดข้อความค่าเฉลี่ยทั้งหมด
    TextPainter overallTextPainter = TextPainter(
      text: TextSpan(
        text: 'เฉลี่ย ${overallAverage.toInt()} ก้าว',
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.greyColor,
              fontWeight: FontWeight.bold,
            ),
      ),
      textDirection: ui.TextDirection.ltr,
    )..layout(minWidth: 0, maxWidth: double.infinity);

    double overallTextX = overallStartX;
    double overallTextY = size.height - overallAverageHeight - 20;

    overallTextPainter.paint(canvas, Offset(overallTextX, overallTextY));

    // แสดงช่วงวันที่ของสัปดาห์ล่าสุด
    int lastIndex = data.length - 1;
    int startIndex = lastIndex - 6;
    if (startIndex < 0) startIndex = 0;

    DateTime firstDateOfRecentWeek = DateTime.parse(data[startIndex]['date']);
    DateTime lastDateOfRecentWeek = DateTime.parse(data[lastIndex]['date']);
    String recentWeekDateRange = ThaiDateFormatter.formatDateRange(
        firstDateOfRecentWeek, lastDateOfRecentWeek);

    TextPainter recentWeekDateTextPainter = TextPainter(
      text: TextSpan(
        text: recentWeekDateRange,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.greenColor,
              fontWeight: FontWeight.bold,
            ),
      ),
      textDirection: ui.TextDirection.ltr,
    )..layout(minWidth: 0, maxWidth: double.infinity);

    double recentWeekDateX = size.width - recentWeekDateTextPainter.width;
    recentWeekDateTextPainter.paint(
        canvas, Offset(recentWeekDateX, size.height + 4));
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    if (oldDelegate is WeeklyBarChartPainter) {
      return oldDelegate.data != data ||
          oldDelegate.weeklyAverages != weeklyAverages;
    }
    return false;
  }
}
