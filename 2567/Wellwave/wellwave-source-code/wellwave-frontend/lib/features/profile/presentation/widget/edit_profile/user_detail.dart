import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_ruler_picker/flutter_ruler_picker.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_bloc.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_event.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_state.dart';

import '../../../../logs/presentation/widget/scale_record_widget.dart';
import '../cancle_confirm_button.dart';

class UserDetailCard extends StatefulWidget {
  const UserDetailCard({super.key});

  @override
  State<UserDetailCard> createState() => _UserDetailCardState();
}

class _UserDetailCardState extends State<UserDetailCard> {
  String userName = '';
  late TextEditingController _controller;
  bool _isEditing = false;
  String gender = 'หญิง';
  int birthYear = 2546;
  num height = 155.0;
  num weight = 50.5;
  String imageUrl = '';

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
    _controller = TextEditingController(text: userName);
  }

  void _loadUserProfile() {
    final profileBloc = context.read<ProfileBloc>();
    profileBloc.add(FetchUserProfile());
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  final RulerPickerController heightController =
      RulerPickerController(value: 155);
  final RulerPickerController weightController =
      RulerPickerController(value: 50.0);
  final List<String> _genderList = <String>[
    'ชาย',
    'หญิง',
  ];
  final List<int> yearList = List.generate(
    DateTime.now().year - 1900 + 1,
    (index) => 2440 + index,
  );

  Widget _buildScaleRecord(
    String title,
    String label,
    RulerPickerController controller,
    Function(num) onValueChanged,
  ) {
    return ScaleRecordWidget(
      title: title,
      titleStyle: Theme.of(context)
          .textTheme
          .titleLarge
          ?.copyWith(color: AppColors.blackColor, fontWeight: FontWeight.bold),
      titleAlign: MainAxisAlignment.center,
      label: label,
      initialValue: controller.value,
      controller: controller,
      onValueChanged: onValueChanged,
    );
  }

  void _submitLogs() {
    final profileBloc = BlocProvider.of<ProfileBloc>(context);

    // debugPrint('Sending gender: $gender');
    // debugPrint('Converted gender: ${gender == 'หญิง' ? false : true}');

    profileBloc.add(EditUserProfile(
      imageUrl: imageUrl,
      username: _isEditing ? (userName) : '',
      yearOfBirth: birthYear,
      gender: gender == 'หญิง' ? false : true,
      height: height,
      weight: weight,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ProfileBloc, ProfileState>(
      listener: (context, state) {
        if (state is ProfileLoaded) {
          setState(() {
            userName = state.userProfile.username;
            gender = state.userProfile.gender ? 'ชาย' : 'หญิง';
            birthYear = state.userProfile.yearOfBirth;
            height = state.userProfile.height;
            weight = state.userProfile.weight;
            imageUrl = state.userProfile.imageUrl;
          });
        }
      },
      child: BlocBuilder<ProfileBloc, ProfileState>(
        builder: (context, state) {
          return Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
                color: AppColors.whiteColor,
                borderRadius: BorderRadius.circular(12)),
            child: Column(
              children: [
                // Username Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        SizedBox(
                            width: 70,
                            child: Text(AppStrings.userNameText,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(fontWeight: FontWeight.bold))),
                      ],
                    ),
                    _isEditing
                        ? SizedBox(
                            width: 120,
                            child: TextField(
                              controller: _controller,
                              style: Theme.of(context).textTheme.bodyMedium,
                              decoration: const InputDecoration(
                                isDense: true,
                                contentPadding:
                                    EdgeInsets.symmetric(vertical: 0),
                              ),
                              onSubmitted: (value) {
                                setState(() {
                                  userName = value;
                                  _submitLogs();
                                  _isEditing = false;
                                });
                              },
                            ),
                          )
                        : GestureDetector(
                            onTap: () {
                              setState(() {
                                _isEditing = true;
                              });
                            },
                            child: Text(
                              userName.isEmpty
                                  ? AppStrings.clickToEditText
                                  : userName,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyMedium
                                  ?.copyWith(),
                            ),
                          ),
                  ],
                ),
                const SizedBox(height: 12),
                const Divider(color: Color(0xFFDFDFDF)),
                const SizedBox(height: 12),

                // Gender Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        SizedBox(
                            width: 70,
                            child: Text(AppStrings.genderText,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(fontWeight: FontWeight.bold))),
                        Text(gender,
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith())
                      ],
                    ),
                    GestureDetector(
                      onTap: () async {
                        int? result = await showModalBottomSheet<int>(
                            backgroundColor: AppColors.whiteColor,
                            context: context,
                            builder: (context) => Padding(
                                  padding: const EdgeInsets.symmetric(
                                      vertical: 24, horizontal: 20),
                                  child: Column(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Container(
                                        height: 3,
                                        width: 140,
                                        decoration: BoxDecoration(
                                          color: Colors.black,
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        margin:
                                            const EdgeInsets.only(bottom: 8),
                                      ),
                                      const SizedBox(height: 40),
                                      Text(AppStrings.genderText,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleLarge
                                              ?.copyWith(
                                                  fontWeight: FontWeight.bold)),
                                      Expanded(
                                        child: CupertinoPicker(
                                          backgroundColor: AppColors.whiteColor,
                                          itemExtent: 40,
                                          onSelectedItemChanged: (int index) {
                                            gender = _genderList[index];
                                          },
                                          children: _genderList
                                              .map((gender) => Center(
                                                    child: Text(
                                                      gender,
                                                      style: Theme.of(context)
                                                          .textTheme
                                                          .bodyMedium,
                                                    ),
                                                  ))
                                              .toList(),
                                        ),
                                      ),
                                      const SizedBox(height: 24),
                                      ConfirmCancelButtons(
                                        onConfirm: () {
                                          _submitLogs();
                                          Navigator.pop(context);
                                        },
                                        onCancel: () => setState(
                                            () => Navigator.pop(context)),
                                      ),
                                    ],
                                  ),
                                ));
                        setState(() {
                          gender = result != null ? result as String : gender;
                        });
                      },
                      child: const Icon(
                        Icons.navigate_next_rounded,
                        color: AppColors.greyColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Divider(color: Color(0xFFDFDFDF)),
                const SizedBox(height: 12),

                // Birth Year Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        SizedBox(
                            width: 70,
                            child: Text(AppStrings.birthYearText,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(fontWeight: FontWeight.bold))),
                        Text(birthYear.toString(),
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith())
                      ],
                    ),
                    GestureDetector(
                      onTap: () async {
                        int? result = await showModalBottomSheet<int>(
                            backgroundColor: AppColors.whiteColor,
                            context: context,
                            builder: (context) => Padding(
                                  padding: const EdgeInsets.symmetric(
                                      vertical: 24, horizontal: 20),
                                  child: Column(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Container(
                                        height: 3,
                                        width: 140,
                                        decoration: BoxDecoration(
                                          color: Colors.black,
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        margin:
                                            const EdgeInsets.only(bottom: 8),
                                      ),
                                      const SizedBox(height: 24),
                                      Text(AppStrings.birthYearText,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleLarge
                                              ?.copyWith(
                                                  fontWeight: FontWeight.bold)),
                                      Expanded(
                                        child: CupertinoPicker(
                                          backgroundColor: AppColors.whiteColor,
                                          itemExtent: 40,
                                          scrollController:
                                              FixedExtentScrollController(
                                            initialItem:
                                                DateTime.now().year - 1900,
                                          ),
                                          onSelectedItemChanged: (int index) {
                                            birthYear = yearList[index];
                                          },
                                          children: yearList
                                              .map((year) => Center(
                                                    child: Text(
                                                      year.toString(),
                                                      style: Theme.of(context)
                                                          .textTheme
                                                          .bodyMedium,
                                                    ),
                                                  ))
                                              .toList(),
                                        ),
                                      ),
                                      const SizedBox(height: 24),
                                      ConfirmCancelButtons(
                                        onConfirm: () {
                                          _submitLogs();
                                          Navigator.pop(context);
                                        },
                                        onCancel: () => setState(
                                            () => Navigator.pop(context)),
                                      ),
                                    ],
                                  ),
                                ));
                        setState(() {
                          birthYear = result ?? birthYear;
                        });
                      },
                      child: const Icon(
                        Icons.navigate_next_rounded,
                        color: AppColors.greyColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Divider(color: Color(0xFFDFDFDF)),
                const SizedBox(height: 12),

                // Weight Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        SizedBox(
                            width: 70,
                            child: Text(AppStrings.weightText,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(fontWeight: FontWeight.bold))),
                        Text('$weight ${AppStrings.kgText}',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith())
                      ],
                    ),
                    GestureDetector(
                      onTap: () async {
                        int? result = await showModalBottomSheet<int>(
                            backgroundColor: AppColors.whiteColor,
                            context: context,
                            isScrollControlled: true,
                            builder: (context) => Padding(
                                  padding: const EdgeInsets.symmetric(
                                      vertical: 24, horizontal: 20),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Container(
                                        height: 3,
                                        width: 140,
                                        decoration: BoxDecoration(
                                          color: Colors.black,
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        margin:
                                            const EdgeInsets.only(bottom: 8),
                                      ),
                                      const SizedBox(height: 24),
                                      _buildScaleRecord(
                                          AppStrings.weightText,
                                          AppStrings.kgText,
                                          weightController,
                                          (value) => weight = value),
                                      const SizedBox(height: 24),
                                      ConfirmCancelButtons(
                                        onConfirm: () {
                                          _submitLogs();
                                          Navigator.pop(context);
                                        },
                                        onCancel: () => setState(
                                            () => Navigator.pop(context)),
                                      ),
                                    ],
                                  ),
                                ));
                        setState(() {
                          weight = result != null ? result as num : weight;
                        });
                      },
                      child: const Icon(
                        Icons.navigate_next_rounded,
                        color: AppColors.greyColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Divider(color: Color(0xFFDFDFDF)),
                const SizedBox(height: 12),

                // Height Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        SizedBox(
                            width: 70,
                            child: Text(AppStrings.heightText,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(fontWeight: FontWeight.bold))),
                        Text('$height ${AppStrings.cmText}',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith())
                      ],
                    ),
                    GestureDetector(
                      onTap: () async {
                        int? result = await showModalBottomSheet<int>(
                            backgroundColor: AppColors.whiteColor,
                            context: context,
                            builder: (context) => Padding(
                                  padding: const EdgeInsets.symmetric(
                                      vertical: 24, horizontal: 20),
                                  child: Column(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Container(
                                        height: 3,
                                        width: 140,
                                        decoration: BoxDecoration(
                                          color: Colors.black,
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        margin:
                                            const EdgeInsets.only(bottom: 8),
                                      ),
                                      const SizedBox(height: 24),
                                      _buildScaleRecord(
                                          AppStrings.heightText,
                                          AppStrings.cmText,
                                          heightController,
                                          (value) => height = value),
                                      const SizedBox(height: 24),
                                      ConfirmCancelButtons(
                                        onConfirm: () {
                                          _submitLogs();
                                          Navigator.pop(context);
                                        },
                                        onCancel: () => setState(
                                            () => Navigator.pop(context)),
                                      ),
                                    ],
                                  ),
                                ));
                        setState(() {
                          height = result != null ? result as num : height;
                        });
                      },
                      child: const Icon(
                        Icons.navigate_next_rounded,
                        color: AppColors.greyColor,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
