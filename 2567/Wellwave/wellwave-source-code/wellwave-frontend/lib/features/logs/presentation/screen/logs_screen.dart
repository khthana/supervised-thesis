import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/features/logs/data/repositories/logs_repositories.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/daily_logs.dart';
import 'package:wellwave_frontend/features/logs/presentation/widget/weekly_logs.dart';
import '../../../../config/constants/app_colors.dart';
import '../../../../config/constants/app_strings.dart';
import '../bloc/logs_bloc.dart';

class LogsScreen extends StatefulWidget {
  const LogsScreen({super.key});

  @override
  State<LogsScreen> createState() => _LogsScreenState();
}

class _LogsScreenState extends State<LogsScreen> {
  @override
  void initState() {
    super.initState();
    BlocProvider.of<LogsBloc>(context).add(LogsFetched(DateTime.now()));
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      BlocProvider.of<LogsBloc>(context).add(LogsFetched(DateTime.now()));
      BlocProvider.of<LogsBloc>(context).add(LogsFetchedGraph(DateTime.now()));
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => LogsBloc(LogsRequestRepository()),
      child: Scaffold(
        appBar: AppBar(
          title: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                style: ButtonStyle(
                  foregroundColor: WidgetStateProperty.all<Color>(Colors.grey),
                ),
                onPressed: () {
                  context.goNamed(AppPages.logHistoryName);
                },
                child: Text(
                  AppStrings.historyText,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.greyColor,
                      ),
                ),
              )
            ],
          ),
        ),
        body: const SingleChildScrollView(
          child: Column(
            children: [
              DailyLogs(),
              WeeklyLogs(),
            ],
          ),
        ),
      ),
    );
  }
}
