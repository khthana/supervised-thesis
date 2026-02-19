class ActiveHabitModel {
  final List<ActiveHabitData> data;
  final Meta meta;

  ActiveHabitModel({
    required this.data,
    required this.meta,
  });

  factory ActiveHabitModel.fromJson(Map<String, dynamic> json) {
    return ActiveHabitModel(
      data: (json['data'] as List)
          .map((x) => ActiveHabitData.fromJson(x))
          .toList(),
      meta: Meta.fromJson(json['meta']),
    );
  }
}

class ActiveHabitData {
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
  final WeekdaysNoti weekdaysNoti;
  final String? notiTime;
  final HabitDetail habits;
  final List<DailyTrack> dailyTracks;

  ActiveHabitData({
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

  factory ActiveHabitData.fromJson(Map<String, dynamic> json) {
    return ActiveHabitData(
      challengeId: json['CHALLENGE_ID'],
      uid: json['UID'],
      hid: json['HID'],
      startDate: json['START_DATE'],
      endDate: json['END_DATE'],
      status: json['STATUS'],
      dailyMinuteGoal: json['DAILY_MINUTE_GOAL'],
      daysGoal: json['DAYS_GOAL'],
      streakCount: json['STREAK_COUNT'],
      isNotificationEnabled: json['IS_NOTIFICATION_ENABLED'],
      weekdaysNoti: WeekdaysNoti.fromJson(json['WEEKDAYS_NOTI']),
      notiTime: json['NOTI_TIME'],
      habits: HabitDetail.fromJson(json['habits']),
      dailyTracks: (json['dailyTracks'] as List)
          .map((x) => DailyTrack.fromJson(x))
          .toList(),
    );
  }
}

class WeekdaysNoti {
  final bool friday;
  final bool monday;
  final bool sunday;
  final bool tuesday;
  final bool saturday;
  final bool thursday;
  final bool wednesday;

  WeekdaysNoti({
    required this.friday,
    required this.monday,
    required this.sunday,
    required this.tuesday,
    required this.saturday,
    required this.thursday,
    required this.wednesday,
  });

  factory WeekdaysNoti.fromJson(Map<String, dynamic> json) {
    return WeekdaysNoti(
      friday: json['Friday'],
      monday: json['Monday'],
      sunday: json['Sunday'],
      tuesday: json['Tuesday'],
      saturday: json['Saturday'],
      thursday: json['Thursday'],
      wednesday: json['Wednesday'],
    );
  }
}

class HabitDetail {
  final int hid;
  final String title;
  final String description;
  final String? advice; // เปลี่ยนเป็น nullable (?)
  final String category;
  final String? exerciseType;
  final String trackingType;
  final int expReward;
  final int? gemReward;
  final int? defaultDailyMinuteGoal;
  final int defaultDaysGoal;
  final String thumbnailUrl;
  final bool isDaily;
  final Conditions conditions;
  final String createdAt;
  final String updatedAt;

  HabitDetail({
    required this.hid,
    required this.title,
    required this.description,
    this.advice, // ไม่ต้อง required
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

  factory HabitDetail.fromJson(Map<String, dynamic> json) {
    return HabitDetail(
      hid: json['HID'],
      title: json['TITLE'] ?? '', // ถ้าเป็น null ให้ใช้ค่าว่าง
      description: json['DESCRIPTION'] ?? '',
      advice: json['ADVICE'], // ตอนนี้เป็น nullable แล้ว ไม่ต้องตรวจสอบ null
      category: json['CATEGORY'] ?? '',
      exerciseType: json['EXERCISE_TYPE'],
      trackingType: json['TRACKING_TYPE'] ?? '',
      expReward: json['EXP_REWARD'] ?? 0,
      gemReward: json['GEM_REWARD'],
      defaultDailyMinuteGoal: json['DEFAULT_DAILY_MINUTE_GOAL'],
      defaultDaysGoal: (json['DEFAULT_DAYS_GOAL'] as num?)?.toInt() ??
          1, // ถ้าเป็น null ให้ใช้ค่า 1
      thumbnailUrl: json['THUMBNAIL_URL'] ?? '',
      isDaily: json['IS_DAILY'] ?? false,
      conditions: json['CONDITIONS'] != null
          ? Conditions.fromJson(json['CONDITIONS'])
          : Conditions(
              // สร้าง conditions เริ่มต้นถ้าข้อมูลเป็น null
              obesityCondition: false,
              diabetesCondition: false,
              dyslipidemiaCondition: false,
              hypertensionCondition: false,
            ),
      createdAt: json['CREATED_AT'] ?? '',
      updatedAt: json['UPDATED_AT'] ?? '',
    );
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
      obesityCondition: json['OBESITY_CONDITION'],
      diabetesCondition: json['DIABETES_CONDITION'],
      dyslipidemiaCondition: json['DYSLIPIDEMIA_CONDITION'],
      hypertensionCondition: json['HYPERTENSION_CONDITION'],
    );
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
      trackId: json['TRACK_ID'],
      challengeId: json['CHALLENGE_ID'],
      trackDate: json['TRACK_DATE'],
      completed: json['COMPLETED'],
      durationMinutes: json['DURATION_MINUTES'],
      distanceKm: json['DISTANCE_KM'],
      countValue: json['COUNT_VALUE'],
      stepsCalculated: json['STEPS_CALCULATED'],
      caloriesBurned: json['CALORIES_BURNED'],
      heartRate: json['HEART_RATE'],
      moodFeedback: json['MOOD_FEEDBACK'],
    );
  }
}

class Meta {
  final int total;

  Meta({required this.total});

  factory Meta.fromJson(Map<String, dynamic> json) {
    return Meta(total: json['total']);
  }
}
