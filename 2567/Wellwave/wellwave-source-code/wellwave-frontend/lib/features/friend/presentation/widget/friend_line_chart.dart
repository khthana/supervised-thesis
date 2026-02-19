import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class FriendLineChart extends StatelessWidget {
  final String logType;
  final List<Map<String, dynamic>> logs;
  final String selectedPeriod;

  const FriendLineChart({
    super.key,
    required this.logType,
    required this.logs,
    required this.selectedPeriod,
  });

  @override
  Widget build(BuildContext context) {
    print('=== FriendLineChart Debug ===');
    print('Logs data: $logs');

    if (logs.isEmpty) {
      return const Center(child: Text('No data available'));
    }

    // Calculate min and max values for Y axis
    final values = logs.map((log) => (log['value'] as num).toDouble()).toList();
    double minY = values.reduce((a, b) => a < b ? a : b);
    double maxY = values.reduce((a, b) => a > b ? a : b);
    minY = minY - (minY * 0.1);
    maxY = maxY + (maxY * 0.1);

    return Stack(
      children: <Widget>[
        AspectRatio(
          aspectRatio: 1.70,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 16),
            child: LineChart(
              LineChartData(
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: true,
                  horizontalInterval: 1,
                  verticalInterval: 1,
                  getDrawingHorizontalLine: (value) => const FlLine(
                    color: Color.fromARGB(255, 255, 255, 255),
                    strokeWidth: 0.5,
                  ),
                  getDrawingVerticalLine: (value) => const FlLine(
                    color: Color(0xFFB1B1B1),
                    strokeWidth: 0.5,
                  ),
                ),
                titlesData: FlTitlesData(
                  show: true,
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 30,
                      interval: 1,
                      getTitlesWidget: (value, meta) {
                        if (value.toInt() >= logs.length) {
                          return const Text('');
                        }
                        final date =
                            DateTime.parse(logs[value.toInt()]['date']);
                        return SideTitleWidget(
                          axisSide: meta.axisSide,
                          child: Text(
                            '${date.day}/${date.month}',
                            style: const TextStyle(
                              fontSize: 10,
                              color: Color(0xFF434343),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  leftTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                borderData: FlBorderData(
                  show: true,
                  border: const Border(
                    left: BorderSide(color: Color(0xFFB1B1B1), width: 0.5),
                    bottom: BorderSide(color: Color(0xFFB1B1B1), width: 0.5),
                  ),
                ),
                minX: 0,
                maxX: (logs.length - 1).toDouble(),
                minY: minY,
                maxY: maxY,
                lineBarsData: [
                  LineChartBarData(
                    spots: logs.asMap().entries.map((entry) {
                      final index = entry.key.toDouble();
                      final value = entry.value['value'] as num;
                      return FlSpot(index, value.toDouble());
                    }).toList(),
                    isCurved: false,
                    color: const Color(0xFF001DFF),
                    barWidth: 1,
                    isStrokeCapRound: true,
                    dotData: const FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFFADB7F9),
                          Color.fromARGB(0, 177, 185, 248)
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
