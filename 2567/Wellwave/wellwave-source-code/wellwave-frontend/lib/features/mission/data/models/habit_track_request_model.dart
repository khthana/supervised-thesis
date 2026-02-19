class HabitTrackRequestModel {
  final int? trackId;
  final int challengeId;
  final int durationMinutes;
  final String trackDate;
  final String moodFeedback;
  final bool completed;
  final int? caloriesBurned;

  const HabitTrackRequestModel({
    this.trackId,
    required this.challengeId,
    required this.durationMinutes,
    required this.trackDate,
    required this.moodFeedback,
    required this.completed,
    this.caloriesBurned,
  });

  factory HabitTrackRequestModel.fromJson(Map<String, dynamic> json) {
    return HabitTrackRequestModel(
      trackId: json['TRACK_ID'] as int?,
      challengeId: json['CHALLENGE_ID'] as int,
      durationMinutes: json['DURATION_MINUTES'] as int,
      trackDate: json['TRACK_DATE'] as String,
      moodFeedback: json['MOOD_FEEDBACK'] as String? ?? '',
      completed: json['COMPLETED'] as bool,
      caloriesBurned: json['CALORIES_BURNED'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'TRACK_ID': trackId,
      'CHALLENGE_ID': challengeId,
      'DURATION_MINUTES': durationMinutes,
      'TRACK_DATE': trackDate,
      'MOOD_FEEDBACK': moodFeedback,
      'COMPLETED': completed,
      'CALORIES_BURNED': caloriesBurned,
    };
  }
}
