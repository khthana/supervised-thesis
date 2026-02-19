import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/config/constants/enums/risk_condition.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/component/risk_arc.dart';
import 'package:wellwave_frontend/features/health_assessment/widget/component/risk_card.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_state.dart';

class ResultAssessment extends StatelessWidget {
  const ResultAssessment({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HealthAssessmentPageBloc, HealthAssessmentPageState>(
      builder: (context, state) {
        double averageRiskScore = ((state.riskObesityScore / 1) +
                (state.riskDyslipidemiaScore / 4) +
                (state.riskHypertensionScore / 2) +
                (state.riskDiabetesScore / 16)) /
            4;

        return Scaffold(
          body: Column(
            children: [
              GaugeWidget(averageRiskScore: averageRiskScore),
              const SizedBox(height: 48),
              RiskCard(
                title: AppStrings.diabetesText,
                riskScore: state.riskDiabetesScore,
                getRiskTextMethod: RiskDiseaseCondition.getRiskText,
              ),
              const SizedBox(height: 16),
              RiskCard(
                title: AppStrings.hypertensionText,
                riskScore: state.riskHypertensionScore,
                getRiskTextMethod: RiskHypertensionCondition.getRiskText,
              ),
              const SizedBox(height: 16),
              RiskCard(
                title: AppStrings.hyperlipidemiaText,
                riskScore: state.riskDyslipidemiaScore,
                getRiskTextMethod: RiskDyslipidemiaCondition.getRiskText,
              ),
              const SizedBox(height: 16),
              RiskCard(
                title: AppStrings.obesityText,
                riskScore: state.riskObesityScore,
                getRiskTextMethod: RiskObesityCondition.getRiskText,
              ),
            ],
          ),
        );
      },
    );
  }
}
