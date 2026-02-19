import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:intl/intl.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../../../config/constants/app_images.dart';
import '../../../profile/presentation/widget/cancle_confirm_button.dart';
import '../../data/models/mission_notification_request_model.dart';
import '../bloc/noti_bloc.dart';
import 'noti_mission_widget.dart';

class NotificationMission extends StatefulWidget {
  const NotificationMission({super.key});

  @override
  State<NotificationMission> createState() => _NotificationMissionState();
}

class _NotificationMissionState extends State<NotificationMission> {
  DateTime time = DateTime.now();
  List<bool> selectedDays = List.filled(7, false);
  String day = '';

  @override
  void initState() {
    super.initState();
    BlocProvider.of<NotiBloc>(context).add(FetchMissionEvent());
  }

  void _toggleSwitch(bool value, MissionNotificationModel mission) {
    context.read<NotiBloc>().add(UpdateMissionEvent(
          challengeId: mission.challengeId,
          isNotificationEnabled: value,
          notiTime: mission.notiTime,
          weekdaysNoti: mission.weekdaysNoti,
        ));
  }

  void updateSelectedDaysText() {
    List<String> days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    List<int> selectedIndices = selectedDays
        .asMap()
        .entries
        .where((entry) => entry.value)
        .map((entry) => entry.key)
        .toList();

    if (selectedIndices.isEmpty) {
      setState(() => day = '');
    } else {
      bool isConsecutive = true;
      for (int i = 0; i < selectedIndices.length - 1; i++) {
        if ((selectedIndices[i] + 1) % 7 != selectedIndices[i + 1]) {
          isConsecutive = false;
          break;
        }
      }

      if (isConsecutive && selectedIndices.length > 1) {
        int firstIndex = selectedIndices.first;
        int lastIndex = selectedIndices.last;
        setState(() => day = '${days[firstIndex]} ถึง ${days[lastIndex]}');
      } else {
        setState(
            () => day = selectedIndices.map((index) => days[index]).join(', '));
      }
    }
  }

  void _submitLogs(MissionNotificationModel mission) {
    updateSelectedDaysText();
    String formattedTime = DateFormat('HH:mm').format(time);

    List<String> days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    Map<String, bool> weekdays = {
      for (int i = 0; i < selectedDays.length; i++) days[i]: selectedDays[i],
    };

    debugPrint(
        "Updating mission notification for challengeId: ${mission.challengeId}");

    context.read<NotiBloc>().add(CreateMissionEvent(
        title: mission.title,
        challengeId: mission.challengeId,
        notiTime: formattedTime,
        weekdaysNoti: weekdays,
        isNotificationEnabled: true));

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<NotiBloc, NotiState>(
      listener: (context, state) {
        if (state is NotiLoadedState && state.missionState != null) {
          setState(() {
            final missions = state.missionState!.missions;
            if (missions.isNotEmpty) {
              if (missions[0].notiTime.isNotEmpty) {
                time = DateFormat("HH:mm").parse(missions[0].notiTime);
              }

              List<String> days = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
              ];
              for (int i = 0; i < days.length; i++) {
                selectedDays[i] = missions[0].weekdaysNoti[days[i]] ?? false;
              }
              updateSelectedDaysText();
            }
          });
        }
      },
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  SvgPicture.asset(AppImages.fireIcon, height: 21),
                  const SizedBox(width: 8),
                  Text(
                    AppStrings.taskText,
                    style: Theme.of(context)
                        .textTheme
                        .headlineMedium
                        ?.copyWith(fontWeight: FontWeight.bold),
                  )
                ],
              ),
              BlocBuilder<NotiBloc, NotiState>(
                builder: (context, state) {
                  bool areAllEnabled = false;
                  if (state is NotiLoadedState && state.missionState != null) {
                    areAllEnabled = state.missionState!.missions
                        .every((mission) => mission.isNotificationEnabled);
                  }

                  return SizedBox(
                    height: 28,
                    child: TextButton(
                      onPressed: () {
                        context.read<NotiBloc>().add(
                            ToggleAllMissionsEvent(enableAll: !areAllEnabled));
                      },
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.primaryColor),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 4),
                      ),
                      child: areAllEnabled
                          ? Text(
                              AppStrings.deselectAllText,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(color: AppColors.primaryColor),
                            )
                          : Text(
                              AppStrings.selectAllText,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                      color: AppColors.secondaryDarkColor),
                            ),
                    ),
                  );
                },
              )
            ],
          ),
          const SizedBox(height: 16),
          BlocBuilder<NotiBloc, NotiState>(
            builder: (context, state) {
              if (state is NotiLoadedState && state.missionState != null) {
                return Column(
                  children: state.missionState!.missions.map((mission) {
                    return mission.status == 'active'
                        ? NotiMissionWidget(
                            time: mission.isNotificationEnabled
                                ? DateFormat('HH:mm').format(
                                    DateFormat('HH:mm').parse(mission.notiTime))
                                : AppStrings.setTimeText,
                            day: mission.isNotificationEnabled
                                ? _formatSelectedDays(mission.weekdaysNoti)
                                : '',
                            title: mission.title,
                            isSwitched: mission.isNotificationEnabled,
                            onTimeTap: mission.isNotificationEnabled
                                ? () => _showTimePickerModal(context, mission)
                                : null,
                            switchWidget: Switch(
                              value: mission
                                  .isNotificationEnabled, // Depend on state, not _isSwitched
                              onChanged: (value) {
                                _toggleSwitch(value, mission);
                              },
                              activeColor: Colors.white,
                              activeTrackColor: const Color(0xFF34C759),
                              inactiveThumbColor: AppColors.whiteColor,
                              inactiveTrackColor: AppColors.darkGrayColor,
                            ),
                          )
                        : const SizedBox.shrink();
                  }).toList(),
                );
              } else if (state is NotiError) {
                return Center(
                    child: Column(
                  children: [
                    Image.asset(AppImages.catNoItemimage, height: 128),
                    const SizedBox(height: 32),
                    Text(state.message),
                  ],
                ));
              } else {
                return Center(
                    child: Text(
                  'ไม่มีภารกิจที่กำลังทำ',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.darkGrayColor,
                      ),
                ));
              }
            },
          )
        ],
      ),
    );
  }

  String _formatSelectedDays(Map<String, bool> weekdaysNoti) {
    List<String> days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    List<String> englishDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    List<int> selectedIndices = englishDays
        .asMap()
        .entries
        .where((entry) => weekdaysNoti[entry.value] == true)
        .map((entry) => entry.key)
        .toList();

    if (selectedIndices.isEmpty) return '';

    bool isConsecutive = true;
    for (int i = 0; i < selectedIndices.length - 1; i++) {
      if ((selectedIndices[i] + 1) % 7 != selectedIndices[i + 1]) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive && selectedIndices.length > 1) {
      return '${days[selectedIndices.first]} ถึง ${days[selectedIndices.last]}';
    } else {
      return selectedIndices.map((index) => days[index]).join(', ');
    }
  }

  void _showTimePickerModal(
      BuildContext context, MissionNotificationModel mission) {
    showModalBottomSheet(
      backgroundColor: AppColors.whiteColor,
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Center(
                    child: Container(
                      height: 3,
                      width: 140,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      margin: const EdgeInsets.only(bottom: 8),
                    ),
                  ),
                  const SizedBox(height: 45),
                  _buildDaySelector(setModalState),
                  const SizedBox(height: 36),
                  SizedBox(height: 120, child: _buildTimePicker(setModalState)),
                  const SizedBox(height: 36),
                  ConfirmCancelButtons(
                    onConfirm: () => _submitLogs(mission),
                    onCancel: () => setState(() => Navigator.pop(context)),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildDaySelector(StateSetter setModalState) {
    List<String> days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(AppStrings.dayText,
            style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(7, (index) {
            return GestureDetector(
              onTap: () {
                setModalState(() {
                  selectedDays[index] = !selectedDays[index];
                });
              },
              child: Container(
                width: 44,
                height: 52,
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: selectedDays[index]
                      ? AppColors.primaryColor
                      : AppColors.whiteColor,
                  border: Border.all(color: AppColors.primaryColor),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Center(
                  child: Text(
                    days[index],
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: selectedDays[index]
                              ? Colors.white
                              : AppColors.primaryColor,
                        ),
                  ),
                ),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildTimePicker(StateSetter setModalState) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(AppStrings.timeText,
            style: Theme.of(context)
                .textTheme
                .bodyMedium
                ?.copyWith(fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Expanded(
          child: CupertinoDatePicker(
            initialDateTime: time,
            mode: CupertinoDatePickerMode.time,
            use24hFormat: true,
            onDateTimeChanged: (DateTime newTime) {
              setModalState(() => time = newTime);
            },
          ),
        )
      ],
    );
  }
}
