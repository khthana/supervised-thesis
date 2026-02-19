import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/custom_text_form_field.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';

import '../../presentation/bloc/health_assessment_page/health_assessment_page_bloc.dart';
import '../../presentation/bloc/health_assessment_page/health_assessment_page_event.dart';

class HealthInfoStep extends StatelessWidget {
  const HealthInfoStep({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final state = context.watch<HealthAssessmentPageBloc>().state;
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Text(
            AppStrings.healthDataText,
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(
            height: 12,
          ),
          Text(
            AppStrings.ifYouKnowText,
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(
            height: 48,
          ),
          CustomTextFormField(
            labelText: AppStrings.systolicBloodPressureText,
            hintText: AppStrings.systolicBloodPressureText,
            suffixText: AppStrings.suffixMillimetersText,
            keyboardType: TextInputType.number,
            initialValue: state.formData['sbp'] ?? '',
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(3),
            ],
            onChanged: (value) => context
                .read<HealthAssessmentPageBloc>()
                .add(UpdateField('sbp', value)),
          ),
          const SizedBox(
            height: 24,
          ),
          CustomTextFormField(
            labelText: AppStrings.diastolicBloodPressureText,
            hintText: AppStrings.diastolicBloodPressureText,
            suffixText: AppStrings.suffixMillimetersText,
            keyboardType: TextInputType.number,
            initialValue: state.formData['dbp'] ?? '',
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(3),
            ],
            onChanged: (value) => context
                .read<HealthAssessmentPageBloc>()
                .add(UpdateField('dbp', value)),
          ),
          const SizedBox(
            height: 24,
          ),
          CustomTextFormField(
            labelText: AppStrings.hdlReText,
            hintText: AppStrings.hdlReText,
            suffixText: AppStrings.suffixmgPerdLText,
            keyboardType: TextInputType.number,
            initialValue: state.formData['hdl'] ?? '',
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(3),
            ],
            onChanged: (value) => context
                .read<HealthAssessmentPageBloc>()
                .add(UpdateField('hdl', value)),
          ),
          const SizedBox(
            height: 24,
          ),
          CustomTextFormField(
            labelText: AppStrings.ldlReText,
            hintText: AppStrings.ldlReText,
            suffixText: AppStrings.suffixmgPerdLText,
            keyboardType: TextInputType.number,
            initialValue: state.formData['ldl'] ?? '',
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(3),
            ],
            onChanged: (value) => context
                .read<HealthAssessmentPageBloc>()
                .add(UpdateField('ldl', value)),
          ),
          const SizedBox(
            height: 24,
          ),
          CustomTextFormField(
            labelText: AppStrings.waistLineText,
            hintText: AppStrings.waistLineText,
            suffixText: AppStrings.suffixcmText,
            keyboardType: TextInputType.number,
            initialValue: state.formData['waist'] ?? '',
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(3),
            ],
            onChanged: (value) => context
                .read<HealthAssessmentPageBloc>()
                .add(UpdateField('waistline', value)),
          ),
        ],
      ),
    );
  }
}
