class GetHistoryModel {
  final HistoryData data;
  final HistoryMeta meta;

  GetHistoryModel({
    required this.data,
    required this.meta,
  });

  factory GetHistoryModel.fromJson(Map<String, dynamic> json) {
    return GetHistoryModel(
      data: HistoryData.fromJson(json['data']),
      meta: HistoryMeta.fromJson(json['meta']),
    );
  }
}

class HistoryData {
  final List<DailyHabit> dailyHabits;
  final List<Habit> habits;
  final List<Quest> quests;

  HistoryData({
    required this.dailyHabits,
    required this.habits,
    required this.quests,
  });

  factory HistoryData.fromJson(Map<String, dynamic> json) {
    return HistoryData(
      dailyHabits: (json['daily_habits'] as List)
          .map((x) => DailyHabit.fromJson(x))
          .toList(),
      habits: (json['habits'] as List).map((x) => Habit.fromJson(x)).toList(),
      quests: (json['quests'] as List).map((x) => Quest.fromJson(x)).toList(),
    );
  }
}

class DailyHabit {
  final String title;
  final String thumbnailUrl;
  final HabitStatus status;

  DailyHabit({
    required this.title,
    required this.thumbnailUrl,
    required this.status,
  });

  factory DailyHabit.fromJson(Map<String, dynamic> json) {
    return DailyHabit(
      title: json['TITLE'],
      thumbnailUrl: json['THUMBNAIL_URL'],
      status: HabitStatus.fromJson(json['STATUS']),
    );
  }
}

class Habit {
  final String title;
  final String thumbnailUrl;
  final HabitStatus status;

  Habit({
    required this.title,
    required this.thumbnailUrl,
    required this.status,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    return Habit(
      title: json['TITLE'],
      thumbnailUrl: json['THUMBNAIL_URL'],
      status: HabitStatus.fromJson(json['STATUS']),
    );
  }
}

class Quest {
  final String title;
  final String thumbnailUrl;
  final String status;

  Quest({
    required this.title,
    required this.thumbnailUrl,
    required this.status,
  });

  factory Quest.fromJson(Map<String, dynamic> json) {
    return Quest(
      title: json['TITLE'],
      thumbnailUrl: json['THUMBNAIL_URL'],
      status: json['STATUS'],
    );
  }
}

class HabitStatus {
  final String habitStatus;
  final bool dailyTrack;

  HabitStatus({
    required this.habitStatus,
    required this.dailyTrack,
  });

  factory HabitStatus.fromJson(Map<String, dynamic> json) {
    return HabitStatus(
      habitStatus: json['HABIT_STATUS'],
      dailyTrack: json['DAILY_TRACK'],
    );
  }
}

class HistoryMeta {
  final DateTime date;
  final int total;

  HistoryMeta({
    required this.date,
    required this.total,
  });

  factory HistoryMeta.fromJson(Map<String, dynamic> json) {
    return HistoryMeta(
      date: DateTime.parse(json['date']),
      total: json['total'],
    );
  }
}
