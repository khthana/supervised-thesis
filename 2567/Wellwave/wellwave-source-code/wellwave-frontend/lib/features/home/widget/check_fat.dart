import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/common/widget/custom_text_form_field.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';

class CheckFat extends StatelessWidget {
  const CheckFat({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        final hdl = (state is HomeLoadedState)
            ? state.healthData?.hdl?.toInt().toString() ?? AppStrings.hdlText
            : AppStrings.hdlText;

        final ldl = (state is HomeLoadedState)
            ? state.healthData?.ldl?.toInt().toString() ?? AppStrings.ldlText
            : AppStrings.ldlText;
        final formDataReassessment =
            (state is HomeLoadedState) ? state.formDataReassessment : {};

        return SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Text(AppStrings.fatReAssessmentText,
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 72),
              Column(
                children: [
                  CustomTextFormFieldMD(
                    labelText: AppStrings.ldlReText,
                    hintText: ldl.toString(),
                    suffixText: AppStrings.suffixmgPerdLText,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(3),
                    ],
                    initialValue:
                        formDataReassessment?['ldl']?.toString() ?? '',
                    onChanged: (value) {
                      context
                          .read<HomeBloc>()
                          .add(UpdateFieldData('ldl', value));
                    },
                  ),
                  const SizedBox(height: 64),
                  CustomTextFormFieldMD(
                    labelText: AppStrings.hdlReText,
                    hintText: hdl.toString(),
                    suffixText: AppStrings.suffixmgPerdLText,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(3),
                    ],
                    initialValue:
                        formDataReassessment?['hdl']?.toString() ?? '',
                    onChanged: (value) {
                      context
                          .read<HomeBloc>()
                          .add(UpdateFieldData('hdl', value));
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
