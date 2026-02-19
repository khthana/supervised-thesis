import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../../config/constants/app_colors.dart';

class ExchangeItemComponent extends StatefulWidget {
  final String itemImagePath;
  final String? requiredImagePath;
  final double? itemValue;
  final int? dayBoost;
  final int? requiredValue;
  final VoidCallback? onButtonClick;
  final bool isEnabled;
  final DateTime? expiredDate;

  const ExchangeItemComponent({
    Key? key,
    required this.itemImagePath,
    this.requiredImagePath,
    required this.itemValue,
    this.requiredValue,
    this.onButtonClick,
    this.dayBoost,
    this.isEnabled = true,
    this.expiredDate,
  }) : super(key: key);

  @override
  State<ExchangeItemComponent> createState() => _ExchangeItemComponentState();
}

class _ExchangeItemComponentState extends State<ExchangeItemComponent> {
  Timer? _timer;
  String _remainingTime = "00:00:00";

  @override
  void initState() {
    super.initState();
    if (widget.expiredDate != null) {
      _startTimer();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (widget.expiredDate != null) {
        final now = DateTime.now();
        final difference = widget.expiredDate!.difference(now);

        if (difference.isNegative) {
          setState(() {
            _remainingTime = "00:00:00";
          });
          _timer?.cancel();
        } else {
          final hours = difference.inHours;
          final minutes = difference.inMinutes % 60;
          final seconds = difference.inSeconds % 60;

          setState(() {
            _remainingTime =
                "${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}";
          });
        }
      }
    });

    // Initialize the time immediately without waiting for the first second
    if (widget.expiredDate != null) {
      final now = DateTime.now();
      final difference = widget.expiredDate!.difference(now);

      if (difference.isNegative) {
        _remainingTime = "00:00:00";
      } else {
        final hours = difference.inHours;
        final minutes = difference.inMinutes % 60;
        final seconds = difference.inSeconds % 60;

        _remainingTime =
            "${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}";
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 145,
      height: 225,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [
            BoxShadow(
              color: Color.fromRGBO(0, 0, 0, 0.25),
              offset: Offset(0, 0),
              blurRadius: 4,
            )
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SvgPicture.asset(
              widget.itemImagePath,
              height: 73,
            ),
            const SizedBox(height: 12),
            widget.dayBoost != null
                ? Column(
                    children: [
                      Text(
                        "${widget.itemValue} เท่า",
                        style:
                            Theme.of(context).textTheme.labelMedium?.copyWith(),
                      ),
                      Text(
                        "${widget.dayBoost} วัน",
                        style: Theme.of(context)
                            .textTheme
                            .labelMedium
                            ?.copyWith(fontSize: 18),
                      )
                    ],
                  )
                : Text(
                    widget.itemValue! % 1 == 0
                        ? widget.itemValue!.toInt().toString()
                        : widget.itemValue.toString(),
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(),
                  ),
            const SizedBox(height: 12),
            widget.expiredDate == null
                ? GestureDetector(
                    onTap: widget.isEnabled ? widget.onButtonClick : null,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 9),
                      decoration: BoxDecoration(
                        color: widget.isEnabled
                            ? AppColors.primaryColor
                            : AppColors.greyColor,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.white, width: 1),
                        boxShadow: const [
                          BoxShadow(
                            color: Color.fromRGBO(0, 0, 0, 0.15),
                            offset: Offset(0, 2),
                            blurRadius: 0,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          widget.requiredImagePath == null
                              ? const SizedBox()
                              : SvgPicture.asset(
                                  widget.requiredImagePath!,
                                  height: 21,
                                ),
                          if (widget.requiredImagePath != null)
                            const SizedBox(width: 10),
                          widget.requiredValue == null
                              ? Text(
                                  'ใช้งาน',
                                  style: Theme.of(context)
                                      .textTheme
                                      .labelLarge
                                      ?.copyWith(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 16,
                                          color: Colors.white),
                                )
                              : Text(
                                  widget.requiredValue.toString(),
                                  style: Theme.of(context)
                                      .textTheme
                                      .labelLarge
                                      ?.copyWith(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 16,
                                          color: Colors.white),
                                ),
                        ],
                      ),
                    ),
                  )
                : Text(
                    _remainingTime,
                    style: Theme.of(context)
                        .textTheme
                        .labelMedium
                        ?.copyWith(color: AppColors.greyColor, fontSize: 18),
                  ),
          ],
        ),
      ),
    );
  }
}
