import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_images.dart';
import '../../../../config/constants/app_strings.dart';
import '../bloc/noti_bloc.dart';
import '../../../profile/presentation/widget/cancle_confirm_button.dart';

class WaterPlanWidget extends StatefulWidget {
  const WaterPlanWidget({super.key});

  @override
  State<WaterPlanWidget> createState() => _WaterPlanWidgetState();
}

class _WaterPlanWidgetState extends State<WaterPlanWidget> {
  final _secureStorage = const FlutterSecureStorage();
  List<TimeOfDay?> glassTimes = List.generate(8, (index) => null);

  @override
  void initState() {
    super.initState();
    BlocProvider.of<NotiBloc>(context).add(FetchDrinkPlanEvent());
  }

  Future<void> _adjustTime(int index) async {
    TimeOfDay? selectedTime = glassTimes[index];

    DateTime? minDateTime;
    DateTime? maxDateTime;

    if (index > 0 && glassTimes[index - 1] != null) {
      TimeOfDay prevTime = glassTimes[index - 1]!;
      minDateTime = DateTime(2025, 1, 1, prevTime.hour, prevTime.minute);
    }

    if (index < glassTimes.length - 1 && glassTimes[index + 1] != null) {
      TimeOfDay nextTime = glassTimes[index + 1]!;
      maxDateTime = DateTime(2025, 1, 1, nextTime.hour, nextTime.minute);
    }

    await showModalBottomSheet<void>(
      backgroundColor: Colors.white,
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    height: 3,
                    width: 140,
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    margin: const EdgeInsets.only(bottom: 8),
                  ),
                  const SizedBox(height: 40),
                  Expanded(
                    child: CupertinoDatePicker(
                      initialDateTime: DateTime(
                        2025,
                        1,
                        1,
                        selectedTime?.hour ?? 9,
                        selectedTime?.minute ?? 0,
                      ),
                      mode: CupertinoDatePickerMode.time,
                      use24hFormat: true,
                      minimumDate: minDateTime,
                      maximumDate: maxDateTime,
                      onDateTimeChanged: (DateTime newDateTime) {
                        setModalState(() {
                          selectedTime = TimeOfDay(
                            hour: newDateTime.hour,
                            minute: newDateTime.minute,
                          );
                        });
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                  ConfirmCancelButtons(
                    onConfirm: () => _submitLogs(index, selectedTime!),
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

  Future<void> _submitLogs(int index, TimeOfDay selectedTime) async {
    final uid = await _secureStorage.read(key: 'user_uid');
    if (uid == null) {
      throw Exception("No access uid found");
    }
    final String formattedTime = _formatTimeOfDay(selectedTime);

    context.read<NotiBloc>().add(CreateDrinkPlanEvent(
          uid: int.parse(uid),
          glassNumber: index + 1,
          notitime: formattedTime,
        ));

    setState(() {
      glassTimes[index] = selectedTime;
    });

    Navigator.pop(context);
  }

  String _formatTimeOfDay(TimeOfDay? time) {
    if (time == null) return '--:--';
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<NotiBloc, NotiState>(builder: (context, state) {
      if (state is NotiLoadedState &&
          state.drinkPlanState != null &&
          state.drinkPlanState!.isActive) {
        for (var setting in state.drinkPlanState!.settings) {
          int glassIndex = setting.glassNumber - 1;
          if (glassIndex >= 0 && glassIndex < glassTimes.length) {
            glassTimes[glassIndex] = TimeOfDay(
              hour: int.parse(setting.notitime.split(':')[0]),
              minute: int.parse(setting.notitime.split(':')[1]),
            );
          }
        }

        return SizedBox(
          height: MediaQuery.of(context).size.height,
          child: SingleChildScrollView(
            child: Column(
              children: [
                Stack(
                  children: [
                    Positioned.fill(
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: LayoutBuilder(
                          builder: (context, constraints) {
                            return Column(
                              children: [
                                const SizedBox(height: 40, child: DashedLine()),
                                ...List.generate(
                                  glassTimes.length * 2 - 1,
                                  (index) => index.isEven
                                      ? const CircleAvatar(
                                          radius: 4,
                                          backgroundColor:
                                              AppColors.primaryColor)
                                      : const SizedBox(
                                          height: 80, child: DashedLine()),
                                ),
                              ],
                            );
                          },
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(left: 24, bottom: 24),
                      child: ListView.builder(
                        physics: const NeverScrollableScrollPhysics(),
                        shrinkWrap: true,
                        itemCount: 8,
                        itemBuilder: (context, index) {
                          final formattedTime =
                              _formatTimeOfDay(glassTimes[index]);
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0),
                            child: GestureDetector(
                              onTap: () => _adjustTime(index),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    vertical: 24, horizontal: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Row(
                                  children: [
                                    const SizedBox(width: 12),
                                    SvgPicture.asset(
                                      AppImages.glassIcon,
                                      height: 24,
                                    ),
                                    const SizedBox(width: 12),
                                    Text(
                                      'แก้วที่ ${index + 1}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium,
                                    ),
                                    const Spacer(),
                                    Text(formattedTime,
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodyMedium
                                            ?.copyWith(
                                                fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      } else if (state is NotiLoading) {
        return const Center(child: CircularProgressIndicator());
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
        return Text(
          AppStrings.noDataAvaliableText,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: AppColors.darkGrayColor,
              ),
        );
      }
    });
  }
}

class DashedLine extends StatelessWidget {
  const DashedLine({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        const dashWidth = 4.0;
        const dashSpace = 4.0;
        final dashCount =
            (constraints.constrainHeight() / (dashWidth + dashSpace)).floor();
        return Flex(
          direction: Axis.vertical,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(
            dashCount,
            (index) => const SizedBox(
              width: 1,
              height: dashWidth,
              child: DecoratedBox(
                decoration: BoxDecoration(color: AppColors.primaryColor),
              ),
            ),
          ),
        );
      },
    );
  }
}
