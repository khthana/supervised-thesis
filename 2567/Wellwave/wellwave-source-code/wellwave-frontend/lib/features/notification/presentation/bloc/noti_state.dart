part of 'noti_bloc.dart';

sealed class NotiState {}

class NotiInitial extends NotiState {}

class NotiLoading extends NotiState {}

class NotiLoadedState extends NotiState {
  final BedtimeState? bedtimeState;
  final DrinkRangeState? drinkRangeState;
  final DrinkPlanState? drinkPlanState;
  final MissionState? missionState;

  NotiLoadedState({
    this.bedtimeState,
    this.drinkRangeState,
    this.missionState,
    this.drinkPlanState,
  });

  NotiLoadedState copyWith({
    BedtimeState? bedtimeState,
    DrinkRangeState? drinkRangeState,
    MissionState? missionState,
    DrinkPlanState? drinkPlanState,
  }) {
    return NotiLoadedState(
      bedtimeState: bedtimeState ?? this.bedtimeState,
      drinkRangeState: drinkRangeState ?? this.drinkRangeState,
      drinkPlanState: drinkPlanState ?? this.drinkPlanState,
      missionState: missionState ?? this.missionState,
    );
  }
}

class NotiError extends NotiState {
  final String message;

  NotiError({required this.message});
}

class BedtimeState extends NotiState {
  final bool isActive;
  final String bedtime;
  final Map<String, bool> weekdays;

  BedtimeState({
    required this.isActive,
    required this.bedtime,
    required this.weekdays,
  });

  BedtimeState copyWith({
    bool? isActive,
    String? bedtime,
    Map<String, bool>? weekdays,
  }) {
    return BedtimeState(
      isActive: isActive ?? this.isActive,
      bedtime: bedtime ?? this.bedtime,
      weekdays: weekdays ?? this.weekdays,
    );
  }
}

class DrinkPlanState extends NotiState {
  final bool isActive;
  final List<DrinkSettingDetail> settings;

  DrinkPlanState({
    required this.isActive,
    required this.settings,
  });

  DrinkPlanState copyWith({
    bool? isActive,
    List<DrinkSettingDetail>? settings,
  }) {
    return DrinkPlanState(
      isActive: isActive ?? this.isActive,
      settings: settings ?? this.settings,
    );
  }
}

class DrinkRangeState extends NotiState {
  final bool isActive;
  final String startTime;
  final String endTime;
  final int intervalMinute;

  DrinkRangeState(
      {required this.isActive,
      required this.startTime,
      required this.endTime,
      required this.intervalMinute});

  DrinkRangeState copyWith({
    bool? isActive,
    String? notitime,
  }) {
    return DrinkRangeState(
      isActive: isActive ?? this.isActive,
      startTime: startTime,
      endTime: endTime,
      intervalMinute: intervalMinute,
    );
  }
}

class MissionState extends NotiState {
  final List<MissionNotificationModel> missions;
  final int? total;

  MissionState({
    required this.missions,
    this.total,
  });

  MissionState copyWith({
    List<MissionNotificationModel>? missions,
    int? total,
  }) {
    return MissionState(
      missions: missions ?? this.missions,
      total: total ?? this.total,
    );
  }
}
