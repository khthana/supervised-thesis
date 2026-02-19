import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:intl/intl.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/profile/presentation/widget/profile/success_dialog.dart';

import '../../bloc/profile_bloc/profile_bloc.dart';
import '../../bloc/profile_bloc/profile_event.dart';
import '../../bloc/profile_bloc/profile_state.dart';

class CheckInWidget extends StatelessWidget {
  final ProfileLoaded profileState;

  const CheckInWidget({Key? key, required this.profileState}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final loginStats = profileState.userProfile.loginStats;
    final overallStats = profileState.userProfile.loginStats?.overAllStats;

    if (profileState is ProfileLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (overallStats == null || loginStats == null) {
      // Trigger a profile refresh if stats are missing
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.read<ProfileBloc>().add(FetchUserProfile());
      });
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    List<bool> checkedInDays =
        loginStats.checkInStats.map((stat) => stat.isLogin).toList();
    List<int> gemPoints =
        loginStats.checkInStats.map((stat) => stat.rewardAmount).toList();

    // Get current checked days count
    final checkedDays =
        loginStats.checkInStats.where((stat) => stat.isLogin).length;

    // Check if user can check in today
    final lastLoginDate = overallStats.lastLoginDate != null
        ? DateTime.parse(overallStats.lastLoginDate!)
        : DateTime(
            1900); // Use a past date to ensure first check-in is possible
    final today = DateTime.now();
    final canCheckInToday = lastLoginDate.year != today.year ||
        lastLoginDate.month != today.month ||
        lastLoginDate.day != today.day;

    void checkIn(int dayIndex) {
      final yesterday = today.subtract(const Duration(days: 1));
      final difference = today.difference(lastLoginDate).inDays;

      final isYesterday = lastLoginDate.year == yesterday.year &&
          lastLoginDate.month == yesterday.month &&
          lastLoginDate.day == yesterday.day;

      if (difference > 1 && dayIndex != 0) return;
      if (isYesterday && dayIndex != checkedDays) return;
      if (!canCheckInToday) return;

      final currentGems = profileState.userProfile.gem;
      final newGemCount = currentGems + gemPoints[dayIndex];

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return SuccessDialog(
            reward: gemPoints[dayIndex],
            iconPath: AppImages.gemIcon,
            onClose: () {
              Navigator.of(context).pop();
              context.read<ProfileBloc>().add(EditUserProfile(
                    gem: newGemCount,
                    username: '',
                    yearOfBirth: profileState.userProfile.yearOfBirth,
                    gender: profileState.userProfile.gender,
                    height: profileState.userProfile.height,
                    weight: profileState.userProfile.weight,
                  ));
              context.read<ProfileBloc>().add(CreateCheckInEvent(
                    date: DateFormat('yyyy-MM-dd').format(today),
                  ));
            },
          );
        },
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.checkinText,
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(7, (index) {
              final isNextDay = index == checkedDays;
              final isPreviousDayChecked =
                  index == 0 || checkedInDays[index - 1];
              final isClickableDay = canCheckInToday &&
                  isNextDay &&
                  !checkedInDays[index] &&
                  isPreviousDayChecked;

              return Column(
                children: [
                  GestureDetector(
                    onTap: () => isClickableDay ? checkIn(index) : null,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        color: isClickableDay
                            ? AppColors.backgroundColor
                            : const Color(0xFFF2F2F2),
                        border: Border.all(
                          color: isClickableDay
                              ? AppColors.secondaryDarkColor
                              : Colors.transparent,
                          width: 1.5,
                          strokeAlign: BorderSide.strokeAlignInside,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            '${AppStrings.xDateText} ${index + 1}',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      fontSize: 11,
                                      color: isClickableDay
                                          ? AppColors.blackColor
                                          : AppColors.darkGrayColor,
                                    ),
                          ),
                          const SizedBox(height: 4),
                          if (index == 6 && checkedInDays[index])
                            SvgPicture.asset(AppImages.openTreasureSvg,
                                height: 24)
                          else if (checkedInDays[index])
                            SvgPicture.asset(AppImages.gemCheckSvg, height: 24)
                          else if (index == 6)
                            SvgPicture.asset(
                              isClickableDay
                                  ? AppImages.colorTreasureSvg
                                  : AppImages.greyTreasureSvg,
                              height: 24,
                            )
                          else
                            SvgPicture.asset(
                              isClickableDay
                                  ? AppImages.gemIcon
                                  : AppImages.gemNotCheckSvg,
                              height: 24,
                            ),
                          const SizedBox(height: 4),
                          Text(
                            checkedInDays[index]
                                ? AppStrings.archeiveText
                                : '${gemPoints[index]}',
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      fontSize: 11,
                                      color: isClickableDay
                                          ? AppColors.blackColor
                                          : AppColors.darkGrayColor,
                                    ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                ],
              );
            }),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
