import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:wellwave_frontend/features/mission/data/models/daily_task_list_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/get_daily_habit_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/get_history_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/habit_track_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/quest_request_model.dart';
import 'package:wellwave_frontend/features/mission/data/models/rec_habit_respone_model.dart';
import 'package:wellwave_frontend/features/mission/data/repositories/habit_repositories.dart';
import 'package:wellwave_frontend/features/profile/data/repositories/profile_repositories.dart';

import '../../data/models/active_habit_model.dart';
part 'mission_event.dart';
part 'mission_state.dart';

class MissionBloc extends Bloc<MissionEvent, MissionState> {
  final HabitRepositories habitRepositories;
  final ProfileRepositories profileRepository;
  MissionBloc({
    required this.habitRepositories,
    required this.profileRepository,
  }) : super(MissionInitial()) {
    on<IncrementDailyCountEvent>(_onIncreaseDailyCount);
    on<DecrementDailyCountEvent>(_onDecreaseDailyCount);
    on<IncrementMinuteCountEvent>(_onIncreaseMinuteCount);
    on<DecrementMinuteCountEvent>(_onDecreaseMinuteCount);
    on<ConfirmGoalEvent>(_onConfirmGoal);
    on<ResetGoalEvent>(_onResetGoal);
    on<CompleteTaskEvent>(_onCompleteTaskEvent);
    on<StartProgressEvent>(_onStartProgress);
    on<LoadHabitsEvent>(_onLoadHabits);
    on<LoadQuestsEvent>(_onLoadQuests);
    on<LoadQuestDetailEvent>(_onLoadQuestDetail);
    on<LoadDailyTasksEvent>(_onLoadDailyGetTasks);
    on<LoadHistoryEvent>(_onLoadHistory);
    on<StartQuestEvent>(_onStartQuest);
    on<GetDailyTasksEvent>(_onGetDailyTasks);
    on<SubmitDailyTrackEvent>(_onSubmitDailyTrack);
    on<SubmitMoodTrackEvent>(_onSubmitMoodTrack);
    on<LoadActiveHabitEvent>(_onLoadActiveHabit);

    on<UpdateGemsEvent>((event, emit) async {
      try {
        debugPrint('Updating gems: +${event.gemsToAdd}');

        final success = await profileRepository.updateGem(event.gemsToAdd);

        if (success) {
          debugPrint('Gems updated successfully');

          final dailyTasks = await habitRepositories.getHabitDailyTask();

          if (dailyTasks != null) {
            emit(DailyTaskLoaded(dailyTasks));
          } else {
            emit(const DailyTaskError('Failed to refresh daily tasks'));
          }
        } else {
          debugPrint('Failed to update gems');
          emit(const DailyTaskError('Failed to update gems'));
        }
      } catch (e) {
        debugPrint('Error updating gems: $e');
        emit(DailyTaskError('Error updating gems: $e'));
      }
    });
  }

  void _onIncreaseDailyCount(
      IncrementDailyCountEvent event, Emitter<MissionState> emit) {
    if (state is HabitChallengeState) {
      final currentState = state as HabitChallengeState;
      emit(HabitChallengeState(
        dailyCount: currentState.dailyCount + 1,
        minuteCount: currentState.minuteCount,
      ));
    } else {
      emit(HabitChallengeState(dailyCount: 1, minuteCount: 5));
    }
  }

  void _onDecreaseDailyCount(
      DecrementDailyCountEvent event, Emitter<MissionState> emit) {
    if (state is HabitChallengeState) {
      final currentState = state as HabitChallengeState;
      if (currentState.dailyCount > 1) {
        emit(HabitChallengeState(
          dailyCount: currentState.dailyCount - 1,
          minuteCount: currentState.minuteCount,
        ));
      }
    }
  }

  void _onIncreaseMinuteCount(
      IncrementMinuteCountEvent event, Emitter<MissionState> emit) {
    if (state is HabitChallengeState) {
      final currentState = state as HabitChallengeState;
      emit(HabitChallengeState(
        dailyCount: currentState.dailyCount,
        minuteCount: currentState.minuteCount + event.incrementBy,
      ));
    } else {
      emit(HabitChallengeState(dailyCount: 1, minuteCount: 5));
    }
  }

  void _onDecreaseMinuteCount(
      DecrementMinuteCountEvent event, Emitter<MissionState> emit) {
    if (state is HabitChallengeState) {
      final currentState = state as HabitChallengeState;
      if (currentState.minuteCount > event.decrementBy) {
        emit(HabitChallengeState(
          dailyCount: currentState.dailyCount,
          minuteCount: currentState.minuteCount - event.decrementBy,
        ));
      }
    }
  }

  void _onConfirmGoal(
      ConfirmGoalEvent event, Emitter<MissionState> emit) async {
    try {
      final success = await habitRepositories.startHabit(
        hid: event.hid,
        daysGoal: event.dailyCount,
        dailyMinuteGoal: event.minuteCount! > 0 ? event.minuteCount : null,
      );

      if (success) {
        emit(HabitChallengeState(
          dailyCount: event.dailyCount,
          minuteCount: event.minuteCount!,
        ));
        debugPrint('''
          Habit challenge started successfully:
          HID: ${event.hid}
          Days Goal: ${event.dailyCount}
          Daily Minutes: ${event.minuteCount! > 0 ? event.minuteCount : 'Not set'}
        ''');
      } else {
        emit(const HabitError('Failed to start habit challenge'));
      }
    } catch (e) {
      emit(HabitError('Error starting habit challenge: $e'));
    }
  }

  void _onResetGoal(ResetGoalEvent event, Emitter<MissionState> emit) {
    emit(HabitChallengeState(
      dailyCount: event.defaultDaysGoal,
      minuteCount: event.defaultDailyMinuteGoal,
    ));
  }

  void _onCompleteTaskEvent(
      CompleteTaskEvent event, Emitter<MissionState> emit) {
    if (state is DailyTaskState) {
      final currentState = state as DailyTaskState;
      final updatedCompletedTaskIds =
          List<int>.from(currentState.completedTaskIds);

      if (!updatedCompletedTaskIds.contains(event.taskId)) {
        updatedCompletedTaskIds.add(event.taskId);
      }

      emit(DailyTaskState(completedTaskIds: updatedCompletedTaskIds));
    } else {
      emit(DailyTaskState(completedTaskIds: [event.taskId]));
    }
  }

  void _onStartProgress(StartProgressEvent event, Emitter<MissionState> emit) {
    emit(ProgressState());
  }

  void _onLoadHabits(LoadHabitsEvent event, Emitter<MissionState> emit) async {
    emit(HabitLoading());
    try {
      final habits =
          await habitRepositories.getHabitAll(category: event.category);
      if (habits != null) {
        emit(HabitLoaded(habits, null));
      } else {
        emit(const HabitError('Failed to load habits'));
      }
    } catch (e) {
      emit(HabitError('Error loading habits: $e'));
    }
  }

  void _onLoadQuests(LoadQuestsEvent event, Emitter<MissionState> emit) async {
    emit(QuestLoading());
    try {
      final quests = await habitRepositories.getQuest();
      if (quests != null) {
        emit(QuestLoaded(quests));
      } else {
        emit(const QuestError('Failed to load quests'));
      }
    } catch (e) {
      emit(QuestError('Error loading quests: $e'));
    }
  }

  void _onLoadQuestDetail(
      LoadQuestDetailEvent event, Emitter<MissionState> emit) async {
    emit(QuestLoading());
    try {
      final quest = await habitRepositories.getQuest();
      if (quest != null) {
        emit(QuestLoaded(quest));
      } else {
        emit(const QuestError('Failed to load quest details'));
      }
    } catch (e) {
      emit(QuestError('Error loading quest details: $e'));
    }
  }

  void _onLoadDailyGetTasks(
      LoadDailyTasksEvent event, Emitter<MissionState> emit) async {
    try {
      emit(DailyTaskLoading());
      final dailyTasks = await habitRepositories.getHabitDailyTask();

      if (dailyTasks != null) {
        emit(DailyTaskLoaded(dailyTasks));
      } else {
        emit(const DailyTaskError('Failed to load daily tasks'));
      }
    } catch (e) {
      emit(DailyTaskError('Error loading daily tasks: $e'));
    }
  }

  void _onGetDailyTasks(
      GetDailyTasksEvent event, Emitter<MissionState> emit) async {
    try {
      emit(GetDailyTaskLoading());
      final getDailyTasks = await habitRepositories.getDaily();

      if (getDailyTasks != null) {
        emit(GetDailyTaskLoaded(getDailyTasks));
      }
    } catch (e) {
      emit(DailyTaskError('Error loading daily tasks: $e'));
    }
  }

  void _onLoadHistory(
      LoadHistoryEvent event, Emitter<MissionState> emit) async {
    emit(HistoryLoading());
    try {
      final history = await habitRepositories.getHistory(event.date);
      if (history != null) {
        emit(HistoryLoaded(history));
      } else {
        emit(const HistoryError('Failed to load history'));
      }
    } catch (e) {
      emit(HistoryError('Error loading history: $e'));
    }
  }

  void _onSubmitDailyTrack(
    SubmitDailyTrackEvent event,
    Emitter<MissionState> emit,
  ) async {
    emit(DailyTrackSubmitting());

    try {
      final result = await habitRepositories.postDailyTrack(
        challengeId: event.challengeId,
        durationMinutes: event.durationMinutes,
        trackDate: event.trackDate,
        completed: event.completed,
      );

      if (result != null) {
        emit(DailyTrackSuccess(
          trackId: result.trackId ?? 0,
          trackData: result,
        ));
      }
    } catch (e) {
      debugPrint('Error submitting daily track: $e');
    }
  }

  void _onSubmitMoodTrack(
    SubmitMoodTrackEvent event,
    Emitter<MissionState> emit,
  ) async {
    emit(MoodTrackSubmitting());

    try {
      final result = await habitRepositories.patchDailyTrack(
        trackId: event.trackId,
        moodFeedback: event.moodFeedback,
      );

      if (result != null) {
        emit(MoodTrackSuccess(result));
      }
    } catch (e) {
      debugPrint('Error submitting daily track: $e');
    }
  }

  void _onLoadActiveHabit(
      LoadActiveHabitEvent event, Emitter<MissionState> emit) async {
    try {
      // เพิ่ม debug message เพื่อตรวจสอบการทำงาน
      debugPrint('Loading active habit with ID: ${event.taskId}');

      // Capture current habits if they exist in state
      HabitRequestModel? currentHabits;
      if (state is HabitLoaded) {
        currentHabits = (state as HabitLoaded).habits;
        debugPrint('Preserving current habits from HabitLoaded state');
      } else if (state is ActiveHabitLoaded &&
          (state as ActiveHabitLoaded).habits != null) {
        currentHabits = (state as ActiveHabitLoaded).habits;
        debugPrint('Preserving current habits from ActiveHabitLoaded state');
      }

      emit(ActiveHabitLoading());

      final activeHabitResponse = await habitRepositories.getActiveHabit();

      if (activeHabitResponse != null) {
        // Find the specific habit we're interested in
        final matchingHabit = activeHabitResponse.data.firstWhere(
          (habitData) => habitData.hid == event.taskId,
          orElse: () => throw Exception('Habit not found'),
        );

        emit(ActiveHabitLoaded(
          habitData: {
            'HID': matchingHabit.hid,
            'DAYS_GOAL': matchingHabit.daysGoal,
            'DAILY_MINUTE_GOAL': matchingHabit.dailyMinuteGoal,
            'START_DATE': matchingHabit.startDate,
            'END_DATE': matchingHabit.endDate,
            'habits': {
              'TITLE': matchingHabit.habits.title,
              'DESCRIPTION': matchingHabit.habits.description,
              'ADVICE': matchingHabit.habits.advice,
              'CATEGORY': matchingHabit.habits.category,
              'EXERCISE_TYPE': matchingHabit.habits.exerciseType,
              'TRACKING_TYPE': matchingHabit.habits.trackingType,
            },
          },
          previousTaskItems: activeHabitResponse,
          dailyTracks: matchingHabit.dailyTracks
              .map((track) => {
                    'TRACK_ID': track.trackId,
                    'CHALLENGE_ID': track.challengeId,
                    'TRACK_DATE': track.trackDate,
                    'COMPLETED': track.completed,
                    'DURATION_MINUTES': track.durationMinutes,
                    'DISTANCE_KM': track.distanceKm,
                    'STEPS_CALCULATED': track.stepsCalculated,
                    'CALORIES_BURNED': track.caloriesBurned,
                    'HEART_RATE': track.heartRate,
                    'MOOD_FEEDBACK': track.moodFeedback,
                  })
              .toList(),
          habits: currentHabits, // เก็บข้อมูล habits เดิมไว้
        ));

        debugPrint(
            'Successfully loaded active habit data with preserved habits');
      } else {
        emit(const ActiveHabitError(
            'Failed to load active habit: No data returned'));
      }
    } catch (e) {
      debugPrint('Error loading active habit: $e');
      emit(ActiveHabitError('Failed to load active habit: $e'));
    }
  }

  Future<void> _onStartQuest(
      StartQuestEvent event, Emitter<MissionState> emit) async {
    debugPrint('Starting quest loading state');
    emit(QuestLoading());

    try {
      debugPrint('Calling startQuest API for questId: ${event.questId}');

      // เริ่มทำ quest โดยส่ง questId ไปที่ repository
      final success = await habitRepositories.startQuest(event.questId);

      if (success) {
        debugPrint('StartQuest successful, fetching updated quests');

        // ดึงรายการ quest ที่อัปเดตแล้วหลังจากเริ่ม quest สำเร็จ
        final updatedQuests = await habitRepositories.getQuest();

        if (updatedQuests != null) {
          debugPrint('Successfully fetched updated quests');
          emit(QuestLoaded(updatedQuests));
        } else {
          debugPrint('Failed to fetch updated quests');
          emit(const QuestError('Failed to update quest list'));
        }
      } else {
        debugPrint('Failed to start quest');
        emit(const QuestError('Failed to start quest'));
      }
    } catch (e) {
      debugPrint('Error in _onStartQuest: $e');
      emit(QuestError('Error starting quest: $e'));
    }
  }
}
