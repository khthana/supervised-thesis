class RecommendChallengesRequestModel {
  final List<Challenge> data;
  final Meta meta;

  RecommendChallengesRequestModel({
    required this.data,
    required this.meta,
  });

  factory RecommendChallengesRequestModel.fromJson(Map<String, dynamic> json) {
    return RecommendChallengesRequestModel(
      data: (json['data'] as List)
          .map((e) => Challenge.fromJson(e as Map<String, dynamic>))
          .toList(),
      meta: Meta.fromJson(json['meta'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'data': data.map((e) => e.toJson()).toList(),
      'meta': meta.toJson(),
    };
  }
}

class Meta {
  final int total;

  Meta({
    required this.total,
  });

  factory Meta.fromJson(Map<String, dynamic> json) {
    return Meta(
      total: (json['total'] as num).toInt(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'total': total,
    };
  }
}

class Challenge {
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
  final Map<String, bool> weekdaysNoti;
  final String? notiTime;
  final Habit habits;
  final List<DailyTrack> dailyTracks;

  Challenge({
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

  factory Challenge.fromJson(Map<String, dynamic> json) {
    return Challenge(
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
      weekdaysNoti: (json['WEEKDAYS_NOTI'] as Map<String, dynamic>).map(
        (key, value) => MapEntry(key, value as bool),
      ),
      notiTime: json['NOTI_TIME'],
      habits: Habit.fromJson(json['habits'] as Map<String, dynamic>),
      dailyTracks: (json['dailyTracks'] as List)
          .map((e) => DailyTrack.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'CHALLENGE_ID': challengeId,
      'UID': uid,
      'HID': hid,
      'START_DATE': startDate,
      'END_DATE': endDate,
      'STATUS': status,
      'DAILY_MINUTE_GOAL': dailyMinuteGoal,
      'DAYS_GOAL': daysGoal,
      'STREAK_COUNT': streakCount,
      'IS_NOTIFICATION_ENABLED': isNotificationEnabled,
      'WEEKDAYS_NOTI': weekdaysNoti,
      'NOTI_TIME': notiTime,
      'habits': habits.toJson(),
      'dailyTracks': dailyTracks.map((e) => e.toJson()).toList(),
    };
  }
}

class Habit {
  final int hid;
  final String title;
  final String description;
  final String advice;
  final String category;
  final String? exerciseType;
  final String trackingType;
  final int expReward;
  final int gemReward;
  final int? defaultDailyMinuteGoal;
  final int defaultDaysGoal;
  final String thumbnailUrl;
  final bool isDaily;
  final Conditions conditions;
  final String createdAt;
  final String updatedAt;

  Habit({
    required this.hid,
    required this.title,
    required this.description,
    required this.advice,
    required this.category,
    this.exerciseType,
    required this.trackingType,
    required this.expReward,
    required this.gemReward,
    this.defaultDailyMinuteGoal,
    required this.defaultDaysGoal,
    required this.thumbnailUrl,
    required this.isDaily,
    required this.conditions,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    return Habit(
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
      conditions:
          Conditions.fromJson(json['CONDITIONS'] as Map<String, dynamic>),
      createdAt: json['CREATED_AT'] ?? '',
      updatedAt: json['UPDATED_AT'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'HID': hid,
      'TITLE': title,
      'DESCRIPTION': description,
      'ADVICE': advice,
      'CATEGORY': category,
      'EXERCISE_TYPE': exerciseType,
      'TRACKING_TYPE': trackingType,
      'EXP_REWARD': expReward,
      'GEM_REWARD': gemReward,
      'DEFAULT_DAILY_MINUTE_GOAL': defaultDailyMinuteGoal,
      'DEFAULT_DAYS_GOAL': defaultDaysGoal,
      'THUMBNAIL_URL': thumbnailUrl,
      'IS_DAILY': isDaily,
      'CONDITIONS': conditions.toJson(),
      'CREATED_AT': createdAt,
      'UPDATED_AT': updatedAt,
    };
  }
}

class Conditions {
  final bool obesityCondition;
  final bool diabetesCondition;
  final bool dyslipidemiaCondition;
  final bool hypertensionCondition;

  Conditions({
    required this.obesityCondition,
    required this.diabetesCondition,
    required this.dyslipidemiaCondition,
    required this.hypertensionCondition,
  });

  factory Conditions.fromJson(Map<String, dynamic> json) {
    return Conditions(
      obesityCondition: json['OBESITY_CONDITION'] ?? false,
      diabetesCondition: json['DIABETES_CONDITION'] ?? false,
      dyslipidemiaCondition: json['DYSLIPIDEMIA_CONDITION'] ?? false,
      hypertensionCondition: json['HYPERTENSION_CONDITION'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'OBESITY_CONDITION': obesityCondition,
      'DIABETES_CONDITION': diabetesCondition,
      'DYSLIPIDEMIA_CONDITION': dyslipidemiaCondition,
      'HYPERTENSION_CONDITION': hypertensionCondition,
    };
  }
}

class DailyTrack {
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

  DailyTrack({
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

  factory DailyTrack.fromJson(Map<String, dynamic> json) {
    return DailyTrack(
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

  Map<String, dynamic> toJson() {
    return {
      'TRACK_ID': trackId,
      'CHALLENGE_ID': challengeId,
      'TRACK_DATE': trackDate,
      'COMPLETED': completed,
      'DURATION_MINUTES': durationMinutes,
      'DISTANCE_KM': distanceKm,
      'COUNT_VALUE': countValue,
      'STEPS_CALCULATED': stepsCalculated,
      'CALORIES_BURNED': caloriesBurned,
      'HEART_RATE': heartRate,
      'MOOD_FEEDBACK': moodFeedback,
    };
  }
}
