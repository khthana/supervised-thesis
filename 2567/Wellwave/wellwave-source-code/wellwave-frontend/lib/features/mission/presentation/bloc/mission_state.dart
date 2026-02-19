part of 'mission_bloc.dart';

abstract class MissionState {
  const MissionState();

  List<Object?> get props => [];
}

class MissionInitial extends MissionState {}

class HabitChallengeState extends MissionState {
  final int dailyCount;
  final int minuteCount;

  HabitChallengeState({
    required this.dailyCount,
    required this.minuteCount,
  });

  @override
  List<Object?> get props => [dailyCount, minuteCount];
}

class ProgressState extends MissionState {}

class DailyTaskState extends MissionState {
  final List<int> completedTaskIds;

  DailyTaskState({this.completedTaskIds = const []});

  @override
  List<Object?> get props => [completedTaskIds];
}

class HabitLoading extends MissionState {}

class HabitLoaded extends MissionState {
  final HabitRequestModel habits;
  final RecHabitResponseModel? recHabits;

  const HabitLoaded(
    this.habits,
    this.recHabits,
  );

  @override
  List<Object?> get props => [habits, recHabits];
}

class HabitError extends MissionState {
  final String message;

  const HabitError(this.message);

  @override
  List<Object> get props => [message];
}

class QuestLoading extends MissionState {}

class QuestLoaded extends MissionState {
  final QuestRequestModel quests;

  const QuestLoaded(this.quests);

  @override
  List<Object?> get props => [quests];
}

class QuestError extends MissionState {
  final String message;

  const QuestError(this.message);

  @override
  List<Object?> get props => [message];
}

class DailyTaskLoading extends MissionState {}

class DailyTaskLoaded extends MissionState {
  final GetDailyHabitModel dailyTasks;
  final HabitRequestModel? habits;
  final GetDailyHabitModel? previousDailyTasks;

  const DailyTaskLoaded(
    this.dailyTasks, {
    this.habits,
    this.previousDailyTasks,
  });

  @override
  List<Object?> get props => [dailyTasks, habits, previousDailyTasks];
}

class DailyTaskError extends MissionState {
  final String message;

  const DailyTaskError(this.message);

  @override
  List<Object?> get props => [message];
}

class HistoryLoading extends MissionState {}

class HistoryLoaded extends MissionState {
  final GetHistoryModel history;

  const HistoryLoaded(this.history);

  @override
  List<Object?> get props => [history];
}

class HistoryError extends MissionState {
  final String message;

  const HistoryError(this.message);

  @override
  List<Object?> get props => [message];
}

class GetDailyTaskLoading extends MissionState {}

class GetDailyTaskLoaded extends MissionState {
  final DailyTaskListModel getDailyTasks;

  const GetDailyTaskLoaded(this.getDailyTasks);

  @override
  List<Object?> get props => [getDailyTasks];
}

class GemsUpdating extends MissionState {}

class GemsUpdateSuccess extends MissionState {
  final int updatedAmount;

  const GemsUpdateSuccess(this.updatedAmount);
}

class GemsUpdateFailure extends MissionState {
  final String message;

  const GemsUpdateFailure(this.message);
}

class DailyTrackSubmitting extends MissionState {}

class DailyTrackSuccess extends MissionState {
  final int trackId;
  final HabitTrackRequestModel trackData;

  const DailyTrackSuccess({
    required this.trackId,
    required this.trackData,
  });

  @override
  List<Object> get props => [trackId, trackData];
}

class MoodTrackSubmitting extends MissionState {}

class MoodTrackSuccess extends MissionState {
  final HabitTrackRequestModel trackData;

  const MoodTrackSuccess(this.trackData);

  @override
  List<Object?> get props => [trackData];
}

class ActiveHabitLoading extends MissionState {}

class ActiveHabitLoaded extends MissionState {
  final Map<String, dynamic> habitData;
  final List<Map<String, dynamic>> dailyTracks;
  final ActiveHabitModel? previousTaskItems;
  final GetDailyHabitModel? dailyTasks;
  final HabitRequestModel? habits;

  const ActiveHabitLoaded({
    required this.habitData,
    required this.dailyTracks,
    this.previousTaskItems,
    this.dailyTasks,
    this.habits,
  });

  @override
  List<Object?> get props => [
        habitData,
        dailyTracks,
        previousTaskItems,
        dailyTasks,
        habits,
      ];
}

class ActiveHabitError extends MissionState {
  final String message;

  const ActiveHabitError(this.message);

  @override
  List<Object> get props => [message];
}
