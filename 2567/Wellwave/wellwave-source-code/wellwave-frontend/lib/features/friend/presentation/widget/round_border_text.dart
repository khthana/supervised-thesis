import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class RoundedText extends StatelessWidget {
  final String text;
  final String svgPath;
  final bool isShowNavi;
  final String appPages;
  final double horizontal;
  final double vertical;
  final double iconSize;
  final bool isBold;
  final double radius;

  const RoundedText({
    Key? key,
    required this.text,
    required this.svgPath,
    this.isShowNavi = false,
    this.appPages = '',
    this.horizontal = 16,
    this.vertical = 4,
    this.iconSize = 24,
    this.isBold = false,
    this.radius = 8,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: horizontal, vertical: vertical),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        color: AppColors.whiteColor,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              SvgPicture.asset(
                svgPath,
                height: iconSize,
              ),
              const SizedBox(width: 8),
              Text(
                text,
                style: isBold
                    ? Theme.of(context)
                        .textTheme
                        .headlineMedium
                        ?.copyWith(fontWeight: FontWeight.bold)
                    : Theme.of(context).textTheme.bodySmall?.copyWith(),
              ),
            ],
          ),
          isShowNavi
              ? Row(
                  children: [
                    const SizedBox(width: 16),
                    GestureDetector(
                      onTap: () {
                        context.goNamed(appPages);
                      },
                      child: Icon(
                        Icons.navigate_next_rounded,
                        color: AppColors.greyColor,
                        size: iconSize,
                      ),
                    ),
                  ],
                )
              : const SizedBox.shrink()
        ],
      ),
    );
  }
}
