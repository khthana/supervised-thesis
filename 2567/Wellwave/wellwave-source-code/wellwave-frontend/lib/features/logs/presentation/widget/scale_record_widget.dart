import 'package:flutter/material.dart';
import 'package:flutter_ruler_picker/flutter_ruler_picker.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class ScaleRecordWidget extends StatefulWidget {
  final String title;
  final String label;
  final num initialValue;
  final RulerPickerController controller;
  final Function(num) onValueChanged;
  final TextStyle? titleStyle;
  final MainAxisAlignment? titleAlign;

  const ScaleRecordWidget({
    Key? key,
    required this.title,
    required this.label,
    required this.initialValue,
    required this.controller,
    required this.onValueChanged, this.titleStyle,  this.titleAlign,
  }) : super(key: key);

  @override
  _ScaleRecordWidgetState createState() => _ScaleRecordWidgetState();
}

class _ScaleRecordWidgetState extends State<ScaleRecordWidget> {
  late num _currentValue;

  @override
  void initState() {
    super.initState();
    _currentValue = widget.controller.value;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: widget.titleAlign ?? MainAxisAlignment.start,
          children: [
            Text(
              widget.title,
              style: widget.titleStyle ?? Theme.of(context).textTheme.title320?.copyWith(),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '$_currentValue ',
              style: Theme.of(context).textTheme.titleXL?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
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
              _currentValue = value;
              widget.controller.value = value;
            });
            widget.onValueChanged(value);
          },
          ranges: const [
            RulerRange(begin: 0, end: 200),
          ],
          width: MediaQuery.of(context).size.width * 0.8,
          height: 80,
          rulerBackgroundColor: Colors.transparent,
          onBuildRulerScaleText: (index, value) {
            return value.toStringAsFixed(1);
          },
        ),
      ],
    );
  }
}
