import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_event.dart';

import 'package:wellwave_frontend/features/profile/presentation/widget/profile/custom_dropdown.dart';

class FriendProgressChartCard extends StatefulWidget {
  final String title;
  final double value;
  final String unit;
  final List<double> chartValues;
  final Widget chart;
  final String selectedPeriod;
  final Function(String) onPeriodSelected;
  final String friendUid; // Add this line

  const FriendProgressChartCard({
    Key? key,
    required this.title,
    required this.value,
    required this.unit,
    required this.chartValues,
    required this.chart,
    required this.selectedPeriod,
    required this.onPeriodSelected,
    required this.friendUid, // Add this line
  }) : super(key: key);

  @override
  State<FriendProgressChartCard> createState() =>
      _FriendProgressChartCardState();
}

class _FriendProgressChartCardState extends State<FriendProgressChartCard> {
  @override
  Widget build(BuildContext context) {
    // เพิ่ม debug logs
    print('=== Friend Progress Chart Debug ===');
    print('Title: ${widget.title}');
    print('Current Value: ${widget.value}');
    print('Unit: ${widget.unit}');
    print('Chart Values: ${widget.chartValues}');
    print('Selected Period: ${widget.selectedPeriod}');
    print('Chart Widget Type: ${widget.chart.runtimeType}');

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        widget.title,
                        style:
                            Theme.of(context).textTheme.titleSmall?.copyWith(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        widget.value.toStringAsFixed(0),
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontSize: 20),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        widget.unit,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              fontSize: 11.0,
                              color: Colors.black,
                            ),
                      ),
                    ],
                  ),
                ],
              ),
              CustomDropdownButton(
                selectedPeriod: widget.selectedPeriod,
                onPeriodSelected: (period) {
                  widget.onPeriodSelected(period);

                  // Debug logs
                  print('=== Period Selection Debug ===');
                  print('Selected Period: $period');

                  final now = DateTime.now();
                  DateTime fromDate;
                  DateTime toDate = now;

                  switch (period) {
                    case '14 วัน':
                      fromDate = now.subtract(const Duration(days: 13));
                      break;
                    case '1 เดือน':
                      fromDate = DateTime(now.year, now.month - 1, now.day);
                      break;
                    case '3 เดือน':
                      fromDate = DateTime(now.year, now.month - 3, now.day);
                      break;

                    default:
                      print('dropdown 7');
                      fromDate = now.subtract(const Duration(days: 7));
                  }

                  print(
                      'Date Range: ${fromDate.toIso8601String()} to ${toDate.toIso8601String()}');

                  context.read<FriendBloc>().add(
                        LoadFriendEvent(
                          friendUid: widget.friendUid,
                          selectedPeriod: period,
                          fromDate: fromDate,
                          toDate: toDate,
                        ),
                      );

                  // Always format and include dates in API path
                  final formattedFromDate =
                      fromDate.toIso8601String().split('T')[0];
                  final formattedToDate =
                      toDate.toIso8601String().split('T')[0];

                  final path = '/friend/friend-profile/${widget.friendUid}?'
                      'stepFromDate=$formattedFromDate&'
                      'stepToDate=$formattedToDate&'
                      'sleepFromDate=$formattedFromDate&'
                      'sleepToDate=$formattedToDate';
                  print('API Path: $path');
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Builder(
                  builder: (context) {
                    print('Building chart widget...');
                    return widget.chart;
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
