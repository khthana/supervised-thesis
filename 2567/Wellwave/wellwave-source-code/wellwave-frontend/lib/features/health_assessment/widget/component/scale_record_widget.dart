import 'package:flutter/material.dart';
import 'package:flutter_ruler_picker/flutter_ruler_picker.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class ScaleRecordWidget extends StatefulWidget {
  final String label;
  final num initialValue;
  final RulerPickerController controller;
  final Function(num) onValueChanged;
  final int beginNum;
  final int endNum;
  final int scaleNum;

  const ScaleRecordWidget({
    Key? key,
    required this.label,
    required this.initialValue,
    required this.controller,
    required this.onValueChanged,
    required this.beginNum,
    required this.endNum,
    required this.scaleNum,
  }) : super(key: key);

  @override
  _ScaleRecordWidgetState createState() => _ScaleRecordWidgetState();
}

class _ScaleRecordWidgetState extends State<ScaleRecordWidget> {
  late int _currentValue;

  @override
  void initState() {
    super.initState();
    widget.controller.value = widget.initialValue.toDouble();
    _currentValue = widget.controller.value.toInt();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '$_currentValue',
              style: Theme.of(context).textTheme.titleXL?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(
              width: 8,
            ),
            Text(
              widget.label,
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: AppColors.greyColor,
                  ),
            ),
          ],
        ),
        RulerPicker(
          controller: widget.controller,
          onValueChanged: (value) {
            setState(() {
              _currentValue = value.toInt();
              widget.controller.value = value;
            });
            widget.onValueChanged(value);
          },
          ranges: [
            RulerRange(
              begin: widget.beginNum,
              end: widget.endNum,
              scale: widget.scaleNum.toDouble(),
            ),
          ],
          width: MediaQuery.of(context).size.width * 0.8,
          height: 80,
          rulerBackgroundColor: Colors.transparent,
          onBuildRulerScaleText: (index, value) {
            return value.toInt().toString();
          },
        ),
      ],
    );
  }
}
