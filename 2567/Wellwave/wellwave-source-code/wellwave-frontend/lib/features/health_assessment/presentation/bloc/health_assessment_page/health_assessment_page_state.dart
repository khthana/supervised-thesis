import 'package:equatable/equatable.dart';
import 'dart:io';

class HealthAssessmentPageState extends Equatable {
  final int currentStep;
  final Map<String, String> formData;
  final bool genderError;
  final File? selectedImage;
  final List<String> selectedItems;
  final bool isMultiSelect;
  final String? alcoholChoose;
  final String? smokeChoose;
  final String? goalChoose;
  final List<String> famhisChoose;
  final bool isResultCompleted;
  final bool showStartStep;
  final bool showRecommendStep;
  final int riskDiabetesScore;
  final int riskHypertensionScore;
  final int riskDyslipidemiaScore;
  final int riskObesityScore;
  final int? recommendGoalStep;
  final int? recommendExStep;

  final String? errorMessage;
  final File? temporaryImageFile;

  const HealthAssessmentPageState({
    required this.currentStep,
    required this.formData,
    this.genderError = false,
    this.selectedImage,
    this.selectedItems = const [],
    this.isMultiSelect = false,
    this.alcoholChoose,
    this.smokeChoose,
    this.goalChoose,
    this.famhisChoose = const [],
    this.isResultCompleted = false,
    this.showStartStep = false,
    this.showRecommendStep = false,
    this.riskDiabetesScore = 0,
    this.riskHypertensionScore = 0,
    this.riskDyslipidemiaScore = 0,
    this.riskObesityScore = 0,
    this.recommendGoalStep,
    this.recommendExStep,
    this.errorMessage,
    this.temporaryImageFile,
  });

  HealthAssessmentPageState copyWith({
    int? currentStep,
    Map<String, String>? formData,
    bool? genderError,
    File? selectedImage,
    List<String>? selectedItems,
    bool? isMultiSelect,
    String? alcoholChoose,
    String? smokeChoose,
    String? goalChoose,
    List<String>? famhisChoose,
    bool? isHealthAssessmentCompleted,
    bool? isResultCompleted,
    bool? showHealthConnect,
    bool? showRecommend,
    bool? showGoalStep,
    bool? showRecommendStep,
    bool? ShowGoalExercise,
    bool? showFinish,
    bool? showStartStep,
    int? riskDiabetesScore,
    int? riskHypertensionScore,
    int? riskDyslipidemiaScore,
    int? riskObesityScore,
    bool? isLoading,
    String? errorMessage,
    int? recommendGoalStep,
    int? recommendExStep,
    File? temporaryImageFile,
  }) {
    return HealthAssessmentPageState(
      currentStep: currentStep ?? this.currentStep,
      formData: formData ?? this.formData,
      genderError: genderError ?? this.genderError,
      selectedImage: selectedImage ?? this.selectedImage,
      selectedItems: selectedItems ?? this.selectedItems,
      isMultiSelect: isMultiSelect ?? this.isMultiSelect,
      alcoholChoose: alcoholChoose ?? this.alcoholChoose,
      smokeChoose: smokeChoose ?? this.smokeChoose,
      goalChoose: goalChoose ?? this.goalChoose,
      famhisChoose: famhisChoose ?? this.famhisChoose,
      isResultCompleted: isResultCompleted ?? this.isResultCompleted,
      showStartStep: showStartStep ?? this.showStartStep,
      showRecommendStep: showRecommendStep ?? this.showRecommendStep,
      riskDiabetesScore: riskDiabetesScore ?? this.riskDiabetesScore,
      riskHypertensionScore:
          riskHypertensionScore ?? this.riskHypertensionScore,
      riskDyslipidemiaScore:
          riskDyslipidemiaScore ?? this.riskDyslipidemiaScore,
      riskObesityScore: riskObesityScore ?? this.riskObesityScore,
      recommendGoalStep: recommendGoalStep ?? this.recommendGoalStep,
      recommendExStep: recommendExStep ?? this.recommendExStep,
      errorMessage: errorMessage ?? this.errorMessage,
      temporaryImageFile: temporaryImageFile ?? this.temporaryImageFile,
    );
  }

  @override
  List<Object?> get props => [
        currentStep,
        formData,
        genderError,
        selectedImage,
        selectedItems,
        isMultiSelect,
        alcoholChoose,
        smokeChoose,
        goalChoose,
        famhisChoose,
        isResultCompleted,
        showStartStep,
        showRecommendStep,
        riskDiabetesScore,
        riskHypertensionScore,
        riskDyslipidemiaScore,
        riskObesityScore,
        errorMessage,
        recommendGoalStep,
        recommendExStep,
        temporaryImageFile
      ];
}
