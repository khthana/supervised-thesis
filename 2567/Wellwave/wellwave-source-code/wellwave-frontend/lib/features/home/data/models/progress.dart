class Progress {
  final int id;
  final double progress;
  final String taskDescription;
  final String rewardType;
  final String activityType;
  final int rewards;
  final int totalDays;
  final DateTime startDate;
  final Map<String, dynamic>? dailyCompletion;

  Progress({
    required this.id,
    required this.progress,
    required this.taskDescription,
    required this.rewardType,
    required this.rewards,
    required this.totalDays,
    required this.startDate,
    required this.activityType,
    this.dailyCompletion,
  });

  factory Progress.fromJson(Map<String, dynamic> json) {
    return Progress(
      id: json['id'],
      progress: json['progress'],
      taskDescription: json['taskDescription'],
      rewardType: json['rewardType'],
      activityType: json['activityType'],
      rewards: json['rewards'],
      totalDays: json['totalDays'],
      startDate: DateTime.parse(json['startDate']),
      dailyCompletion:
          json['dailyCompletion'] ?? {}, // กำหนดค่าเริ่มต้นเป็น {} หากเป็น null
    );
  }
}
