import 'package:flutter/material.dart';
import 'package:wellwave_frontend/features/health_assessment/data/models/health_assessment_health_data_request_model.dart';
import 'package:wellwave_frontend/features/home/data/models/get_user_challenges_request_model.dart';
import 'package:wellwave_frontend/features/home/data/models/login_streak_data_response_model.dart';
import 'package:wellwave_frontend/features/home/data/models/notifications_data_response_model.dart';
import 'package:wellwave_frontend/features/home/data/models/recommend_challenges_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/rec_daily_habit_model.dart';
import 'package:wellwave_frontend/features/profile/data/models/profile_request_model.dart';

import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';

import '../../data/models/health_data_step_and_ex_response_model.dart';

@immutable
class HomeState extends Equatable {
  final int homeStep;
  final Map<String, dynamic>? formDataReassessment;

  const HomeState({required this.homeStep, this.formDataReassessment});

  HomeState copyWith({int? step, Map<String, dynamic>? formDataReassessment}) {
    return HomeState(
      homeStep: step ?? homeStep,
      formDataReassessment: formDataReassessment ?? this.formDataReassessment,
    );
  }

  @override
  List<Object?> get props => [homeStep, formDataReassessment];
}

class HomeLoading extends HomeState {
  const HomeLoading({required int homeStep}) : super(homeStep: homeStep);
}

class HomeError extends HomeState {
  final String message;

  const HomeError({required this.message, required int homeStep})
      : super(homeStep: homeStep);

  @override
  List<Object?> get props => super.props..add(message);
}

class HomeLoadedState extends HomeState {
  final ProfileRequestModel? profile;
  final HealthAssessmentHealthDataRequestModel? healthData;
  final LoginStreakDataResponseModel? loginStreak;
  final RecommendChallengesRequestModel? recData;
  final List<NotificationsDataResponseModel>? notiData;
  final HealthDataStepAndExResponseModel? healthStepAndExData;
  final GetUserChallengesRequestModel? userChallengesData;
  final Map<String, Map<DateTime, bool>> completionStatus;

  const HomeLoadedState({
    required int step,
    this.profile,
    this.healthData,
    this.loginStreak,
    this.notiData,
    this.healthStepAndExData,
    this.userChallengesData,
    this.recData,
    this.completionStatus = const {},
    Map<String, dynamic>? formDataReassessment,
  }) : super(homeStep: step, formDataReassessment: formDataReassessment);

  @override
  HomeLoadedState copyWith({
    int? step,
    ProfileRequestModel? profile,
    HealthAssessmentHealthDataRequestModel? healthData,
    LoginStreakDataResponseModel? loginStreak,
    HealthDataStepAndExResponseModel? healthStepAndExData,
    List<NotificationsDataResponseModel>? notiData,
    GetUserChallengesRequestModel? userChallengesData,
    RecommendChallengesRequestModel? recData,
    Map<String, Map<DateTime, bool>>? completionStatus,
    Map<String, dynamic>? formDataReassessment,
  }) {
    return HomeLoadedState(
      step: step ?? homeStep,
      profile: profile ?? this.profile,
      healthData: healthData ?? this.healthData,
      loginStreak: loginStreak ?? this.loginStreak,
      notiData: notiData ?? this.notiData,
      healthStepAndExData: healthStepAndExData ?? this.healthStepAndExData,
      userChallengesData: userChallengesData ?? this.userChallengesData,
      recData: recData ?? this.recData,
      completionStatus: completionStatus ?? this.completionStatus,
      formDataReassessment: formDataReassessment ?? this.formDataReassessment,
    );
  }

  @override
  List<Object?> get props => super.props
    ..addAll([
      profile,
      healthData,
      loginStreak,
      notiData,
      healthStepAndExData,
      userChallengesData,
      recData,
      completionStatus,
    ]);
}
