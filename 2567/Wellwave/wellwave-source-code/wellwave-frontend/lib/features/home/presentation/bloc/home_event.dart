import 'package:flutter/material.dart';
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_health_data_request_model.dart';
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_personal_data_request_model.dart';

@immutable
sealed class HomeEvent {
  @override
  List<Object> get props => [];
}

class UpdateDataFromReAssessmentEvent extends HomeEvent {
  final HealthAssessmentPersonalDataRequestModel model;

  UpdateDataFromReAssessmentEvent(this.model);
}

class CalculateWeeklyAveragesEvent extends HomeEvent {
  final List<Map<String, dynamic>> data;

  CalculateWeeklyAveragesEvent(this.data);
}

class GenerateGreetingTextEvent extends HomeEvent {}

class UpdateCompletionStatusEvent extends HomeEvent {
  final String progressId;
  final DateTime date;
  final bool isComplete;

  UpdateCompletionStatusEvent({
    required this.progressId,
    required this.date,
    required this.isComplete,
  });
}

class LoadNotificationsEvent extends HomeEvent {}

class MarkNotificationAsReadEvent extends HomeEvent {
  final String notificationId;

  MarkNotificationAsReadEvent(this.notificationId);
}

// class NewNotificationReceived extends HomeEvent {

//   NewNotificationReceived(this.notification);
// }

class NextStep extends HomeEvent {}

class PreviousStep extends HomeEvent {}

class ResetStep extends HomeEvent {}

class UpdateFieldData extends HomeEvent {
  final String fieldName;
  final dynamic value;

  UpdateFieldData(this.fieldName, this.value);

  @override
  List<Object> get props => [fieldName, value];
}

class SubmitWeightDataEvent extends HomeEvent {
  final HealthAssessmentPersonalDataRequestModel model;

  SubmitWeightDataEvent(this.model);
  @override
  List<Object> get props => [model];
}

class SubmitHealthDataHomeEvent extends HomeEvent {
  final HealthAssessmentHealthDataRequestModel model;

  SubmitHealthDataHomeEvent(this.model);
  @override
  List<Object> get props => [model];
}

class MarkAsReadNotiEvent extends HomeEvent {
  final String notificationId;

  MarkAsReadNotiEvent(this.notificationId);

  @override
  List<Object> get props => [notificationId];
}

class MarkAllAsReadNotiEvent extends HomeEvent {}

class FetchHomeEvent extends HomeEvent {
  final BuildContext context;

  FetchHomeEvent(this.context);
}

class FetchUserChallengesEvent extends HomeEvent {
  @override
  List<Object> get props => [];
}

class FetchChallengesDataEvent extends HomeEvent {
  @override
  List<Object> get props => [];
}
