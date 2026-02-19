import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';
import 'package:wellwave_frontend/features/home/data/models/get_user_challenges_request_model.dart'
    as UserChallenge;
import 'package:wellwave_frontend/features/home/data/models/recommend_challenges_request_model.dart'
    as RecChallenge;
import 'package:wellwave_frontend/features/home/widget/gradient_button.dart';

class RecommendedHabitCard extends StatelessWidget {
  final dynamic progressData; // รับได้ทั้งสองประเภท

  const RecommendedHabitCard({Key? key, required this.progressData})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    // ตรวจสอบประเภทและแปลงให้เป็นรูปแบบที่ถูกต้อง
    final habit = _getHabitData(progressData);
    return Container(
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: AppColors.blackColor.withOpacity(0.1),
            spreadRadius: 2,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16.0),
      constraints: BoxConstraints(
        maxWidth: MediaQuery.of(context).size.width * 0.5,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // เริ่มด้วยรูปภาพ (ขนาดใหญ่ขึ้น)
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: habit.thumbnailUrl != null && habit.thumbnailUrl.isNotEmpty
                ? Image.network(
                    "$baseUrl${habit.thumbnailUrl}",
                    height: 64,
                    errorBuilder: (context, error, stackTrace) {
                      debugPrint('Image error: $error');
                      return const Center(
                        child: Icon(
                          Icons.image_not_supported,
                          size: 40,
                          color: AppColors.greyColor,
                        ),
                      );
                    },
                  )
                : const Center(
                    child: Icon(
                      Icons.fitness_center,
                      size: 40,
                      color: AppColors.greyColor,
                    ),
                  ),
          ),

          const SizedBox(height: 8),

          // ชื่อกิจกรรม
          Container(
            height: 32,
            child: Text(
              habit.title ?? 'กิจกรรมแนะนำ',
              textAlign: TextAlign.left,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.blackColor,
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ),

          const SizedBox(height: 8),

          // ข้อมูลรางวัล
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  if (habit.expReward != null && habit.expReward != 0) ...[
                    SvgPicture.asset(
                      AppImages.expIcon,
                      height: 20,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      "${habit.expReward} ${AppStrings.expText.toUpperCase()}",
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.blackColor,
                          ),
                    ),
                  ],
                  if (habit.gemReward != null && habit.gemReward != 0) ...[
                    const SizedBox(width: 8),
                    SvgPicture.asset(
                      AppImages.gemIcon,
                      height: 20,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      "${habit.gemReward} ${AppStrings.gemText.toUpperCase()}",
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.blackColor,
                          ),
                    ),
                  ],
                ],
              ),
            ],
          ),

          const SizedBox(height: 12),

          // ปุ่มดูกิจกรรม
          CardButton(
            buttonText: AppStrings.seeMissionText,
            onPressed: () {
              context.goNamed(AppPages.habitChallengeName);
            },
          ),
        ],
      ),
    );
  }

  // เมธอดสำหรับดึงข้อมูล habit จาก Challenge ของทั้งสองประเภท
  dynamic _getHabitData(dynamic challenge) {
    if (challenge is UserChallenge.Challenge) {
      return challenge.habits;
    } else if (challenge is RecChallenge.Challenge) {
      return challenge.habits;
    }

    // กรณีไม่ใช่ทั้งสองประเภท
    debugPrint('Unknown challenge type: ${challenge.runtimeType}');
    return null;
  }
}
