import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class GradientCircularProgressIndicator extends StatelessWidget {
  final double value;

  const GradientCircularProgressIndicator({
    Key? key,
    required this.value,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size.square(36),
      painter: _GradientCircularProgressPainter(
        value: value,
        gradientColors: [AppColors.primaryColor, AppColors.skyblueColor],
        strokeWidth: 6.0,
      ),
    );
  }
}

class _GradientCircularProgressPainter extends CustomPainter {
  final double value;
  final List<Color> gradientColors;
  final double strokeWidth;

  _GradientCircularProgressPainter({
    required this.value,
    required this.gradientColors,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final double radius = (size.width - strokeWidth) / 2;
    final center = Offset(size.width / 2, size.height / 2);

    final Paint backgroundPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..color = AppColors.gray50Color;
    canvas.drawCircle(center, radius, backgroundPaint);

    final Rect rect = Rect.fromCircle(center: center, radius: radius);
    final Gradient gradient = SweepGradient(
      startAngle: 0.0,
      endAngle: 2 * 3.14,
      colors: [...gradientColors, gradientColors.first],
    );

    final Paint progressPaint = Paint()
      ..shader = gradient.createShader(rect)
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = strokeWidth;

    final double sweepAngle = 2 * 3.14 * value;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -3.14 / 2,
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class GradientCircularProgressWithText extends StatelessWidget {
  final double value;
  final TextStyle? textStyle;

  const GradientCircularProgressWithText({
    Key? key,
    required this.value,
    this.textStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final String percentageText = '${(value * 100).toInt()}%';

    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            GradientCircularProgressIndicator(
              value: value,
            ),
          ],
        ),
      ],
    );
  }
}
