class DailyTaskListModel {
  final List<DailyTaskItemModel> data;
  final DailyTaskMetaModel meta;

  const DailyTaskListModel({
    required this.data,
    required this.meta,
  });

  factory DailyTaskListModel.fromJson(Map<String, dynamic> json) {
    return DailyTaskListModel(
      data: (json['data'] as List)
          .map((e) => DailyTaskItemModel.fromJson(e))
          .toList(),
      meta: DailyTaskMetaModel.fromJson(json['meta']),
    );
  }
}

class DailyTaskItemModel {
  final int challengeId;
  final int hid;
  final String title;
  final String thumbnailUrl;
  final int expReward;

  const DailyTaskItemModel({
    required this.challengeId,
    required this.hid,
    required this.title,
    required this.thumbnailUrl,
    required this.expReward,
  });

  factory DailyTaskItemModel.fromJson(Map<String, dynamic> json) {
    return DailyTaskItemModel(
      challengeId: (json['CHALLENGE_ID'] as num).toInt(),
      hid: (json['HID'] as num).toInt(),
      title: json['TITLE'] ?? '',
      thumbnailUrl: json['THUMBNAIL_URL'] ?? '',
      expReward: (json['EXP_REWARD'] as num).toInt(),
    );
  }
}

class DailyTaskMetaModel {
  final int total;

  const DailyTaskMetaModel({required this.total});

  factory DailyTaskMetaModel.fromJson(Map<String, dynamic> json) {
    return DailyTaskMetaModel(total: json['total'] ?? 0);
  }
}
