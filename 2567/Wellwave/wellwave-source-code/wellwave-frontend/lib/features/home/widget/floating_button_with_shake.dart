import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/features/home/presentation/screen/home_screen.dart';

import 'show_assessment_popup.dart';

class FloatingButtonWithShake extends StatefulWidget {
  const FloatingButtonWithShake({Key? key}) : super(key: key);

  @override
  _FloatingButtonWithShakeState createState() =>
      _FloatingButtonWithShakeState();
}

class _FloatingButtonWithShakeState extends State<FloatingButtonWithShake>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _shakeAnimation;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _shakeAnimation = Tween<double>(begin: 2, end: -4).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.elasticInOut,
      ),
    );

    _animationController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 16.0,
      right: 16.0,
      child: InkWell(
        onTap: () async {
          await setLastButtonPressedDate(DateTime.now());

          showAssessmentPopup(context);
        },
        child: AnimatedBuilder(
          animation: _shakeAnimation,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(0, _shakeAnimation.value),
              child: Container(
                decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      spreadRadius: 0.1,
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: SvgPicture.asset(
                  AppImages.avatarFloatingAssessmentImage,
                  height: 88.0,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
