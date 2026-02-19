import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'dart:ui' as ui;

import 'package:wellwave_frontend/config/constants/enums/thai_date_formatter.dart';

class DailyBarChartPainter extends CustomPainter {
  final List<Map<String, dynamic>> data;
  final List<int> weeklyAverages;
  final BuildContext context;

  DailyBarChartPainter({
    required this.data,
    required this.weeklyAverages,
    required this.context,
  });

  @override
  void paint(Canvas canvas, Size size) {
    double maxHeight = 64;
    double maxData = data.fold(
        0.0,
        (max, item) =>
            item['value'].toDouble() > max ? item['value'].toDouble() : max);

    double barWidth = size.width / data.length;

    // วาดแถบแท่ง
    for (int i = 0; i < data.length; i++) {
      bool isRecentWeek = i >= data.length - 7;

      Paint barPaint = Paint()
        ..color = isRecentWeek ? AppColors.green25Color : AppColors.gray50Color;

      double barHeight = (data[i]['value'].toDouble() / maxData) * maxHeight;
      canvas.drawRect(
        Rect.fromLTWH(
            i * barWidth, size.height - barHeight, barWidth - 4, barHeight),
        barPaint,
      );
    }

    // คำนวณค่าเฉลี่ยของ 7 วันล่าสุด
    double recentAverage =
        weeklyAverages.isNotEmpty ? weeklyAverages.last.toDouble() : 0.0;

    Paint recentAveragePaint = Paint()
      ..color = AppColors.greenColor
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    double recentAverageHeight = (recentAverage / maxData) * maxHeight;
    double recentStartX = (data.length - 7) * barWidth;
    double recentEndX = data.length * barWidth - 4;

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

    // วาดช่วงวันที่ของ 7 วันล่าสุด
    DateTime firstDate =
        DateFormat('dd-MM-yyyy').parse(data[data.length - 7]['date']);
    DateTime lastDate =
        DateFormat('dd-MM-yyyy').parse(data[data.length - 1]['date']);

    String dateRangeText =
        ThaiDateFormatter.formatDateRange(firstDate, lastDate);

    TextPainter dateTextPainter = TextPainter(
      text: TextSpan(
        text: dateRangeText,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.greenColor,
              fontWeight: FontWeight.bold,
            ),
      ),
      textDirection: ui.TextDirection.ltr,
    )..layout(minWidth: 0, maxWidth: double.infinity);

    double centerX = recentStartX +
        ((recentEndX - recentStartX) / 2) -
        (dateTextPainter.width / 2);

    dateTextPainter.paint(canvas, Offset(centerX, size.height + 4));

    double overallAverageHeight = (recentAverage / maxData) * maxHeight;

    // วาดข้อความค่าเฉลี่ยทั้งหมด
    TextPainter overallTextPainter = TextPainter(
      text: TextSpan(
        text: 'เฉลี่ย ${recentAverage.toInt()} นาที',
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.greenColor,
              fontWeight: FontWeight.bold,
            ),
      ),
      textDirection: ui.TextDirection.ltr,
    )..layout(minWidth: 0, maxWidth: double.infinity);

    double overallTextX = 0;
    double overallTextY = size.height - overallAverageHeight - 20;

    overallTextPainter.paint(canvas, Offset(overallTextX, overallTextY));
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    if (oldDelegate is DailyBarChartPainter) {
      return oldDelegate.data != data ||
          oldDelegate.weeklyAverages != weeklyAverages;
    }
    return false;
  }
}
