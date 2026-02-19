import 'package:flutter/material.dart';
import 'package:calendar_slider/calendar_slider.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/features/mission/presentation/bloc/mission_bloc.dart';

class CalendarSliderHistoryMission extends StatelessWidget {
  final DateTime selectedDate;
  final Function(DateTime) onDateSelected;

  const CalendarSliderHistoryMission({
    Key? key,
    required this.selectedDate,
    required this.onDateSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final CalendarSliderController _firstController =
        CalendarSliderController();

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
          initialDate: selectedDate,
          firstDate: DateTime.now().subtract(const Duration(days: 100)),
          lastDate: DateTime.now().add(const Duration(days: 100)),
          onDateSelected: (date) {
            context.read<MissionBloc>().add(LoadHistoryEvent(date));
            onDateSelected(date);
          },
        ),
      ],
    );
  }
}
