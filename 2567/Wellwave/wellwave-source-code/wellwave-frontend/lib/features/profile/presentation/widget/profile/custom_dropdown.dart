import 'package:flutter/material.dart';

class CustomDropdownButton extends StatefulWidget {
  final String selectedPeriod;
  final Function(String) onPeriodSelected;

  const CustomDropdownButton(
      {super.key,
      required this.onPeriodSelected,
      required this.selectedPeriod});

  @override
  _CustomDropdownButtonState createState() => _CustomDropdownButtonState();
}

class _CustomDropdownButtonState extends State<CustomDropdownButton> {
  final List<String> periods = [
    '7 วัน',
    '14 วัน',
    '1 เดือน',
    '3 เดือน',
    // '6 เดือน'
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 25,
      padding: const EdgeInsets.only(left: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFF919191), width: 1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: widget.selectedPeriod,
          items: periods.map((String period) {
            return DropdownMenuItem<String>(
              value: period,
              child: Text(
                period,
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(color: Colors.black, fontSize: 11.0),
              ),
            );
          }).toList(),
          onChanged: (String? newValue) {
            if (newValue != null) {
              widget.onPeriodSelected(newValue);
            }
          },
          icon: const Icon(
            Icons.keyboard_arrow_down,
            color: Color(0xFF919191),
          ),
          dropdownColor: Colors.white,
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
}
