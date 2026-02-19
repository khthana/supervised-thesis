import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/health_assessment/data/repositories/health_assessment_repository.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/profile_repositories.dart';
import '../../../../../config/constants/enums/risk_condition.dart';
import 'health_assessment_page_event.dart';
import 'health_assessment_page_state.dart';

class ValidateGender extends HealthAssessmentPageEvent {}

class HealthAssessmentPageBloc
    extends Bloc<HealthAssessmentPageEvent, HealthAssessmentPageState> {
  final HealthAssessmentRepository healthAssessmentRepository;
  final ProfileRepositories profileRepositories;
  final ScoreCalculator scoreCalculator = ScoreCalculator();

  HealthAssessmentPageBloc(
      {required this.healthAssessmentRepository,
      required this.profileRepositories})
      : super(const HealthAssessmentPageState(
          currentStep: 0,
          formData: {},
          selectedItems: [],
          isMultiSelect: false,
        )) {
    on<StepBack>((event, emit) {
      if (state.currentStep == 0) {
        emit(state.copyWith(showStartStep: true));
      } else {
        emit(state.copyWith(currentStep: state.currentStep - 1));
      }
    });

    on<UpdateField>(_onUpdateField);
    on<ValidateGender>(_onValidateGender);
    on<ToggleSelectionEvent>(_onToggleSelection);
    on<SetSelectionMode>(_onSetSelectionMode);
    on<StepContinue>((event, emit) {
      if (state.currentStep < 11) {
        emit(state.copyWith(currentStep: state.currentStep + 1));
      } else {
        emit(state.copyWith(isHealthAssessmentCompleted: true));
      }
    });

    on<ShowRecommendEvent>((event, emit) {
      emit(state.copyWith(showRecommendStep: true));
    });

    on<ImagePicked>(_onImagePicked);
    on<UpdateTemporaryImage>((event, emit) {
      emit(state.copyWith(temporaryImageFile: event.imageFile));
    });
  }

  Future<void> _onImagePicked(
    ImagePicked event,
    Emitter<HealthAssessmentPageState> emit,
  ) async {
    try {
      emit(state.copyWith(isLoading: true));

      debugPrint('Processing ImagePicked event');
      debugPrint('Image file path: ${event.imageFile.path}');

      final userProfile = await profileRepositories.getUSer();
      if (userProfile == null) {
        throw Exception('User profile not found');
      }

      debugPrint('Uploading image for UID: ${userProfile.uid}');
      final imagePath = await profileRepositories.uploadProfileImage(
        event.imageFile,
        userProfile.uid,
      );

      if (imagePath == null) {
        throw Exception('Failed to get image URL from server');
      }

      debugPrint('Successfully got image URL: $imagePath');

      // อัปเดต formData ด้วย path ใหม่
      final updatedFormData = Map<String, String>.from(state.formData);
      updatedFormData['imageUrl'] = imagePath;

      emit(state.copyWith(
        formData: updatedFormData,
        selectedImage: event.imageFile,
        isLoading: false,
      ));
    } catch (e, stackTrace) {
      debugPrint('Error in ImagePicked event handler: $e');
      debugPrint('Stack trace: $stackTrace');
      emit(state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to upload image: ${e.toString()}',
      ));
    }
  }

  void _onStepContinue(
      StepContinue event, Emitter<HealthAssessmentPageState> emit) {
    if (state.currentStep < 11) {
      emit(state.copyWith(currentStep: state.currentStep + 1));
    }
  }

  void _onStepBack(StepBack event, Emitter<HealthAssessmentPageState> emit) {
    if (state.currentStep > 0) {
      emit(state.copyWith(currentStep: state.currentStep - 1));
    }
  }

  void _onUpdateField(
      UpdateField event, Emitter<HealthAssessmentPageState> emit) {
    final updatedFormData = Map<String, String>.from(state.formData);

    updatedFormData[event.fieldName] = event.value;

    ScoreCalculator scoreCalculator = ScoreCalculator();
    RiskScores riskScores = scoreCalculator.calculateScore(
        updatedFormData, state.famhisChoose, state.goalChoose);

    emit(state.copyWith(
      formData: updatedFormData,
      riskDiabetesScore: riskScores.riskDiabetesScore,
      riskHypertensionScore: riskScores.riskHypertensionScore,
      riskDyslipidemiaScore: riskScores.riskDyslipidemiaScore,
      riskObesityScore: riskScores.riskObesityScore,
    ));
  }

  void _onUpdateRiskScore(
      UpdateRiskScoreEvent event, Emitter<HealthAssessmentPageState> emit) {
    int updatedDiabetesScore = state.riskDiabetesScore;
    int updatedHypertensionScore = state.riskHypertensionScore;
    int updatedDyslipidemiaScore = state.riskDyslipidemiaScore;
    int updatedObesityScore = state.riskObesityScore;

    switch (event.scoreType) {
      case 'diabetes':
        updatedDiabetesScore += event.scoreToAdd;
        break;
      case 'hypertension':
        updatedHypertensionScore += event.scoreToAdd;
        break;
      case 'dyslipidemia':
        updatedDyslipidemiaScore += event.scoreToAdd;
        break;
      case 'obesity':
        updatedObesityScore += event.scoreToAdd;
        break;
    }

    emit(state.copyWith(
      riskDiabetesScore: updatedDiabetesScore,
      riskHypertensionScore: updatedHypertensionScore,
      riskDyslipidemiaScore: updatedDyslipidemiaScore,
      riskObesityScore: updatedObesityScore,
    ));
  }

  void _onValidateGender(
      ValidateGender event, Emitter<HealthAssessmentPageState> emit) {
    final isGenderSelected = state.formData['gender'] != null;

    emit(state.copyWith(genderError: !isGenderSelected));
  }

  void _onToggleSelection(
      ToggleSelectionEvent event, Emitter<HealthAssessmentPageState> emit) {
    if (event.selectionType == 'famhis') {
      var updatedFamhisChoose = List<String>.from(state.famhisChoose);
      if (event.title == AppStrings.unknownDiseaseText) {
        updatedFamhisChoose = [AppStrings.unknownDiseaseText];
      } else {
        updatedFamhisChoose.remove(AppStrings.unknownDiseaseText);

        if (event.isMultiSelect) {
          if (updatedFamhisChoose.contains(event.title)) {
            updatedFamhisChoose.remove(event.title);
          } else {
            updatedFamhisChoose.add(event.title);
          }
        }
      }
      debugPrint('Updated famhisChoose: $updatedFamhisChoose');
      emit(state.copyWith(famhisChoose: updatedFamhisChoose));
    } else {
      if (event.selectionType == 'alcohol') {
        emit(state.copyWith(alcoholChoose: event.title));
      } else if (event.selectionType == 'goal') {
        debugPrint('Updated goalChoose: ${event.title}');
        emit(state.copyWith(goalChoose: event.title));
      } else if (event.selectionType == 'smoke') {
        emit(state.copyWith(smokeChoose: event.title));
      }
    }
  }

  void _onSetSelectionMode(
      SetSelectionMode event, Emitter<HealthAssessmentPageState> emit) {
    emit(state.copyWith(isMultiSelect: event.isMultiSelect));
  }
}

class ToggleSelectionEvent extends HealthAssessmentPageEvent {
  final String title;
  final bool isMultiSelect;
  final String selectionType;

  ToggleSelectionEvent(this.title, this.isMultiSelect, this.selectionType);

  @override
  List<Object> get props => [title, isMultiSelect, selectionType];
}

class SetSelectionMode extends HealthAssessmentPageEvent {
  final bool isMultiSelect;

  SetSelectionMode(this.isMultiSelect);

  @override
  List<Object> get props => [isMultiSelect];
}
