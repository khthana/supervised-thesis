import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(
                  AppImages.wellwaveLogo,
                ),
              ],
            ),
          ),
          Positioned(
            bottom: 48,
            right: 20,
            child: FloatingActionButton(
              onPressed: () {
                context.goNamed(AppPages.startName);
              },
              backgroundColor: AppColors.primaryColor,
              shape: const CircleBorder(),
              child: const Icon(
                Icons.arrow_forward,
                color: AppColors.whiteColor,
                size: 30,
              ),
            ),
          )
        ],
      ),
    );
  }
}
