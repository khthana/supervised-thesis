import 'package:flutter/material.dart';
import 'package:calendar_slider/calendar_slider.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class CalendarSilder extends StatefulWidget {
  final ValueChanged<DateTime> onDateSelected;

  const CalendarSilder({Key? key, required this.onDateSelected})
      : super(key: key);

  @override
  State<CalendarSilder> createState() => _CalendarSilderState();
}

class _CalendarSilderState extends State<CalendarSilder> {
  final CalendarSliderController _firstController = CalendarSliderController();
  DateTime? selectedDate;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CalendarSlider(
          controller: _firstController,
          selectedDayPosition: SelectedDayPosition.center,
          fullCalendarScroll: FullCalendarScroll.horizontal,
          backgroundColor: AppColors.primaryColor,
          fullCalendarWeekDay: WeekDay.short,
          selectedTileBackgroundColor: AppColors.mintColor,
          monthYearButtonBackgroundColor: Colors.transparent,
          monthYearTextColor: Colors.white,
          tileBackgroundColor: AppColors.primaryColor,
          selectedDateColor: Colors.white,
          dateColor: Colors.white,
          tileShadow: BoxShadow(
            color: Colors.black.withOpacity(1),
          ),
          locale: 'th',
          initialDate: DateTime.now(),
          firstDate: DateTime.now().subtract(const Duration(days: 100)),
          lastDate: DateTime.now().add(const Duration(days: 100)),
          onDateSelected: (date) {
            setState(() {
              selectedDate = date; 
            });
            widget.onDateSelected(date); 
          },
        ),
      ],
    );
  }
}
