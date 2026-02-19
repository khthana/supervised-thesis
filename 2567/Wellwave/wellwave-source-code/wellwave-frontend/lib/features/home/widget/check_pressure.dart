import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/custom_text_form_field.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';

class CheckPressure extends StatelessWidget {
  const CheckPressure({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        final diastolicBloodPressure = (state is HomeLoadedState)
            ? state.healthData?.diastolicBloodPressure?.toInt().toString() ??
                AppStrings.diastolicBloodPressureText
            : AppStrings.diastolicBloodPressureText;

        final systolicBloodPressure = (state is HomeLoadedState)
            ? state.healthData?.systolicBloodPressure?.toInt().toString() ??
                AppStrings.systolicBloodPressureText
            : AppStrings.systolicBloodPressureText;
        final formDataReassessment =
            (state is HomeLoadedState) ? state.formDataReassessment : {};

        return SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Text(AppStrings.pressureReAssessmentText,
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 72),
              Column(
                children: [
                  CustomTextFormFieldMD(
                    labelText: AppStrings.systolicBloodPressureText,
                    hintText: systolicBloodPressure,
                    suffixText: AppStrings.suffixMillimetersText,
                    keyboardType: TextInputType.number,
                    initialValue: formDataReassessment?['systolicBloodPressure']
                            ?.toString() ??
                        '',
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(3),
                    ],
                    onChanged: (value) {
                      context
                          .read<HomeBloc>()
                          .add(UpdateFieldData('systolicBloodPressure', value));
                    },
                  ),
                  const SizedBox(height: 64),
                  CustomTextFormFieldMD(
                    labelText: AppStrings.diastolicBloodPressureText,
                    hintText: diastolicBloodPressure,
                    suffixText: AppStrings.suffixMillimetersText,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(3),
                    ],
                    initialValue:
                        formDataReassessment?['diastolicBloodPressure']
                                ?.toString() ??
                            '',
                    onChanged: (value) {
                      context.read<HomeBloc>().add(
                          UpdateFieldData('diastolicBloodPressure', value));
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
