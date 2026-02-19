class QuestRequestModel {
  final List<QuestItemModel> quests;

  const QuestRequestModel({
    required this.quests,
  });

  factory QuestRequestModel.fromJson(List<dynamic> json) {
    return QuestRequestModel(
      quests: json.map((item) => QuestItemModel.fromJson(item)).toList(),
    );
  }
}

class QuestItemModel {
  final int qid;
  final String? imgUrl;
  final String title;
  final int dayDuration;
  final String description;
  final String relatedHabitCategory;
  final String? exerciseType;
  final String trackingType;
  final int expRewards;
  final int gemRewards;
  final int rqTargetValue;
  final String questType;
  final String createdAt;
  final String updatedAt;
  final bool isActive;
  final QuestProgressInfoModel? progressInfo;

  const QuestItemModel({
    required this.qid,
    this.imgUrl,
    required this.title,
    required this.dayDuration,
    required this.description,
    required this.relatedHabitCategory,
    this.exerciseType,
    required this.trackingType,
    required this.expRewards,
    required this.gemRewards,
    required this.rqTargetValue,
    required this.questType,
    required this.createdAt,
    required this.updatedAt,
    required this.isActive,
    this.progressInfo,
  });

  factory QuestItemModel.fromJson(Map<String, dynamic> json) {
    return QuestItemModel(
      qid: json['QID'] ?? 0,
      imgUrl: json['IMG_URL'],
      title: json['TITLE'] ?? '',
      dayDuration: json['DAY_DURATION'] ?? 0,
      description: json['DESCRIPTION'] ?? '',
      relatedHabitCategory: json['RELATED_HABIT_CATEGORY'] ?? '',
      exerciseType: json['EXERCISE_TYPE'],
      trackingType: json['TRACKING_TYPE'] ?? '',
      expRewards: json['EXP_REWARDS'] ?? 0,
      gemRewards: json['GEM_REWARDS'] ?? 0,
      rqTargetValue: json['RQ_TARGET_VALUE'] ?? 0,
      questType: json['QUEST_TYPE'] ?? '',
      createdAt: json['CREATED_AT'] ?? '',
      updatedAt: json['UPDATED_AT'] ?? '',
      isActive: json['isActive'] ?? false,
      progressInfo: json['progressInfo'] != null
          ? QuestProgressInfoModel.fromJson(json['progressInfo'])
          : null,
    );
  }
}

class QuestProgressInfoModel {
  final String startDate;
  final String endDate;
  final int currentValue;
  final int targetValue;
  final num progressPercentage;
  final int daysLeft;

  const QuestProgressInfoModel({
    required this.startDate,
    required this.endDate,
    required this.currentValue,
    required this.targetValue,
    required this.progressPercentage,
    required this.daysLeft,
  });

  factory QuestProgressInfoModel.fromJson(Map<String, dynamic> json) {
    return QuestProgressInfoModel(
      startDate: json['startDate'] ?? '',
      endDate: json['endDate'] ?? '',
      currentValue: json['currentValue'] ?? 0,
      targetValue: json['targetValue'] ?? 0,
      progressPercentage: json['progressPercentage'] ?? 0.0,
      daysLeft: json['daysLeft'] ?? 0,
    );
  }
}
