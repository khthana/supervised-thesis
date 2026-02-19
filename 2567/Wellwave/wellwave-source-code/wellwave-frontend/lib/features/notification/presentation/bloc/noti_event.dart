part of 'noti_bloc.dart';

sealed class NotiEvent {}

class CreateBedtimeEvent extends NotiEvent {
  final int uid;
  final bool isActive;
  final String bedtime;

  final Map<String, bool> weekdays;

  CreateBedtimeEvent({
    required this.uid,
    required this.isActive,
    required this.bedtime,
    required this.weekdays,
  });
}

class FetchBedtimeEvent extends NotiEvent {}

class FetchDrinkPlanEvent extends NotiEvent {}

class FetchDrinkRangeEvent extends NotiEvent {}

class FetchMissionEvent extends NotiEvent {}

// class ToggleAllSwitchesEvent extends NotiEvent {}

class UpdateBedtimeEvent extends NotiEvent {
  final int uid;
  final bool isActive;

  UpdateBedtimeEvent({
    required this.uid,
    required this.isActive,
  });
}

class CreateDrinkPlanEvent extends NotiEvent {
  final int uid;
  final int glassNumber;
  final String notitime;

  CreateDrinkPlanEvent({
    required this.uid,
    required this.glassNumber,
    required this.notitime,
  });
}

class UpdateDrinkPlanEvent extends NotiEvent {
  final int uid;
  final bool isActive;

  UpdateDrinkPlanEvent({
    required this.uid,
    required this.isActive,
  });
}

class CreateDrinkRangeEvent extends NotiEvent {
  final int uid;
  final String startTime;
  final String endTime;
  final int intervalMinute;

  CreateDrinkRangeEvent({
    required this.uid,
    required this.startTime,
    required this.endTime,
    required this.intervalMinute,
  });
}

class UpdateDrinkRangeEvent extends NotiEvent {
  final int uid;
  final bool isActive;

  UpdateDrinkRangeEvent({
    required this.uid,
    required this.isActive,
  });
}

class CreateMissionEvent extends NotiEvent {
  final int challengeId;
  final bool isNotificationEnabled;
  final String notiTime;
  final String title;

  final Map<String, bool> weekdaysNoti;

  CreateMissionEvent({
    required this.challengeId,
    required this.isNotificationEnabled,
    required this.notiTime,
    required this.weekdaysNoti,
    required this.title,
  });
}

class UpdateMissionEvent extends NotiEvent {
  final int challengeId;
  final bool isNotificationEnabled;
  final String notiTime;
  final Map<String, bool> weekdaysNoti;

  UpdateMissionEvent({
    required this.challengeId,
    required this.isNotificationEnabled,
    required this.notiTime,
    required this.weekdaysNoti,
  });
}

class ToggleAllMissionsEvent extends NotiEvent {
  final bool enableAll;

  ToggleAllMissionsEvent({required this.enableAll});
}
