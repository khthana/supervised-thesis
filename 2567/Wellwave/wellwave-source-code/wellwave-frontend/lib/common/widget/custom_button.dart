import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class CustomButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String title;
  final double width;
  final Color bgColor;
  final Color? outlineColor;
  final Color? textColor;

  const CustomButton({
    Key? key,
    required this.onPressed,
    required this.title,
    required this.bgColor,
    this.outlineColor,
    this.textColor,
    this.width = 250.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.all(bgColor),
          elevation: WidgetStateProperty.all(0),
          padding: WidgetStateProperty.all(
              const EdgeInsets.symmetric(vertical: 16.0)),
          shape: WidgetStateProperty.all(RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0),
            side: outlineColor != null
                ? BorderSide(color: outlineColor!, width: 2.0)
                : BorderSide.none,
          )),
        ),
        child: Text(
          title,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: textColor,
              ),
        ),
      ),
    );
  }
}

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
          onPressed: onPressed ?? () {},
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

class CardButton extends StatelessWidget {
  final String buttonText;
  final VoidCallback? onPressed;

  const CardButton({
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
          onPressed: onPressed ?? () {},
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
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

class CustomButtonSmall extends StatelessWidget {
  final VoidCallback? onPressed;
  final String title;
  final double width;
  final Color bgColor;
  final Color? outlineColor;
  final Color? textColor;

  const CustomButtonSmall({
    Key? key,
    required this.onPressed,
    required this.title,
    required this.bgColor,
    this.outlineColor,
    this.textColor,
    this.width = 120.0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.all(bgColor),
          elevation: WidgetStateProperty.all(0),
          padding: WidgetStateProperty.all(
              const EdgeInsets.symmetric(vertical: 8.0)),
          shape: WidgetStateProperty.all(RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
            side: outlineColor != null
                ? BorderSide(color: outlineColor!, width: 1.0)
                : BorderSide.none,
          )),
        ),
        child: Text(
          title,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: textColor,
              ),
        ),
      ),
    );
  }
}
