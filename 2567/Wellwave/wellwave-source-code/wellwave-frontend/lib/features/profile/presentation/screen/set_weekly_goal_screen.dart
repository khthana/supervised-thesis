import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_bloc.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_event.dart';
import 'package:wellwave_frontend/features/profile/presentation/bloc/profile_bloc/profile_state.dart';

import '../../../../common/widget/app_bar.dart';
import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_images.dart';
import '../../../../config/constants/app_strings.dart';

class SetWeeklyGoalScreen extends StatefulWidget {
  const SetWeeklyGoalScreen({super.key});

  @override
  State<SetWeeklyGoalScreen> createState() => _SetWeeklyGoalScreenState();
}

class _SetWeeklyGoalScreenState extends State<SetWeeklyGoalScreen> {
  int stepPerWeek = 0;
  int exercisePerWeek = 0;
  bool _isStepEditing = false;
  bool _isExerciseEditing = false;
  late TextEditingController _stepController;
  late TextEditingController _exerciseController;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
    _stepController = TextEditingController(text: stepPerWeek.toString());
    _exerciseController =
        TextEditingController(text: exercisePerWeek.toString());
  }

  void _loadUserProfile() {
    final profileBloc = context.read<ProfileBloc>();
    profileBloc.add(FetchUserProfile());
  }

  @override
  void dispose() {
    _stepController.dispose();
    _exerciseController.dispose();
    super.dispose();
  }

  void _submitLogs() {
    final profileBloc = BlocProvider.of<ProfileBloc>(context);
    profileBloc.add(EditUserGoalPerWeek(
        stepPerWeek: stepPerWeek, exercisePerWeek: exercisePerWeek));
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ProfileBloc, ProfileState>(
      listener: (context, state) {
        if (state is ProfileLoaded) {
          setState(() {
            stepPerWeek = state.userProfile.stepPerWeek!;
            exercisePerWeek = state.userProfile.exercisePerWeek!;
          });
        }
      },
      child: BlocBuilder<ProfileBloc, ProfileState>(
        builder: (context, state) {
          return Scaffold(
              backgroundColor: AppColors.backgroundColor,
              appBar: CustomAppBar(
                  title: AppStrings.goalText,
                  context: context,
                  onLeading: true),
              body: SingleChildScrollView(
                child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 36),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            SvgPicture.asset(AppImages.fireGoalIcon,
                                height: 21),
                            const SizedBox(width: 8),
                            Text(
                              AppStrings.goalAmountText,
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineMedium
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            )
                          ],
                        ),
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 27),
                          decoration: BoxDecoration(
                              color: AppColors.whiteColor,
                              borderRadius: BorderRadius.circular(16)),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Text(AppStrings.stepPerWeekText,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium
                                              ?.copyWith())
                                    ],
                                  ),
                                  Row(
                                    children: [
                                      _isStepEditing
                                          ? SizedBox(
                                              width: 75,
                                              child: TextField(
                                                controller: _stepController,
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .bodyMedium,
                                                decoration:
                                                    const InputDecoration(
                                                  isDense: true,
                                                  contentPadding:
                                                      EdgeInsets.symmetric(
                                                          vertical: 0),
                                                ),
                                                onSubmitted: (value) {
                                                  setState(() {
                                                    stepPerWeek =
                                                        int.tryParse(value) ??
                                                            0;
                                                    _isStepEditing = false;
                                                    _submitLogs();
                                                  });
                                                },
                                              ),
                                            )
                                          : GestureDetector(
                                              onTap: () {
                                                setState(() {
                                                  _isStepEditing = true;
                                                });
                                              },
                                              child: Text(
                                                stepPerWeek == 0
                                                    ? AppStrings.clickToEditText
                                                    : stepPerWeek.toString(),
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .bodyMedium
                                                    ?.copyWith(),
                                              ),
                                            ),
                                      const SizedBox(width: 8),
                                      Text(AppStrings.stepText,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium
                                              ?.copyWith(
                                                  color: AppColors.greyColor)),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 38),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Text(AppStrings.exercisePerWeekText,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium
                                              ?.copyWith())
                                    ],
                                  ),
                                  Row(
                                    children: [
                                      _isExerciseEditing
                                          ? SizedBox(
                                              width: 75,
                                              child: TextField(
                                                controller: _exerciseController,
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .bodyMedium,
                                                decoration:
                                                    const InputDecoration(
                                                  isDense: true,
                                                  contentPadding:
                                                      EdgeInsets.symmetric(
                                                          vertical: 0),
                                                ),
                                                onSubmitted: (value) {
                                                  setState(() {
                                                    exercisePerWeek =
                                                        int.tryParse(value) ??
                                                            0;
                                                    _isExerciseEditing = false;
                                                    _submitLogs();
                                                  });
                                                },
                                              ),
                                            )
                                          : GestureDetector(
                                              onTap: () {
                                                setState(() {
                                                  _isExerciseEditing = true;
                                                });
                                              },
                                              child: Text(
                                                exercisePerWeek == 0
                                                    ? AppStrings.clickToEditText
                                                    : exercisePerWeek
                                                        .toString(),
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .bodyMedium
                                                    ?.copyWith(),
                                              ),
                                            ),
                                      const SizedBox(width: 8),
                                      Text(AppStrings.minuteText,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium
                                              ?.copyWith(
                                                  color: AppColors.greyColor)),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    )),
              ));
        },
      ),
    );
  }
}
