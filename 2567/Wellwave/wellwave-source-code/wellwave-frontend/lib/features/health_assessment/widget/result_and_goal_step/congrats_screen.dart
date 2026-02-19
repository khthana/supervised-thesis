import 'package:confetti/confetti.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class CongratsScreen extends StatefulWidget {
  const CongratsScreen({super.key});

  @override
  _CongratsScreenState createState() => _CongratsScreenState();
}

class _CongratsScreenState extends State<CongratsScreen> {
  late ConfettiController _confettiController;

  @override
  void initState() {
    super.initState();
    _confettiController =
        ConfettiController(duration: const Duration(seconds: 1));

    _confettiController.play();
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Future.delayed(const Duration(seconds: 5), () {
      context.goNamed(AppPages.homeName);
    });
    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        return Scaffold(
          body: Stack(
            children: [
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Center(
                    child: Column(
                      children: [
                        SvgPicture.asset(AppImages.recommendIcon),
                        const SizedBox(height: 48),
                        Text(
                          "ยินดีด้วย!",
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge
                              ?.copyWith(color: AppColors.blackColor),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          AppStrings.healthPlanDetailsText,
                          textAlign: TextAlign.center,
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(color: AppColors.blackColor),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              Align(
                alignment: Alignment.topCenter,
                child: RepaintBoundary(
                  child: ConfettiWidget(
                    confettiController: _confettiController,
                    blastDirectionality: BlastDirectionality.explosive,
                    emissionFrequency: 0.3,
                    numberOfParticles: 2,
                    gravity: 0.3,
                    minBlastForce: 1,
                    maxBlastForce: 5,
                    colors: const [
                      AppColors.pinkColor,
                      AppColors.yellowColor,
                      AppColors.mintColor,
                    ],
                    createParticlePath: (size) {
                      return drawTriangle(size);
                    },
                  ),
                ),
              )
            ],
          ),
        );
      },
    );
  }

  Path drawTriangle(Size size) {
    final path = Path();
    final halfWidth = size.width / 2;
    final height = size.height;

    path.moveTo(halfWidth, 0);

    path.lineTo(size.width, height);
    path.lineTo(0, height);

    path.close();

    return path;
  }
}
