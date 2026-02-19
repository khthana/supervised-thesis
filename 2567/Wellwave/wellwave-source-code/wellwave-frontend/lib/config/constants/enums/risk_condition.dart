import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

class RiskScores {
  final int riskDiabetesScore;
  final int riskHypertensionScore;
  final int riskDyslipidemiaScore;
  final int riskObesityScore;

  RiskScores({
    required this.riskDiabetesScore,
    required this.riskHypertensionScore,
    required this.riskDyslipidemiaScore,
    required this.riskObesityScore,
  });
}

class ScoreCalculator {
  RiskScores calculateScore(Map<String, dynamic> formData,
      List<String>? famhisChoose, String? goalChoose) {
    int riskDiabetesScore = 0;
    int riskHypertensionScore = 0;
    int riskDyslipidemiaScore = 0;
    int riskObesityScore = 0;

    if (formData['gender'] == 'male') {
      riskDiabetesScore += 2;
    }

    if (formData['birthYear'] != null) {
      int birthYear = int.tryParse(formData['birthYear']) ?? 0;
      int currentYear = DateTime.now().year + 543;
      int age = currentYear - birthYear;

      if (age >= 45 && age <= 49) {
        riskDiabetesScore += 1;
      } else if (age >= 50) {
        riskDiabetesScore += 2;
      }
    }

    if (formData['height'] != null && formData['weight'] != null) {
      double heightInMeters = (int.tryParse(formData['height']) ?? 0) / 100;
      double weightInKg = double.tryParse(formData['weight']) ?? 0;

      if (heightInMeters > 0) {
        double bmi = weightInKg / (heightInMeters * heightInMeters);

        if (bmi >= 23 && bmi <= 27.5) {
          riskDiabetesScore += 3;
        } else if (bmi > 27.5) {
          riskDiabetesScore += 5;
        }
      }
    }

    if (famhisChoose != null && famhisChoose.contains('โรคเบาหวาน')) {
      riskDiabetesScore += 4;
    }

    if (formData['waist'] != null) {
      double waistInCm = double.tryParse(formData['waist']) ?? 0;

      if (formData['gender'] == 'male' && waistInCm >= 90) {
        riskDiabetesScore += 1;
        riskObesityScore += 1;
      } else if (formData['gender'] == 'female' && waistInCm >= 80) {
        riskDiabetesScore += 1;
        riskObesityScore += 1;
      }
    }

    if (formData['sbp'] != null) {
      double bloodPressure = double.tryParse(formData['sbp']) ?? 0;

      if (bloodPressure >= 140) {
        riskDiabetesScore += 2;
        riskHypertensionScore += 2;
      }
    }

    if (formData['hdl'] != null) {
      double HDL = double.tryParse(formData['hdl']) ?? 0;

      if (HDL <= 60) {
        riskDyslipidemiaScore += 2;
      }
    }

    if (formData['ldl'] != null) {
      double LDL = double.tryParse(formData['ldl']) ?? 0;

      if (LDL >= 130 && LDL <= 159) {
        riskDyslipidemiaScore += 2;
      } else if (LDL >= 160 && LDL <= 189) {
        riskDyslipidemiaScore += 4;
      }
    }

    return RiskScores(
      riskDiabetesScore: riskDiabetesScore,
      riskHypertensionScore: riskHypertensionScore,
      riskDyslipidemiaScore: riskDyslipidemiaScore,
      riskObesityScore: riskObesityScore,
    );
  }
}

class RiskDiseaseCondition {
  static Map<String, dynamic> getRiskText(int riskDiabetesScore) {
    if (riskDiabetesScore <= 2) {
      return {
        'text': AppStrings.lowRiskText,
        'color': AppColors.greenLevelTextColor,
      };
    } else if (riskDiabetesScore >= 3 && riskDiabetesScore <= 5) {
      return {
        'text': AppStrings.moderateRiskText,
        'color': AppColors.yellowLevelTextColor,
      };
    } else if (riskDiabetesScore >= 6 && riskDiabetesScore <= 8) {
      return {
        'text': AppStrings.highRiskText,
        'color': AppColors.orangeLevelTextColor,
      };
    } else {
      return {
        'text': AppStrings.veryHighRiskText,
        'color': AppColors.redLevelTextColor,
      };
    }
  }
}

class RiskHypertensionCondition {
  static Map<String, dynamic> getRiskText(int riskHypertensionScore) {
    if (riskHypertensionScore == 0) {
      return {
        'text': AppStrings.lowRiskText,
        'color': AppColors.greenLevelTextColor,
      };
    } else {
      return {
        'text': AppStrings.riskText,
        'color': AppColors.redLevelTextColor,
      };
    }
  }
}

class RiskDyslipidemiaCondition {
  static Map<String, dynamic> getRiskText(int riskDyslipidemiaScore) {
    if (riskDyslipidemiaScore == 0) {
      return {
        'text': AppStrings.lowRiskText,
        'color': AppColors.greenLevelTextColor,
      };
    } else {
      return {
        'text': AppStrings.riskText,
        'color': AppColors.redLevelTextColor,
      };
    }
  }
}

class RiskObesityCondition {
  static Map<String, dynamic> getRiskText(int riskObesityScore) {
    if (riskObesityScore == 0) {
      return {
        'text': AppStrings.lowRiskText,
        'color': AppColors.greenLevelTextColor,
      };
    } else if (riskObesityScore == 2) {
      return {
        'text': AppStrings.moderateRiskText,
        'color': AppColors.yellowLevelTextColor,
      };
    } else {
      return {
        'text': AppStrings.riskText,
        'color': AppColors.redLevelTextColor,
      };
    }
  }
}

class RiskTextCondition {
  static Map<String, dynamic> getRiskTextFromAverage(double averageRiskScore) {
    debugPrint('averageRiskScore: $averageRiskScore');
    if (averageRiskScore > 0.8) {
      return {
        'text': AppStrings.riskText,
        'color': AppColors.redLevelTextColor,
      };
    } else if (averageRiskScore > 0.6) {
      return {
        'text': AppStrings.highRiskText,
        'color': AppColors.orangeLevelTextColor,
      };
    } else if (averageRiskScore > 0.4) {
      return {
        'text': AppStrings.moderateRiskText,
        'color': AppColors.yellowLevelTextColor,
      };
    } else {
      return {
        'text': AppStrings.lowRiskText,
        'color': AppColors.greenLevelTextColor,
      };
    }
  }
}
