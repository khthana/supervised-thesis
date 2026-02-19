import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/input_weekly_logs.dart';

class InputButton extends StatelessWidget {
  final String buttonText;
  final VoidCallback? onPressed;

  const InputButton({
    Key? key,
    required this.buttonText,
    this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 32,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              offset: const Offset(0, 2),
              blurRadius: 0,
            ),
          ],
        ),
        child: TextButton(
          style: ButtonStyle(
            foregroundColor: WidgetStateProperty.all<Color>(Colors.white),
            backgroundColor:
                WidgetStateProperty.all<Color>(AppColors.primaryColor),
            shape: WidgetStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0),
                side: const BorderSide(color: Colors.white, width: 2),
              ),
            ),
          ),
          onPressed: onPressed ??
              () {
                showModalBottomSheet<int>(
                  backgroundColor: AppColors.whiteColor,
                  context: context,
                  builder: (context) => const InputWeeklyLogs(),
                );
              },
          child: Row(
            children: [
              const Icon(
                Icons.add,
                size: 16.0,
                color: AppColors.whiteColor,
              ),
              const SizedBox(width: 4),
              Text(
                buttonText,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: AppColors.backgroundColor,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
