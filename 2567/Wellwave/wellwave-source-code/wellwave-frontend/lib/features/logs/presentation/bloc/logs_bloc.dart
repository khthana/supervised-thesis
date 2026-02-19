import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:wellwave_frontend/features/logs/data/models/logs_request_model.dart';
import 'package:wellwave_frontend/features/logs/data/models/logs_request_model_waistline.dart';
import 'package:wellwave_frontend/features/logs/data/models/logs_request_model_weekly.dart';
import 'package:wellwave_frontend/features/logs/data/models/logs_request_model_weight.dart';
import 'package:wellwave_frontend/features/logs/data/repositories/logs_repositories.dart';
import 'package:intl/intl.dart';

import '../../data/models/logs_request_model_sleep.dart';
import '../../data/models/logs_request_model_drink.dart';
import '../../data/models/logs_request_model_step.dart';

part 'logs_event.dart';
part 'logs_state.dart';

class LogsBloc extends Bloc<LogsEvent, LogsState> {
  final _secureStorage = const FlutterSecureStorage();
  final LogsRequestRepository _logsRequestRepository;

  LogsBloc(this._logsRequestRepository) : super(LogsInitial()) {
    on<LogsFetched>(_onLogsFetches);
    on<LogsFetchedGraph>(_onGraphLogsFetches);
    on<SubmitLogEvent>((event, emit) async {
      await submitLog(event.logName, event.value, event.selectedDate,
          _logsRequestRepository);
    });
  }

  Future<void> _onLogsFetches(
      LogsFetched event, Emitter<LogsState> emit) async {
    final uid = await _secureStorage.read(key: 'user_uid');
    if (uid == null) {
      throw Exception("No access uid found");
    }
    emit(LogsLoadInProgress());

    try {
      final logsList =
          await _logsRequestRepository.getLogsById(uid, event.date);
      final logsWeeklyList =
          await _logsRequestRepository.getWeeklyLogs(uid, event.date);
      final logsLastWeekList = await _logsRequestRepository.getWeeklyLogs(
          uid, event.date.subtract(const Duration(days: 7)));

      emit(LogsLoadSuccess(
        logslist: logsList,
        logsWeeklyList: logsWeeklyList,
        logsLastWeekList: logsLastWeekList,
      ));
    } catch (e) {
      emit(LogsError(message: e.toString()));
    }
  }

  Future<void> _onGraphLogsFetches(
      LogsFetchedGraph event, Emitter<LogsState> emit) async {
    final uid = await _secureStorage.read(key: 'user_uid');
    if (uid == null) {
      throw Exception("No access uid found");
    }
    emit(LogsLoadGraphInProgress());

    try {
      final logsWeightList =
          await _logsRequestRepository.getWeightLogs(uid, event.date);
      final logsWaistLineList =
          await _logsRequestRepository.getWaistLineLogs(uid, event.date);
      final logsDrinkList =
          await _logsRequestRepository.getDrinkLogs(uid, event.date);
      final logsStepList =
          await _logsRequestRepository.getStepLogs(uid, event.date);
      final logsSleepList =
          await _logsRequestRepository.getSleepLogs(uid, event.date);

      emit(LogsLoadGraphSuccess(
        logsDrinklist: logsDrinkList,
        logsSleeplist: logsSleepList,
        logsSteplist: logsStepList,
        logsWeightlist: logsWeightList,
        logsWaistLinelist: logsWaistLineList,
      ));
    } catch (e) {
      emit(LogsError(message: e.toString()));
    }
  }

  Future<void> submitLog(String logName, int value, String selectedDate,
      LogsRequestRepository logsRepository) async {
    final uid = await _secureStorage.read(key: 'user_uid');
    if (uid == null) {
      throw Exception("No access uid found");
    }
    try {
      String formattedDate =
          DateFormat('yyyy-MM-dd').format(DateTime.parse(selectedDate));

      int parsedUid = int.tryParse(uid) ?? 0;

      if (parsedUid == 0) {
        throw Exception("Invalid user UID");
      }

      bool logExists = await logsRepository.logExists(
        logName: logName,
        uid: parsedUid,
        date: formattedDate,
      );

      bool success;
      if (logExists) {
        success = await logsRepository.editLogsRequest(
          value: value,
          logName: logName,
          uid: parsedUid,
          date: formattedDate,
        );
        print(
            'Edited Log Date: $formattedDate, Value: $value, Log Name: $logName, User ID: $parsedUid');
      } else {
        success = await logsRepository.createLogsRequest(
          value: value,
          logName: logName,
          uid: parsedUid,
          date: formattedDate,
        );
        print(
            'Edited Log Date: $formattedDate, Value: $value, Log Name: $logName, User ID: $parsedUid');
      }
    } catch (error) {
      debugPrint('Log operation successful');
    }
  }
}
