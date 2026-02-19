import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_health_data_request_model.dart';
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_personal_data_request_model.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';
import 'package:wellwave_frontend/features/home/widget/check_fat.dart';
import 'package:wellwave_frontend/features/home/widget/check_pressure.dart';
import 'package:wellwave_frontend/features/home/widget/check_weight_and_waist.dart';

class ReAssessmentScreen extends StatelessWidget {
  const ReAssessmentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final formKey = GlobalKey<FormState>();

    BlocProvider.of<HomeBloc>(context).add(ResetStep());

    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        bool isStep0Invalid = state.homeStep == 0 &&
            FormValidator.isStep0Invalid(state.formDataReassessment);
        bool isStep1Invalid = state.homeStep == 1 &&
            FormValidator.isStep1Invalid(state.formDataReassessment);

        if (state is HomeLoadedState) {
          return Scaffold(
            appBar: CustomAppBarWithStep(
              context: context,
              onLeading: state.homeStep != 0,
              totalSteps: 3,
              currentStep: state.homeStep,
              textColor: AppColors.blackColor,
              onBackPressed: () => context.read<HomeBloc>().add(PreviousStep()),
            ),
            body: Stack(
              children: [
                Positioned(
                  bottom: 0.0,
                  right: 0.0,
                  child: SvgPicture.asset(
                    AppImages.healthreassessmentBG,
                  ),
                ),
                Column(
                  children: [
                    Expanded(
                      child: Form(
                        key: formKey,
                        child: StepReAssessmentContent(
                            currentStep: state.homeStep),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Column(
                        children: [
                          CustomButton(
                            width: 250,
                            bgColor: isStep0Invalid || isStep1Invalid
                                ? AppColors.greyColor
                                : AppColors.primaryColor,
                            textColor: AppColors.whiteColor,
                            title: state.homeStep == 2 ? 'ยืนยัน' : 'ถัดไป',
                            onPressed: () {
                              if (FormValidator.isFormValid(
                                  state.homeStep, state.formDataReassessment)) {
                                context.read<HomeBloc>().add(NextStep());
                              }
                              if (state.homeStep == 2) {
                                if (formKey.currentState!.validate()) {
                                  final weight = double.tryParse(state
                                          .formDataReassessment?['weight']
                                          ?.toString() ??
                                      '');
                                  final diastolicBloodPressure =
                                      double.tryParse(state
                                              .formDataReassessment?[
                                                  'diastolicBloodPressure']
                                              ?.toString() ??
                                          '');
                                  final systolicBloodPressure = double.tryParse(
                                      state.formDataReassessment?[
                                                  'systolicBloodPressure']
                                              ?.toString() ??
                                          '');
                                  final hdl = double.tryParse(state
                                          .formDataReassessment?['hdl']
                                          ?.toString() ??
                                      '');
                                  final ldl = double.tryParse(state
                                          .formDataReassessment?['ldl']
                                          ?.toString() ??
                                      '');
                                  final waistLine = double.tryParse(state
                                          .formDataReassessment?['waistLine']
                                          ?.toString() ??
                                      '');

                                  if (weight != null && weight != 0) {
                                    final weightModel =
                                        HealthAssessmentPersonalDataRequestModel(
                                            weight: weight);
                                    context.read<HomeBloc>().add(
                                        SubmitWeightDataEvent(weightModel));
                                  }

                                  if (diastolicBloodPressure != null &&
                                          diastolicBloodPressure != 0 ||
                                      systolicBloodPressure != null &&
                                          systolicBloodPressure != 0 ||
                                      hdl != null && hdl != 0 ||
                                      ldl != null && ldl != 0 ||
                                      waistLine != null && waistLine != 0) {
                                    final healthDataModel =
                                        HealthAssessmentHealthDataRequestModel(
                                      diastolicBloodPressure:
                                          diastolicBloodPressure,
                                      systolicBloodPressure:
                                          systolicBloodPressure,
                                      hdl: hdl,
                                      ldl: ldl,
                                      waistLine: waistLine,
                                    );
                                    context.read<HomeBloc>().add(
                                        SubmitHealthDataHomeEvent(
                                            healthDataModel));
                                  }
                                }

                                context.goNamed(AppPages.homePage);
                              }
                            },
                          ),
                          const SizedBox(height: 4),
                          (state.homeStep == 0 || state.homeStep == 1)
                              ? CustomButton(
                                  width: 250,
                                  bgColor: AppColors.transparentColor,
                                  textColor: AppColors.darkerBlueColor,
                                  onPressed: () {
                                    context.read<HomeBloc>().add(NextStep());

                                    if (state.homeStep == 0) {
                                      state.formDataReassessment
                                          ?.remove('weight');
                                      state.formDataReassessment
                                          ?.remove('waistLine');
                                    }
                                    if (state.homeStep == 1) {
                                      state.formDataReassessment
                                          ?.remove('diastolicBloodPressure');
                                      state.formDataReassessment
                                          ?.remove('systolicBloodPressure');
                                    }
                                  },
                                  title: AppStrings.nextTimeFieldText,
                                )
                              : Container(
                                  height: 24,
                                ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        } else {
          return const Center(child: CircularProgressIndicator());
        }
      },
    );
  }
}

class StepReAssessmentContent extends StatelessWidget {
  final int currentStep;

  const StepReAssessmentContent({super.key, required this.currentStep});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: () {
        switch (currentStep) {
          case 0:
            return const CheckWeightAndWaist();
          case 1:
            return const CheckPressure();
          case 2:
            return const CheckFat();
          default:
            return const Center(child: Text('Unknown Step'));
        }
      }(),
    );
  }
}

class FormValidator {
  static bool isFieldEmpty(Map<String, dynamic>? formData, String field) {
    return formData?[field] == null || formData?[field] == '';
  }

  static bool isFieldValid(
      Map<String, dynamic>? formData, List<String> fields) {
    return fields
        .any((field) => formData?[field] != null && formData?[field] != '');
  }

  static bool isStep0Invalid(Map<String, dynamic>? formData) {
    return !['weight', 'waistLine']
        .any((field) => formData?[field] != null && formData?[field] != '');
  }

  static bool isStep1Invalid(Map<String, dynamic>? formData) {
    return !['diastolicBloodPressure', 'systolicBloodPressure']
        .any((field) => formData?[field] != null && formData?[field] != '');
  }

  static bool isStep0Valid(Map<String, dynamic>? formData) {
    return isFieldValid(formData, ['weight', 'waistLine']);
  }

  static bool isStep1Valid(Map<String, dynamic>? formData) {
    return isFieldValid(
        formData, ['diastolicBloodPressure', 'systolicBloodPressure']);
  }

  static bool isFormValid(int homeStep, Map<String, dynamic>? formData) {
    if (homeStep == 0) {
      return isStep0Valid(formData);
    } else if (homeStep == 1) {
      return isStep1Valid(formData);
    }
    return false;
  }
}
