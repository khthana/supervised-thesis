import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';

class RegisterSuccess extends StatelessWidget {
  const RegisterSuccess({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SvgPicture.asset(AppImages.sunnyIcon),
          const SizedBox(
            height: 52,
          ),
          Text(
            'สมัครสมาชิกสำเร็จ',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(
            height: 12,
          ),
          Text(
            'ขอบคุณสำหรับการสมัครสมาชิก\nยินดีต้อนรับสู่ WellWave!',
            style: Theme.of(context)
                .textTheme
                .bodyMedium!
                .copyWith(color: AppColors.darkGrayColor),
            textAlign: TextAlign.center,
          ),
          const SizedBox(
            height: 48,
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              foregroundColor: AppColors.whiteColor,
              backgroundColor: AppColors.primaryColor,
              minimumSize: const Size(350, 60),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
            onPressed: () {
              context.goNamed(AppPages.loginName);
            },
            child: Text(
              'เข้าสู่ระบบ',
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium!
                  .copyWith(color: AppColors.whiteColor),
            ),
          ),
        ],
      ),
    );
  }
}
