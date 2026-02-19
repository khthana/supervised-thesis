import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

class InputDailyLogs extends StatefulWidget {
  final int initialUnits;
  final String title;
  final String unitLabel;
  final int maxLevel;
  final List<String> svgIcons;

  const InputDailyLogs({
    super.key,
    this.initialUnits = 1,
    required this.title,
    required this.unitLabel,
    this.maxLevel = 0,
    required this.svgIcons,
  });

  @override
  _InputDailyLogsState createState() => _InputDailyLogsState();
}

class _InputDailyLogsState extends State<InputDailyLogs> {
  late int inputLevel = 1;

  void increaseInputLevel() {
    setState(() {
      if (inputLevel < widget.maxLevel - 1) {
        inputLevel++;
      } else {
        debugPrint('Max level reached');
      }
    });
  }

  void decreaseInputLevel() {
    setState(() {
      if (inputLevel > 1) {
        inputLevel--;
      }
    });
  }

  @override
  void initState() {
    super.initState();
    inputLevel = widget.initialUnits.clamp(1, widget.maxLevel - 1);
  }

  Widget buildInputIcon(double size) {
    return SvgPicture.asset(
      widget.svgIcons[inputLevel],
      width: size,
      height: size,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const SizedBox(height: 24),
        Container(
            height: 3,
            width: 140,
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.only(bottom: 8),
          ),
          const SizedBox(height: 24),
        Center(
          child: Text(
            widget.title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(),
          ),
        ),
        const SizedBox(height: 24),
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            buildInputIcon(100),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.remove_circle_outline,
                      color: Colors.grey, size: 48),
                  onPressed: decreaseInputLevel,
                ),
                const SizedBox(width: 24.0),
                Text(
                  '$inputLevel',
                  style: Theme.of(context).textTheme.titleLargeBold?.copyWith(),
                ),
                const SizedBox(width: 24.0),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline,
                      color: Colors.grey, size: 48),
                  onPressed: increaseInputLevel,
                ),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  widget.unitLabel,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.greyColor,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 24)
          ],
        ),
        TextButton(
          style: ButtonStyle(
            padding: WidgetStateProperty.all<EdgeInsets>(
              const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
            ),
            foregroundColor:
                WidgetStateProperty.all<Color>(AppColors.backgroundColor),
            backgroundColor:
                WidgetStateProperty.all<Color>(AppColors.primaryColor),
            shape: WidgetStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
          ),
          onPressed: () => Navigator.pop(context, inputLevel),
          child: SizedBox(
            width: 240,
            height: 60,
            child: Center(
              child: Text(AppStrings.confirmText,
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppColors.backgroundColor)),
            ),
          ),
        ),
        const SizedBox(height: 24)
      ],
    );
  }
}
