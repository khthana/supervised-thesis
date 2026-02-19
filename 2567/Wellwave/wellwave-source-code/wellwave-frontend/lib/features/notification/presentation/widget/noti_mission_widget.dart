import 'package:flutter/material.dart';
import '../../../../config/constants/app_colors.dart';

class NotiMissionWidget extends StatefulWidget {
  final String time;
  final String day;
  final String? title;
  final bool isSwitched;
  final VoidCallback? onTimeTap;
  final Widget switchWidget;

  const NotiMissionWidget({
    super.key,
    required this.time,
    required this.day,
    this.title,
    required this.isSwitched,
    this.onTimeTap,
    required this.switchWidget,
  });

  @override
  State<NotiMissionWidget> createState() => _NotiMissionWidgetState();
}

class _NotiMissionWidgetState extends State<NotiMissionWidget> {
  // late bool _isSwitched = false;

  @override
  void initState() {
    super.initState();
    // bool _isSwitched = widget.isSwitched;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
          decoration: BoxDecoration(
            color: AppColors.whiteColor,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: widget.title == null
                    ? MainAxisAlignment.center
                    : MainAxisAlignment.start,
                children: [
                  GestureDetector(
                    onTap: () {
                      widget.onTimeTap?.call();
                    },
                    child: GestureDetector(
                      onTap: widget.onTimeTap,
                      child: Row(
                        children: [
                          Text(
                            widget.time,
                            style: Theme.of(context)
                                .textTheme
                                .headlineMedium
                                ?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            widget.day,
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(color: AppColors.darkGrayColor),
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (widget.title != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      widget.title!,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ],
              ),
              widget.switchWidget,
            ],
          ),
        ),
        const SizedBox(height: 12)
      ],
    );
  }
}
