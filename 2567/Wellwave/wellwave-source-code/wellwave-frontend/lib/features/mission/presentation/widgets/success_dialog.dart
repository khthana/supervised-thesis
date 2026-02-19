import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'package:wellwave_frontend/config/constants/app_images.dart';

class SuccessDialog extends StatelessWidget {
  final int reward;
  final Widget iconPath;

  const SuccessDialog({
    super.key,
    required this.reward,
    required this.iconPath,
  });

  @override
  Widget build(BuildContext context) {
    bool isDialogClosed = false;

    return Dialog(
      backgroundColor: Colors.transparent,
      child: Center(
        child: Container(
          width: 300,
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Stack(
            alignment: Alignment.topCenter,
            children: [
              Container(
                color: Colors.transparent,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.grey, width: 1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.all(30.0),
                        child: Padding(
                          padding: const EdgeInsets.only(top: 36.0),
                          child: Column(
                            children: [
                              const Text(
                                AppStrings.youReceivedText,
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  iconPath,
                                  const SizedBox(width: 8),
                                  Text(
                                    reward.toString(),
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 36.0),
                        child: GestureDetector(
                          onTap: () {
                            if (!isDialogClosed) {
                              context.read<MissionBloc>().add(
                                    UpdateGemsEvent(
                                      gemsToAdd: reward,
                                    ),
                                  );
                              Navigator.of(context).pop();
                              isDialogClosed = true;
                            }
                          },
                          child: const Text(
                            AppStrings.closeWindowText,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                              decoration: TextDecoration.underline,
                              decorationColor: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Image.asset(AppImages.barSuccessImage),
            ],
          ),
        ),
      ),
    );
  }
}

class SuccessMissionDialog extends StatelessWidget {
  final int reward;
  final Widget iconPath;

  const SuccessMissionDialog({
    super.key,
    required this.reward,
    required this.iconPath,
  });

  @override
  Widget build(BuildContext context) {
    bool isDialogClosed = false;

    return Dialog(
      backgroundColor: Colors.transparent,
      child: Center(
        child: Container(
          width: 300,
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Stack(
            alignment: Alignment.topCenter,
            children: [
              Container(
                color: Colors.transparent,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.grey, width: 1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.all(30.0),
                        child: Padding(
                          padding: const EdgeInsets.only(top: 36.0),
                          child: Column(
                            children: [
                              const Text(
                                AppStrings.youReceivedText,
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  iconPath,
                                  const SizedBox(width: 8),
                                  Text(
                                    reward.toString(),
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 36.0),
                        child: GestureDetector(
                          onTap: () {
                            if (!isDialogClosed) {
                              context.read<MissionBloc>().add(
                                    UpdateGemsEvent(
                                      gemsToAdd: reward,
                                    ),
                                  );
                              Navigator.of(context).pop();
                              isDialogClosed = true;
                            }
                          },
                          child: const Text(
                            AppStrings.closeWindowText,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                              decoration: TextDecoration.underline,
                              decorationColor: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Image.asset(AppImages.barMissionSuccessImage),
            ],
          ),
        ),
      ),
    );
  }
}

class SuccessHabitDialog extends StatefulWidget {
  final int? expReward;
  final int? calorieReward;
  final String timeTaken;
  final Function(String) onMoodSelected;
  final bool isFinished;
  final int trackId;

  const SuccessHabitDialog({
    super.key,
    this.expReward,
    this.calorieReward,
    required this.timeTaken,
    required this.onMoodSelected,
    required this.isFinished,
    required this.trackId,
  });

  @override
  _SuccessHabitDialogState createState() => _SuccessHabitDialogState();
}

class _SuccessHabitDialogState extends State<SuccessHabitDialog> {
  String? selectedMood;
  bool isDialogClosed = false;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Center(
        child: Container(
          width: 350,
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Stack(
            alignment: Alignment.topCenter,
            children: [
              Container(
                color: Colors.transparent,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.grey, width: 1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.all(30.0),
                        child: Padding(
                          padding: const EdgeInsets.only(top: 36.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                child: Stack(
                                  children: [
                                    Positioned.fill(
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(12),
                                        child: Image.asset(
                                          AppImages.frameTimeMissionIcon,
                                          fit: BoxFit.fill,
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 16, vertical: 12),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          SvgPicture.asset(
                                            AppImages.clockBlackIcon,
                                            width: 24,
                                          ),
                                          SizedBox(width: 6),
                                          Text(
                                            widget.timeTaken,
                                            style: Theme.of(context)
                                                .textTheme
                                                .headlineLarge!
                                                .copyWith(
                                                  color: AppColors.blackColor,
                                                ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(height: 24),
                              Text(
                                'รางวัลที่ได้รับ',
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium!
                                    .copyWith(
                                      color: AppColors.blackColor,
                                    ),
                              ),
                              SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  _rewardItem(AppImages.expIcon,
                                      "${widget.expReward} EXP"),
                                  SizedBox(width: 16),
                                  _rewardItem(AppImages.caloriesIcon,
                                      "${widget.calorieReward} แคลอรี่"),
                                ],
                              ),
                              if (widget.isFinished)
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    SizedBox(height: 25),
                                    Text(
                                      'ภารกิจเป็นยังไงบ้าง?',
                                      style: Theme.of(context)
                                          .textTheme
                                          .headlineMedium!
                                          .copyWith(
                                            color: AppColors.blackColor,
                                          ),
                                    ),
                                    SizedBox(height: 12),
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        _emojiItem(
                                          AppImages.verySadGreyIcon,
                                          AppImages.verySadColorIcon,
                                          'กดดัน',
                                        ),
                                        _emojiItem(
                                          AppImages.sadGreyIcon,
                                          AppImages.sadColorIcon,
                                          'ท้อแท้',
                                        ),
                                        _emojiItem(
                                          AppImages.neutralGreyIcon,
                                          AppImages.neutralColorIcon,
                                          'เฉยๆ',
                                        ),
                                        _emojiItem(
                                          AppImages.happyGreyIcon,
                                          AppImages.happyColorIcon,
                                          'พอใจ',
                                        ),
                                        _emojiItem(
                                          AppImages.veryHappyGreyIcon,
                                          AppImages.veryHappyColorIcon,
                                          'สดใส',
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                            ],
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 36.0),
                        child: GestureDetector(
                          onTap: () {
                            if (!isDialogClosed && selectedMood != null) {
                              setState(() {
                                isDialogClosed = true;
                              });
                              if (selectedMood != null)
                                context.read<MissionBloc>().add(
                                      SubmitMoodTrackEvent(
                                        trackId: widget.trackId,
                                        moodFeedback: selectedMood!,
                                      ),
                                    );
                            }
                            Navigator.of(context)
                              ..pop()
                              ..pop();
                          },
                          child: const Text(
                            AppStrings.closeWindowText,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                              decoration: TextDecoration.underline,
                              decorationColor: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Image.asset(AppImages.barMissionSuccessImage),
            ],
          ),
        ),
      ),
    );
  }

  Widget _rewardItem(String svgPath, String text) {
    return Row(
      children: [
        SvgPicture.asset(
          svgPath,
          width: 32,
          height: 32,
        ),
        SizedBox(width: 6),
        Text(
          text,
          style: TextStyle(fontSize: 16),
        ),
      ],
    );
  }

  Widget _emojiItem(String greyIcon, String colorIcon, String label) {
    final bool isSelected = selectedMood == label;

    return GestureDetector(
      onTap: () {
        setState(() {
          selectedMood = label;
        });
      },
      child: SvgPicture.asset(
        isSelected ? colorIcon : greyIcon,
        width: 56,
        height: 56,
      ),
    );
  }
}
