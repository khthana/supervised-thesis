import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/custom_text_form_field.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';

class CheckWeightAndWaist extends StatelessWidget {
  const CheckWeightAndWaist({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        final weightHint = (state is HomeLoadedState)
            ? state.profile?.weight.toInt().toString() ?? AppStrings.weightText
            : AppStrings.weightText;

        final waistLineHint = (state is HomeLoadedState)
            ? state.healthData?.waistLine?.toInt().toString() ??
                AppStrings.waistLineText
            : AppStrings.waistLineText;

        final formDataReassessment =
            (state is HomeLoadedState) ? state.formDataReassessment : {};

        return SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Text(AppStrings.weightAndWaistReAssessmentText,
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 72),
              Column(
                children: [
                  CustomTextFormFieldMD(
                    labelText: AppStrings.weightText,
                    hintText: weightHint,
                    suffixText: AppStrings.suffixkgText,
                    keyboardType: TextInputType.number,
                    initialValue:
                        formDataReassessment?['weight']?.toString() ?? '',
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(3),
                    ],
                    onChanged: (value) {
                      context
                          .read<HomeBloc>()
                          .add(UpdateFieldData('weight', value));
                    },
                  ),
                  const SizedBox(
                    height: 64,
                  ),
                  CustomTextFormFieldMD(
                    labelText: AppStrings.waistLineText,
                    hintText: waistLineHint,
                    suffixText: AppStrings.suffixcmText,
                    keyboardType: TextInputType.number,
                    initialValue:
                        formDataReassessment?['waistLine']?.toString() ?? '',
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(3),
                    ],
                    onChanged: (value) {
                      context
                          .read<HomeBloc>()
                          .add(UpdateFieldData('waistLine', value));
                    },
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
