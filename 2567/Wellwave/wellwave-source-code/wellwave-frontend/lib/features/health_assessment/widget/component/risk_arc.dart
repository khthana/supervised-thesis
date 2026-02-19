import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'dart:math' as math;

import '../../../../config/constants/enums/risk_condition.dart';

class RiskArc extends CustomPainter {
  final double percentage;

  RiskArc({required this.percentage});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke
      ..strokeWidth = 16;

    paint.color = Colors.grey[300]!;
    canvas.drawArc(
      Rect.fromCenter(
          center: Offset(size.width / 2, size.height),
          width: size.width,
          height: size.width),
      math.pi,
      math.pi,
      false,
      paint,
    );

    paint.shader = const LinearGradient(
      colors: [
        AppColors.graphLevelMintColor,
        AppColors.graphLevelGreenColor,
        AppColors.graphLevelYellowColor,
        AppColors.graphLevelOrangeColor,
        AppColors.graphLevelPinkColor,
      ],
      stops: [0.0, 0.25, 0.5, 0.75, 1.0],
    ).createShader(Rect.fromCircle(
        center: Offset(size.width / 2, size.height), radius: size.width / 2));

    canvas.drawArc(
      Rect.fromCenter(
          center: Offset(size.width / 2, size.height),
          width: size.width,
          height: size.width),
      math.pi,
      math.pi * percentage,
      false,
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class GaugeWidget extends StatefulWidget {
  final double averageRiskScore;

  const GaugeWidget({super.key, required this.averageRiskScore});

  @override
  _GaugeWidgetState createState() => _GaugeWidgetState();
}

class _GaugeWidgetState extends State<GaugeWidget> {
  @override
  Widget build(BuildContext context) {
    final riskText =
        RiskTextCondition.getRiskTextFromAverage(widget.averageRiskScore);

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            CustomPaint(
              size: Size(MediaQuery.of(context).size.width,
                  MediaQuery.of(context).size.width / 2 - 24),
              painter: RiskArc(percentage: widget.averageRiskScore),
            ),
            Positioned(
              bottom: 24,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "ภาวะเมตาบอลิกซินโดรมของคุณ",
                    textAlign: TextAlign.center,
                    style: Theme.of(context)
                        .textTheme
                        .bodySmall
                        ?.copyWith(color: AppColors.blackColor),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    riskText['text'],
                    textAlign: TextAlign.center,
                    style: Theme.of(context)
                        .textTheme
                        .titleLarge
                        ?.copyWith(color: AppColors.blackColor),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
