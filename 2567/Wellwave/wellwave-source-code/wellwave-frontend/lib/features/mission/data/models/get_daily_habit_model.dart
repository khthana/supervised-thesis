class GetDailyHabitModel {
  final List<DailyHabitItemModel> data;
  final DailyHabitMetaModel meta;

  const GetDailyHabitModel({
    required this.data,
    required this.meta,
  });

  factory GetDailyHabitModel.fromJson(Map<String, dynamic> json) {
    return GetDailyHabitModel(
      data: (json['data'] as List)
          .map((e) => DailyHabitItemModel.fromJson(e))
          .toList(),
      meta: DailyHabitMetaModel.fromJson(json['meta']),
    );
  }
}

class DailyHabitItemModel {
  final int challengeId;
  final int uid;
  final int hid;
  final String startDate;
  final String endDate;
  final String status;
  final int? dailyMinuteGoal;
  final int daysGoal;
  final int streakCount;
  final bool isNotificationEnabled;
  final WeekdaysNotiModel weekdaysNoti;
  final String? notiTime;
  final HabitDetailModel habits;
  final List<DailyTrackModel> dailyTracks;

  const DailyHabitItemModel({
    required this.challengeId,
    required this.uid,
    required this.hid,
    required this.startDate,
    required this.endDate,
    required this.status,
    this.dailyMinuteGoal,
    required this.daysGoal,
    required this.streakCount,
    required this.isNotificationEnabled,
    required this.weekdaysNoti,
    this.notiTime,
    required this.habits,
    required this.dailyTracks,
  });

  factory DailyHabitItemModel.fromJson(Map<String, dynamic> json) {
    return DailyHabitItemModel(
      challengeId: (json['CHALLENGE_ID'] as num).toInt(),
      uid: (json['UID'] as num).toInt(),
      hid: (json['HID'] as num).toInt(),
      startDate: json['START_DATE'] ?? '',
      endDate: json['END_DATE'] ?? '',
      status: json['STATUS'] ?? '',
      dailyMinuteGoal: json['DAILY_MINUTE_GOAL'] != null
          ? (json['DAILY_MINUTE_GOAL'] as num).toInt()
          : null,
      daysGoal: (json['DAYS_GOAL'] as num).toInt(),
      streakCount: (json['STREAK_COUNT'] as num).toInt(),
      isNotificationEnabled: json['IS_NOTIFICATION_ENABLED'] ?? false,
      weekdaysNoti: WeekdaysNotiModel.fromJson(json['WEEKDAYS_NOTI']),
      notiTime: json['NOTI_TIME'],
      habits: HabitDetailModel.fromJson(json['habits']),
      dailyTracks: (json['dailyTracks'] as List)
          .map((e) => DailyTrackModel.fromJson(e))
          .toList(),
    );
  }
}

class WeekdaysNotiModel {
  final bool friday;
  final bool monday;
  final bool sunday;
  final bool tuesday;
  final bool saturday;
  final bool thursday;
  final bool wednesday;

  const WeekdaysNotiModel({
    required this.friday,
    required this.monday,
    required this.sunday,
    required this.tuesday,
    required this.saturday,
    required this.thursday,
    required this.wednesday,
  });

  factory WeekdaysNotiModel.fromJson(Map<String, dynamic> json) {
    return WeekdaysNotiModel(
      friday: json['Friday'] ?? false,
      monday: json['Monday'] ?? false,
      sunday: json['Sunday'] ?? false,
      tuesday: json['Tuesday'] ?? false,
      saturday: json['Saturday'] ?? false,
      thursday: json['Thursday'] ?? false,
      wednesday: json['Wednesday'] ?? false,
    );
  }
}

class HabitDetailModel {
  final int hid;
  final String title;
  final String description;
  final String advice;
  final String category;
  final String? exerciseType;
  final String trackingType;
  final int expReward;
  final int? gemReward;
  final int? defaultDailyMinuteGoal;
  final int defaultDaysGoal;
  final String thumbnailUrl;
  final bool isDaily;
  final HabitConditionsModel conditions;
  final String createdAt;
  final String updatedAt;

  const HabitDetailModel({
    required this.hid,
    required this.title,
    required this.description,
    required this.advice,
    required this.category,
    this.exerciseType,
    required this.trackingType,
    required this.expReward,
    this.gemReward,
    this.defaultDailyMinuteGoal,
    required this.defaultDaysGoal,
    required this.thumbnailUrl,
    required this.isDaily,
    required this.conditions,
    required this.createdAt,
    required this.updatedAt,
  });

  factory HabitDetailModel.fromJson(Map<String, dynamic> json) {
    return HabitDetailModel(
      hid: (json['HID'] as num).toInt(),
      title: json['TITLE'] ?? '',
      description: json['DESCRIPTION'] ?? '',
      advice: json['ADVICE'] ?? '',
      category: json['CATEGORY'] ?? '',
      exerciseType: json['EXERCISE_TYPE'],
      trackingType: json['TRACKING_TYPE'] ?? '',
      expReward: (json['EXP_REWARD'] as num).toInt(),
      gemReward: json['GEM_REWARD'] as int? ?? 0,
      defaultDailyMinuteGoal: json['DEFAULT_DAILY_MINUTE_GOAL'] != null
          ? (json['DEFAULT_DAILY_MINUTE_GOAL'] as num).toInt()
          : null,
      defaultDaysGoal: (json['DEFAULT_DAYS_GOAL'] as num).toInt(),
      thumbnailUrl: json['THUMBNAIL_URL'] ?? '',
      isDaily: json['IS_DAILY'] ?? false,
      conditions: HabitConditionsModel.fromJson(json['CONDITIONS']),
      createdAt: json['CREATED_AT'] ?? '',
      updatedAt: json['UPDATED_AT'] ?? '',
    );
  }
}

class HabitConditionsModel {
  final bool obesityCondition;
  final bool diabetesCondition;
  final bool dyslipidemiaCondition;
  final bool hypertensionCondition;

  const HabitConditionsModel({
    required this.obesityCondition,
    required this.diabetesCondition,
    required this.dyslipidemiaCondition,
    required this.hypertensionCondition,
  });

  factory HabitConditionsModel.fromJson(Map<String, dynamic> json) {
    return HabitConditionsModel(
      obesityCondition: json['OBESITY_CONDITION'] ?? false,
      diabetesCondition: json['DIABETES_CONDITION'] ?? false,
      dyslipidemiaCondition: json['DYSLIPIDEMIA_CONDITION'] ?? false,
      hypertensionCondition: json['HYPERTENSION_CONDITION'] ?? false,
    );
  }
}

class DailyTrackModel {
  final int trackId;
  final int challengeId;
  final String trackDate;
  final bool completed;
  final int? durationMinutes;
  final double? distanceKm;
  final int? countValue;
  final int? stepsCalculated;
  final int? caloriesBurned;
  final int? heartRate;
  final String? moodFeedback;

  const DailyTrackModel({
    required this.trackId,
    required this.challengeId,
    required this.trackDate,
    required this.completed,
    this.durationMinutes,
    this.distanceKm,
    this.countValue,
    this.stepsCalculated,
    this.caloriesBurned,
    this.heartRate,
    this.moodFeedback,
  });

  factory DailyTrackModel.fromJson(Map<String, dynamic> json) {
    return DailyTrackModel(
      trackId: (json['TRACK_ID'] as num).toInt(),
      challengeId: (json['CHALLENGE_ID'] as num).toInt(),
      trackDate: json['TRACK_DATE'] ?? '',
      completed: json['COMPLETED'] ?? false,
      durationMinutes: json['DURATION_MINUTES'] != null
          ? (json['DURATION_MINUTES'] as num).toInt()
          : null,
      distanceKm: json['DISTANCE_KM'] != null
          ? (json['DISTANCE_KM'] as num).toDouble()
          : null,
      countValue: json['COUNT_VALUE'] != null
          ? (json['COUNT_VALUE'] as num).toInt()
          : null,
      stepsCalculated: json['STEPS_CALCULATED'] != null
          ? (json['STEPS_CALCULATED'] as num).toInt()
          : null,
      caloriesBurned: json['CALORIES_BURNED'] != null
          ? (json['CALORIES_BURNED'] as num).toInt()
          : null,
      heartRate: json['HEART_RATE'] != null
          ? (json['HEART_RATE'] as num).toInt()
          : null,
      moodFeedback: json['MOOD_FEEDBACK'],
    );
  }
}

class DailyHabitMetaModel {
  final int total;

  const DailyHabitMetaModel({required this.total});

  factory DailyHabitMetaModel.fromJson(Map<String, dynamic> json) {
    return DailyHabitMetaModel(
      total: (json['total'] as num).toInt(),
    );
  }
}
