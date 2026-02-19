import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/features/health_assessment/data/repositories/health_assessment_repository.dart';
import 'package:wellwave_frontend/features/home/data/models/get_user_challenges_request_model.dart';
import 'package:wellwave_frontend/features/home/data/repositories/home_repository.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/repositories/habit_repositories.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/profile_repositories.dart';

import '../../../../config/constants/app_pages.dart';
import '../../../../config/routes/app_routes.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final DateTime currentDate;
  final HealthAssessmentRepository healthAssessmentRepository;
  final ProfileRepositories profileRepository;
  final NotificationsRepository notificationsRepository;
  final LoginStreakRepository loginStreakRepository;
  final HealthDataRepository healthDataRepository;
  final UserChallengesRepository userChallengesRepository;
  final RecommendHabitRepository recommendHabitRepository; // เพิ่มบรรทัดนี้
  final HabitRepositories habitRepositories;
  final Map<String, Map<DateTime, bool>> completionStatus = {};
  List<int> weeklyAverages = [];
  List<String> readNotifications = [];

  HomeBloc({
    required this.currentDate,
    required this.healthAssessmentRepository,
    required this.loginStreakRepository,
    required this.notificationsRepository,
    required this.profileRepository,
    required this.healthDataRepository,
    required this.userChallengesRepository,
    required this.recommendHabitRepository, // เพิ่มบรรทัดนี้
    required this.habitRepositories,
  }) : super(const HomeState(homeStep: 0)) {
    on<FetchHomeEvent>((event, emit) async {
      emit(const HomeLoading(homeStep: 0));
      try {
        final profile = await profileRepository.getUSer();
        final healthData = await healthAssessmentRepository.fetchHealthData();
        final loginStreak = await loginStreakRepository.fetchLoginStreakData();
        final notiData = await notificationsRepository.fetchNotiData();
        final healthStepAndExData =
            await healthDataRepository.fetchStepAndExTimeData();

        final userChallengesData =
            await userChallengesRepository.fetchUserChallengesData();

        final recommendHabitData = await recommendHabitRepository
            .fetchRecommendHabitData(); // เพิ่มบรรทัดนี้
        if (healthData == null) {
          debugPrint("No health data found, redirecting...");
          navigatorKey.currentContext?.goNamed(AppPages.assessmentName);
          return;
        }
        emit(HomeLoadedState(
          step: 0,
          profile: profile,
          healthData: healthData,
          loginStreak: loginStreak,
          notiData: notiData,
          healthStepAndExData: healthStepAndExData,
          userChallengesData: userChallengesData,
          recData: recommendHabitData, // เพิ่มบรรทัดนี้
        ));
      } catch (e) {
        debugPrint("Error fetching home data: $e");

        emit(HomeError(
          message: e.toString(),
          homeStep: 0,
        ));
      }
    });

    on<NextStep>((event, emit) {
      if (state.homeStep < 3) {
        emit(state.copyWith(step: state.homeStep + 1));
      }
    });
    on<PreviousStep>((event, emit) {
      if (state.homeStep > 0) {
        emit(state.copyWith(step: state.homeStep - 1));
      }
    });
    on<ResetStep>((event, emit) {
      emit(state.copyWith(step: 0, formDataReassessment: {}));
    });
    on<UpdateFieldData>((event, emit) {
      final currentState = state;
      if (currentState is HomeLoadedState) {
        final updatedFormData =
            Map<String, dynamic>.from(currentState.formDataReassessment ?? {});
        updatedFormData[event.fieldName] = event.value;

        emit(currentState.copyWith(formDataReassessment: updatedFormData));
      }
    });

    on<SubmitWeightDataEvent>((event, emit) async {
      final model = event.model;
      final weight = model.weight;

      debugPrint('Sending weight: $weight');

      final success = await profileRepository.updateWeight(weight);

      if (success) {
        debugPrint('Health data updated successfully');

        final updatedProfile = await profileRepository.getUSer();
        final updatedHealthData =
            await healthAssessmentRepository.fetchHealthData();
        final updatedLoginStreak =
            await loginStreakRepository.fetchLoginStreakData();

        emit(HomeLoadedState(
          step: (state as HomeLoadedState).homeStep,
          profile: updatedProfile,
          healthData: updatedHealthData,
          loginStreak: updatedLoginStreak,
        ));
      } else {
        debugPrint('Failed to update health data');
        emit(state);
      }
    });

    on<SubmitHealthDataHomeEvent>((event, emit) async {
      final model = event.model;
      final diastolicBloodPressure = model.diastolicBloodPressure;
      final systolicBloodPressure = model.systolicBloodPressure;
      final hdl = model.hdl;
      final ldl = model.ldl;
      final waistLine = model.waistLine;

      final Map<String, dynamic> updatedHealthData = {};
      if (diastolicBloodPressure != null) {
        updatedHealthData['DIASTOLIC_BLOOD_PRESSURE'] = diastolicBloodPressure;
      }
      if (systolicBloodPressure != null) {
        updatedHealthData['SYSTOLIC_BLOOD_PRESSURE'] = systolicBloodPressure;
      }
      if (hdl != null) {
        updatedHealthData['HDL'] = hdl;
      }
      if (ldl != null) {
        updatedHealthData['LDL'] = ldl;
      }
      if (waistLine != null) {
        updatedHealthData['WAIST_LINE'] = waistLine;
      }

      final success =
          await healthAssessmentRepository.updateHealthData(updatedHealthData);

      if (success) {
        debugPrint('Health data updated successfully');

        final updatedProfile = await profileRepository.getUSer();
        final updatedHealth =
            await healthAssessmentRepository.fetchHealthData();
        final updatedLoginStreak =
            await loginStreakRepository.fetchLoginStreakData();

        emit(HomeLoadedState(
          step: (state as HomeLoadedState).homeStep,
          profile: updatedProfile,
          healthData: updatedHealth,
          loginStreak: updatedLoginStreak,
        ));
      } else {
        debugPrint('Failed to update health data');
        emit(state);
      }
    });

    on<MarkAsReadNotiEvent>(_onMarkAsReadNotiEvent);
    on<MarkAllAsReadNotiEvent>(_onMarkAllAsReadNotiEvent);
    on<UpdateCompletionStatusEvent>(_onUpdateCompletionStatus);

    on<FetchChallengesDataEvent>(_onFetchChallengesDataEvent);
  }

  Future<void> _onMarkAsReadNotiEvent(
    MarkAsReadNotiEvent event,
    Emitter<HomeState> emit,
  ) async {
    try {
      final success = await notificationsRepository.markAsReadNotification(
        notificationId: event.notificationId,
      );

      if (success) {
        if (state is HomeLoadedState) {
          final currentState = state as HomeLoadedState;
          final updatedNotifications =
              currentState.notiData!.map((notification) {
            if (notification.notificationId == event.notificationId) {
              return notification.copyWith(isRead: true);
            }
            return notification;
          }).toList();

          emit(currentState.copyWith(notiData: updatedNotifications));
        }
      } else {
        debugPrint('Failed to mark as read');
      }
    } catch (e) {
      debugPrint('Failed to mark as read: $e');
    }
  }

  Future<void> _onMarkAllAsReadNotiEvent(
    MarkAllAsReadNotiEvent event,
    Emitter<HomeState> emit,
  ) async {
    try {
      final success = await notificationsRepository.markAllAsReadNotification();

      if (success) {
        if (state is HomeLoadedState) {
          final currentState = state as HomeLoadedState;
          final updatedNotifications =
              currentState.notiData!.map((notification) {
            return notification.copyWith(isRead: true);
          }).toList();

          emit(currentState.copyWith(notiData: updatedNotifications));
        }
      } else {
        debugPrint('Failed to mark as read');
      }
    } catch (e) {
      debugPrint('Failed to mark as read: $e');
    }
  }

  Future<void> _onUpdateCompletionStatus(
    UpdateCompletionStatusEvent event,
    Emitter<HomeState> emit,
  ) async {
    if (state is! HomeLoadedState) return;

    final currentState = state as HomeLoadedState;
    final challengeId = int.tryParse(event.progressId);

    if (challengeId == null) {
      debugPrint('Invalid progressId: ${event.progressId}');
      return;
    }

    // Create a deep copy to prevent reference issues
    final updatedCompletionStatus = Map<String, Map<DateTime, bool>>.from(
        currentState.completionStatus.map(
            (key, value) => MapEntry(key, Map<DateTime, bool>.from(value))));

    // Use string comparison for dates to solve comparison issues
    final dateString = event.date.toIso8601String().split('T')[0]; // YYYY-MM-DD
    final dateKey = DateTime.parse(dateString);

    if (updatedCompletionStatus[event.progressId] == null) {
      updatedCompletionStatus[event.progressId] = {};
    }
    updatedCompletionStatus[event.progressId]![dateKey] = event.isComplete;

    // Update UI immediately
    debugPrint(
        'Updating status for ${event.progressId} on $dateString to ${event.isComplete}');
    emit(currentState.copyWith(
      completionStatus: updatedCompletionStatus,
    ));

    try {
      await userChallengesRepository.updateUserChallengesData(
        challengeId: challengeId,
        completed: event.isComplete,
      );

      debugPrint('API update success - fetching fresh challenge data');

      // Fetch fresh data after successful update
      final updatedUserChallengesData =
          await userChallengesRepository.fetchUserChallengesData();

      // Emit updated state with fresh data while preserving UI state
      if (state is HomeLoadedState) {
        final newestState = state as HomeLoadedState;
        emit(newestState.copyWith(
          userChallengesData: updatedUserChallengesData,
          // Keep the latest completion status to ensure UI consistency
          completionStatus: newestState.completionStatus,
        ));
      }
    } catch (e) {
      debugPrint('Error in _onUpdateCompletionStatus: $e');

      // Revert status in case of error
      final revertedStatus = Map<String, Map<DateTime, bool>>.from(currentState
          .completionStatus
          .map((key, value) => MapEntry(key, Map<DateTime, bool>.from(value))));

      if (revertedStatus[event.progressId] == null) {
        revertedStatus[event.progressId] = {};
      }
      revertedStatus[event.progressId]![dateKey] = !event.isComplete;

      emit(currentState.copyWith(
        completionStatus: revertedStatus,
      ));
    }
  }

  Future<void> _onFetchChallengesDataEvent(
      FetchChallengesDataEvent event, Emitter<HomeState> emit) async {
    try {
      if (state is! HomeLoadedState) {
        // ถ้าไม่ใช่ HomeLoadedState ให้สร้าง state ใหม่ก่อน
        return;
      }

      final currentState = state as HomeLoadedState;

      // เรียกใช้ฟังก์ชันดึงข้อมูล challenges
      final userChallengesData =
          await userChallengesRepository.fetchUserChallengesData();

      // อัปเดต state ด้วยข้อมูลใหม่ แต่คงค่าเดิมของข้อมูลอื่นๆ
      emit(currentState.copyWith(
        userChallengesData: userChallengesData,
      ));
    } catch (e) {
      debugPrint("Error fetching challenges data: $e");
      // ไม่ต้องเปลี่ยน state กรณีเกิด error
    }
  }
}
