import 'package:intl/intl.dart';
import 'package:wellwave_frontend/features/home/data/models/health_data_step_and_ex_response_model.dart';

List<Map<String, dynamic>> calculateWeeklyAverage(
    List<HealthEntry> stepEntries) {
  Map<String, List<int>> weeklyData = {};

  final DateFormat dateFormat = DateFormat("yyyy-MM-dd");

  for (var entry in stepEntries) {
    DateTime date = dateFormat.parse(entry.date);

    DateTime startOfWeek = date.subtract(Duration(days: date.weekday % 7));

    String weekKey = dateFormat.format(startOfWeek);

    if (!weeklyData.containsKey(weekKey)) {
      weeklyData[weekKey] = [];
    }

    weeklyData[weekKey]!.add(entry.value);
  }

  List<Map<String, dynamic>> weeklyAverages = [];
  weeklyData.forEach((week, steps) {
    double average = steps.reduce((a, b) => a + b) / steps.length;

    int roundedAverage = average.toInt();

    weeklyAverages.add({
      'week': week,
      'average': roundedAverage,
    });
  });

  return weeklyAverages;
}
