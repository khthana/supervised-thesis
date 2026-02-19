class StatsRequestModel {
  final int totalDays;
  final int completedDays;
  final int currentStreak;
  final int totalValue;
  final num progressPercentage;
  final String status;
  final List<DailyTrackModel> dailyTracks;

  StatsRequestModel({
    required this.totalDays,
    required this.completedDays,
    required this.currentStreak,
    required this.totalValue,
    required this.progressPercentage,
    required this.status,
    required this.dailyTracks,
  });

  factory StatsRequestModel.fromJson(Map<String, dynamic> json) {
    return StatsRequestModel(
      totalDays: json['totalDays'] as int,
      completedDays: json['completedDays'] as int,
      currentStreak: json['currentStreak'] as int,
      totalValue: json['totalValue'] as int,
      progressPercentage: json['progressPercentage'] as num,
      status: json['status'] as String,
      dailyTracks: (json['dailyTracks'] as List<dynamic>)
          .map((track) =>
              DailyTrackModel.fromJson(track as Map<String, dynamic>))
          .toList(),
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

  DailyTrackModel({
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
      trackId: json['TRACK_ID'] as int,
      challengeId: json['CHALLENGE_ID'] as int,
      trackDate: json['TRACK_DATE'] as String,
      completed: json['COMPLETED'] as bool,
      durationMinutes: json['DURATION_MINUTES'] as int?,
      distanceKm: (json['DISTANCE_KM'] as num?)?.toDouble(),
      countValue: json['COUNT_VALUE'] as int?,
      stepsCalculated: json['STEPS_CALCULATED'] as int?,
      caloriesBurned: json['CALORIES_BURNED'] as int?,
      heartRate: json['HEART_RATE'] as int?,
      moodFeedback: json['MOOD_FEEDBACK'] as String?,
    );
  }
}
