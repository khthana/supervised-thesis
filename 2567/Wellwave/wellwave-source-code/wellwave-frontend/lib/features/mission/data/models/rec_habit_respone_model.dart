class RecHabitResponseModel {
  final List<RecHabitItemModel> recommendations;

  const RecHabitResponseModel({
    required this.recommendations,
  });

  factory RecHabitResponseModel.fromJson(List<dynamic> json) {
    return RecHabitResponseModel(
      recommendations:
          json.map((item) => RecHabitItemModel.fromJson(item)).toList(),
    );
  }
}

class RecHabitItemModel {
  final HabitDetailModel habit;
  final ScoreInfoModel scoreInfo;

  const RecHabitItemModel({
    required this.habit,
    required this.scoreInfo,
  });

  factory RecHabitItemModel.fromJson(Map<String, dynamic> json) {
    return RecHabitItemModel(
      habit: HabitDetailModel.fromJson(json['habit']),
      scoreInfo: ScoreInfoModel.fromJson(json['scoreInfo']),
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
  final bool isDaily;
  final String thumbnailUrl;
  final ConditionsModel conditions;

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
    required this.isDaily,
    required this.thumbnailUrl,
    required this.conditions,
  });

  factory HabitDetailModel.fromJson(Map<String, dynamic> json) {
    return HabitDetailModel(
      hid: json['HID'] ?? 0,
      title: json['TITLE'] ?? '',
      description: json['DESCRIPTION'] ?? '',
      advice: json['ADVICE'] ?? '',
      category: json['CATEGORY'] ?? '',
      exerciseType: json['EXERCISE_TYPE'],
      trackingType: json['TRACKING_TYPE'] ?? '',
      expReward: json['EXP_REWARD'] ?? 0,
      gemReward: json['GEM_REWARD'],
      defaultDailyMinuteGoal: json['DEFAULT_DAILY_MINUTE_GOAL'],
      defaultDaysGoal: json['DEFAULT_DAYS_GOAL'] ?? 0,
      isDaily: json['IS_DAILY'] ?? false,
      thumbnailUrl: json['THUMBNAIL_URL'] ?? '',
      conditions: ConditionsModel.fromJson(json['CONDITIONS'] ?? {}),
    );
  }
}

class ConditionsModel {
  final bool diabetesCondition;
  final bool obesityCondition;
  final bool dyslipidemiaCondition;
  final bool hypertensionCondition;

  const ConditionsModel({
    required this.diabetesCondition,
    required this.obesityCondition,
    required this.dyslipidemiaCondition,
    required this.hypertensionCondition,
  });

  factory ConditionsModel.fromJson(Map<String, dynamic> json) {
    return ConditionsModel(
      diabetesCondition: json['DIABETES_CONDITION'] ?? false,
      obesityCondition: json['OBESITY_CONDITION'] ?? false,
      dyslipidemiaCondition: json['DYSLIPIDEMIA_CONDITION'] ?? false,
      hypertensionCondition: json['HYPERTENSION_CONDITION'] ?? false,
    );
  }
}

class ScoreInfoModel {
  final double score;
  final ScoreDetailsModel scores;

  const ScoreInfoModel({
    required this.score,
    required this.scores,
  });

  factory ScoreInfoModel.fromJson(Map<String, dynamic> json) {
    return ScoreInfoModel(
      score: (json['score'] ?? 0.0).toDouble(),
      scores: ScoreDetailsModel.fromJson(json['scores']),
    );
  }
}

class ScoreDetailsModel {
  final double contentBased;
  final double collaborative;
  final double ruleBased;
  final double popularity;

  const ScoreDetailsModel({
    required this.contentBased,
    required this.collaborative,
    required this.ruleBased,
    required this.popularity,
  });

  factory ScoreDetailsModel.fromJson(Map<String, dynamic> json) {
    return ScoreDetailsModel(
      contentBased: (json['contentBased'] ?? 0.0).toDouble(),
      collaborative: (json['collaborative'] ?? 0.0).toDouble(),
      ruleBased: (json['ruleBased'] ?? 0.0).toDouble(),
      popularity: (json['popularity'] ?? 0.0).toDouble(),
    );
  }
}
