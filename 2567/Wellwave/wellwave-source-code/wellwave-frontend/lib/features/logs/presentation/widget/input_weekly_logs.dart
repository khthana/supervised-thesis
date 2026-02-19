import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_ruler_picker/flutter_ruler_picker.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/logs/presentation/bloc/logs_bloc.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/scale_record_widget.dart';

class InputWeeklyLogs extends StatefulWidget {
  const InputWeeklyLogs({super.key});

  @override
  _InputWeeklyLogsState createState() => _InputWeeklyLogsState();
}

class _InputWeeklyLogsState extends State<InputWeeklyLogs> {
  bool isRecordHDL = true;
  bool isRecordLDL = true;
  int currentStep = 0;
  final RulerPickerController weightController =
      RulerPickerController(value: 50.5);
  final RulerPickerController waistLineController =
      RulerPickerController(value: 65.4);
  final RulerPickerController hdlController =
      RulerPickerController(value: 65.0);
  final RulerPickerController ldlController =
      RulerPickerController(value: 165.0);

  num weight = 50.5, waistLine = 65.4, hdl = 65.0, ldl = 165.0;
  // int selectedMood = 4;
  DateTime selectedDate = DateTime.now();

  // final List<String> moodIconsGrey = [
  //   AppImages.verySadGreyIcon,
  //   AppImages.sadGreyIcon,
  //   AppImages.neutralGreyIcon,
  //   AppImages.happyGreyIcon,
  //   AppImages.veryHappyGreyIcon
  // ];

  // final List<String> moodIconsColor = [
  //   AppImages.verySadColorIcon,
  //   AppImages.sadColorIcon,
  //   AppImages.neutralColorIcon,
  //   AppImages.happyColorIcon,
  //   AppImages.veryHappyColorIcon
  // ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            height: 3,
            width: 140,
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.only(bottom: 8),
          ),
          const SizedBox(height: 40),
          _buildDialogTitle(),
          _buildStepContent(),
          const SizedBox(
            height: 24,
          ),
          _buildDialogActions(),
        ],
      ),
    );
  }

  Widget _buildDialogTitle() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              currentStep < 4
                  ? '${AppStrings.stepNumber} ${currentStep + 1}/4'
                  : '',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: AppColors.blackColor, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            if (currentStep == 2 || currentStep == 3) _buildSkipButton(),
          ],
        ),
      ],
    );
  }

  Widget _buildSkipButton() {
    return TextButton(
      onPressed: () {
        setState(() {
          if (currentStep == 2) {
            isRecordHDL = false;
          }

          if (currentStep == 3) {
            isRecordLDL = false;
          }

          currentStep++;
        });
      },
      child: Text(
        AppStrings.skipText,
        style: Theme.of(context)
            .textTheme
            .bodySmall
            ?.copyWith(color: AppColors.greyColor),
      ),
    );
  }

  Widget _buildStepContent() {
    switch (currentStep) {
      case 0:
        return _buildScaleRecord(AppStrings.weightRecordText, AppStrings.kgText,
            weightController, (value) => weight = value);
      case 1:
        return _buildScaleRecord(
            AppStrings.waistLineRecordText,
            AppStrings.cmText,
            waistLineController,
            (value) => waistLine = value);
      case 2:
        return _buildScaleRecord(AppStrings.hdlRecordText,
            AppStrings.mgPerDlText, hdlController, (value) => hdl = value);
      case 3:
        return _buildScaleRecord(AppStrings.ldlRecordText,
            AppStrings.mgPerDlText, ldlController, (value) => ldl = value);
      // case 4:
      //   return _buildMoodSelection();
      case 4:
        return _buildCompletionStep();
      default:
        return Container();
    }
  }

  Widget _buildScaleRecord(String title, String label,
      RulerPickerController controller, Function(num) onValueChanged) {
    return ScaleRecordWidget(
      title: title,
      label: label,
      initialValue: controller.value,
      controller: controller,
      onValueChanged: onValueChanged,
    );
  }

  // Widget _buildMoodSelection() {
  //   return Column(
  //     mainAxisSize: MainAxisSize.min,
  //     children: [
  //       const Align(
  //         alignment: Alignment.centerLeft,
  //         child: Text(
  //           AppStrings.chooseMoodsText,
  //         ),
  //       ),
  //       const SizedBox(height: 48),
  //       Row(
  //         mainAxisAlignment: MainAxisAlignment.spaceBetween,
  //         children: List.generate(moodIconsGrey.length, (index) {
  //           return GestureDetector(
  //             onTap: () => setState(() => selectedMood = index),
  //             child: SvgPicture.asset(
  //               selectedMood == index
  //                   ? moodIconsColor[index]
  //                   : moodIconsGrey[index],
  //               width: 70,
  //               height: 70,
  //             ),
  //           );
  //         }),
  //       ),
  //       const SizedBox(height: 48),
  //     ],
  //   );
  // }

  Widget _buildCompletionStep() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SvgPicture.asset(AppImages.completeIcon, width: 80, height: 80),
        const SizedBox(height: 24),
        Text(AppStrings.dataRecordingCompletedText,
            style: Theme.of(context).textTheme.labelLarge),
      ],
    );
  }

  Widget _buildDialogActions() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: currentStep < 4
          ? [_buildBackButton(), const SizedBox(width: 10), _buildNextButton()]
          : [_buildCompleteButton()],
    );
  }

  Widget _buildBackButton() {
    return currentStep > 0
        ? Expanded(
            child: SizedBox(
              width: 170,
              height: 60,
              child: TextButton(
                onPressed: () => setState(() => currentStep--),
                style: ButtonStyle(
                  shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.0),
                      side: const BorderSide(
                          color: AppColors.primaryColor, width: 1),
                    ),
                  ),
                ),
                child: Text(AppStrings.backText,
                    style: Theme.of(context)
                        .textTheme
                        .bodyMedium
                        ?.copyWith(color: AppColors.primaryColor)),
              ),
            ),
          )
        : const SizedBox.shrink();
  }

  Widget _buildNextButton() {
    return Expanded(
      child: SizedBox(
        width: 170,
        height: 60,
        child: TextButton(
          onPressed: () {
            setState(() {
              _updateStepValues();
              currentStep++;
            });
          },
          style: ButtonStyle(
            backgroundColor:
                WidgetStateProperty.all<Color>(AppColors.primaryColor),
            shape: WidgetStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
          ),
          child: Text(AppStrings.nextText,
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(color: Colors.white)),
        ),
      ),
    );
  }

  Widget _buildCompleteButton() {
    return Expanded(
      child: SizedBox(
        height: 60,
        child: TextButton(
          onPressed: _submitLogs,
          style: ButtonStyle(
            backgroundColor:
                WidgetStateProperty.all<Color>(AppColors.primaryColor),
            shape: WidgetStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
          ),
          child: Text(AppStrings.completedText,
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(color: Colors.white)),
        ),
      ),
    );
  }

  void _updateStepValues() {
    switch (currentStep) {
      case 0:
        weight = weightController.value;
        break;
      case 1:
        waistLine = waistLineController.value;
        break;
      case 2:
        hdl = hdlController.value;
        break;
      case 3:
        ldl = ldlController.value;
        break;
    }
  }

  void _submitLogs() {
    final logsBloc = BlocProvider.of<LogsBloc>(context);

    String formattedDate = DateFormat('yyyy-MM-dd').format(selectedDate);

    final logEvents = [
      SubmitLogEvent(
        logName: AppStrings.weightLogText,
        value: weight.toInt(),
        selectedDate: formattedDate,
      ),
      SubmitLogEvent(
        logName: AppStrings.waistLineLogText,
        value: waistLine.toInt(),
        selectedDate: formattedDate,
      ),
      if (isRecordHDL)
        SubmitLogEvent(
          logName: AppStrings.hdlLogText,
          value: hdl.toInt(),
          selectedDate: formattedDate,
        ),
      if (isRecordLDL)
        SubmitLogEvent(
          logName: AppStrings.ldlLogText,
          value: ldl.toInt(),
          selectedDate: formattedDate,
        ),
    ];

    context.read<LogsBloc>().add(LogsFetchedGraph(DateTime.now()));

    for (var event in logEvents) {
      logsBloc.add(event);
    }

    Navigator.pop(context);
  }
}
