import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_health_data_request_model.dart';
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_personal_data_request_model.dart';
import 'package:wellwave_frontend/features/health_assessment/data/repositories/health_assessment_repository.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/health_assessment_step/family_history_step.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/health_assessment_step/alcohol_step.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/health_assessment_step/goal_step.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/health_assessment_step/health_info_step.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/health_assessment_step/personal_info_step.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/health_assessment_step/smoke_step.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/result_and_goal_step/congrats_screen.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/result_and_goal_step/goal_exercise_screen.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/result_and_goal_step/goal_step_screen.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/result_and_goal_step/recommend_screen.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/result_and_goal_step/result_assessment.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/start_health_step.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/profile_repositories.dart';

import '../../../home/presentation/bloc/home_event.dart';
import '../../widget/health_assessment_step/add_pic_username_step.dart';
import '../bloc/health_assessment/health_assessment_bloc.dart';
import '../bloc/health_assessment/health_assessment_event.dart';
import '../bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../bloc/health_assessment_page/health_assessment_page_event.dart';
import '../bloc/health_assessment_page/health_assessment_page_state.dart';

class AssessmentScreen extends StatelessWidget {
  const AssessmentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => HealthAssessmentPageBloc(
          healthAssessmentRepository: HealthAssessmentRepository(),
          profileRepositories: ProfileRepositories()),
      child: const AssessmentScreenStart(),
    );
  }
}

class AssessmentScreenStart extends StatelessWidget {
  const AssessmentScreenStart({super.key});

  @override
  Widget build(BuildContext context) {
    return const StartHealthStep();
  }
}

class AssessmentScreenView extends StatelessWidget {
  const AssessmentScreenView({super.key});

  @override
  Widget build(BuildContext context) {
    final formKey = GlobalKey<FormState>();

    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        final modelHealthData = HealthAssessmentHealthDataRequestModel(
          diastolicBloodPressure:
              double.tryParse(state.formData['dbp']?.toString() ?? '') ?? 0.0,
          systolicBloodPressure:
              double.tryParse(state.formData['sbp']?.toString() ?? '') ?? 0.0,
          hdl: double.tryParse(state.formData['hdl']?.toString() ?? '') ?? 0.0,
          ldl: double.tryParse(state.formData['ldl']?.toString() ?? '') ?? 0.0,
          waistLine:
              double.tryParse(state.formData['waistline']?.toString() ?? '') ??
                  0.0,
          hypertension: state.riskHypertensionScore,
          diabetes: state.riskDiabetesScore,
          dyslipidemia: state.riskDyslipidemiaScore,
          obesity: state.riskObesityScore,
          hasSmoke: state.smokeChoose != 'ไม่สูบ',
          hasDrink: state.alcoholChoose == 'ไม่ดื่มแอลกอฮอลล์' ||
                  state.alcoholChoose == 'เคยดื่ม'
              ? false
              : true,
        );

        final modelPersonalData = HealthAssessmentPersonalDataRequestModel(
            imageUrl: state.formData['imageUrl'] ?? '',
            username: state.formData['username'] ?? '',
            yearOfBirth:
                int.tryParse(state.formData['birthYear']?.toString() ?? '') ??
                    0,
            gender: state.formData['gender'] == 'female' ? false : true,
            height:
                double.tryParse(state.formData['height']?.toString() ?? '') ??
                    0,
            weight:
                double.tryParse(state.formData['weight']?.toString() ?? '') ??
                    0,
            userGoalExTimeWeek: int.tryParse(
                    state.formData['userGoalExTimeWeek']?.toString() ?? '') ??
                0,
            userGoalStepWeek: int.tryParse(
                    state.formData['userGoalStepWeek']?.toString() ?? '') ??
                0,
            email: state.formData['email'] ?? '',
            userGoal: state.goalChoose == 'สร้างกล้ามเนื้อ'
                ? 0
                : state.goalChoose == 'สุขภาพดี'
                    ? 1
                    : state.goalChoose == 'ลดน้ำหนัก'
                        ? 2
                        : -1);

        return Scaffold(
          appBar: CustomAppBarWithStep(
            context: context,
            onLeading: (state.currentStep == 7 || state.currentStep == 11)
                ? false
                : true,
            totalSteps: 8,
            titleText: state.currentStep == 7 ? 'สรุปผลการประเมิน' : null,
            currentStep: state.currentStep,
            showStepIndicator: state.currentStep < 7,
            textColor: AppColors.blackColor,
            onBackPressed: () =>
                context.read<HealthAssessmentPageBloc>().add(StepBack()),
          ),
          body: Container(
            decoration: (state.currentStep >= 0 && state.currentStep <= 6)
                ? const BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage(AppImages.healthassessmentBG),
                      fit: BoxFit.cover,
                    ),
                  )
                : (state.currentStep >= 9 && state.currentStep <= 10)
                    ? const BoxDecoration(
                        image: DecorationImage(
                          image: AssetImage(AppImages.healthassessmentGoalBG),
                          fit: BoxFit.cover,
                        ),
                      )
                    : null,
            child: Column(
              children: [
                Expanded(
                  child: Form(
                    key: formKey,
                    child: StepContent(
                      currentStep: state.currentStep,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: (!((state.currentStep == 3 &&
                                  state.famhisChoose.isEmpty) ||
                              (state.currentStep == 4 &&
                                  state.alcoholChoose == null) ||
                              (state.currentStep == 5 &&
                                  state.smokeChoose == null) ||
                              (state.currentStep == 6 &&
                                  (state.goalChoose != 'สร้างกล้ามเนื้อ' &&
                                      state.goalChoose != 'สุขภาพดี' &&
                                      state.goalChoose != 'ลดน้ำหนัก'))) &&
                          state.currentStep != 11)
                      ? CustomButton(
                          width: 250,
                          bgColor: AppColors.primaryColor,
                          textColor: AppColors.whiteColor,
                          onPressed: () {
                            if (state.currentStep == 0) {
                              if (formKey.currentState!.validate()) {
                                context
                                    .read<HealthAssessmentPageBloc>()
                                    .add(StepContinue());
                              }
                            } else if (state.currentStep == 1) {
                              context
                                  .read<HealthAssessmentPageBloc>()
                                  .add(ValidateGender());

                              if (formKey.currentState!.validate() &&
                                  !state.genderError) {
                                context.read<HealthAssessmentBloc>().add(
                                    SubmitPersonalDataEvent(modelPersonalData));

                                context
                                    .read<HealthAssessmentPageBloc>()
                                    .add(StepContinue());
                              }
                            } else if (state.currentStep == 3) {
                              if (state.famhisChoose.isNotEmpty) {
                                context
                                    .read<HealthAssessmentPageBloc>()
                                    .add(StepContinue());
                              }
                            } else if (state.currentStep == 4) {
                              if (state.alcoholChoose != null) {
                                context
                                    .read<HealthAssessmentPageBloc>()
                                    .add(StepContinue());
                              }
                            } else if (state.currentStep == 5) {
                              if (state.smokeChoose != null) {
                                context
                                    .read<HealthAssessmentPageBloc>()
                                    .add(StepContinue());
                              }
                            } else if (state.currentStep == 6) {
                              if (state.goalChoose != null) {
                                context.read<HealthAssessmentBloc>().add(
                                    SubmitPersonalDataEvent(modelPersonalData));
                                context.read<HealthAssessmentBloc>().add(
                                    SubmitHealthDataEvent(modelHealthData));

                                context
                                    .read<HealthAssessmentPageBloc>()
                                    .add(StepContinue());
                              }
                            } else if (state.currentStep == 9) {
                              if (state.temporaryImageFile != null) {
                                context.read<HealthAssessmentPageBloc>().add(
                                      ImagePicked(state.temporaryImageFile!),
                                    );
                              }

                              context
                                  .read<HealthAssessmentPageBloc>()
                                  .add(StepContinue());
                            } else if (state.currentStep == 10) {
                              context.read<HealthAssessmentBloc>().add(
                                  SubmitPersonalDataEvent(modelPersonalData));
                              context
                                  .read<HealthAssessmentPageBloc>()
                                  .add(StepContinue());
                              context
                                  .read<HomeBloc>()
                                  .add(FetchHomeEvent(context));
                            } else {
                              context
                                  .read<HealthAssessmentPageBloc>()
                                  .add(StepContinue());
                            }
                          },
                          title:
                              state.currentStep == 10 ? 'เสร็จสิ้น' : 'ถัดไป',
                        )
                      : Container(),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class StepContent extends StatelessWidget {
  final int currentStep;

  const StepContent({super.key, required this.currentStep});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<HealthAssessmentPageBloc>().state;

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: () {
        switch (currentStep) {
          case 0:
            return AddPicUsernameStep();
          case 1:
            return const PersonalInfoStep();
          case 2:
            return const HealthInfoStep();
          case 3:
            return const FamilyHistoryStep();
          case 4:
            return const AlcoholStep();
          case 5:
            return const SmokeStep();
          case 6:
            return const GoalStep();
          case 7:
            return const ResultAssessment();
          case 8:
            return RecommendScreen();
          case 9:
            return GoalStepScreen();
          case 10:
            return GoalExerciseScreen();
          case 11:
            return const CongratsScreen();

          default:
            return const Center(child: Text('Unknown Step'));
        }
      }(),
    );
  }
}
