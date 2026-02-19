class HealthAssessmentPersonalDataRequestModel {
  final String? imageUrl;
  final String? username;
  final int? yearOfBirth;
  final bool? gender;
  final double? height;
  final double? weight;
  final int? userGoal;
  final String? email;
  final int? userGoalStepWeek;
  final int? userGoalExTimeWeek;

  HealthAssessmentPersonalDataRequestModel({
    this.imageUrl,
    this.username,
    this.yearOfBirth,
    this.gender,
    this.height,
    this.weight,
    this.userGoal,
    this.email,
    this.userGoalStepWeek,
    this.userGoalExTimeWeek,
  });

  HealthAssessmentPersonalDataRequestModel copyWith({
    String? imageUrl,
    String? username,
    int? yearOfBirth,
    bool? gender,
    double? height,
    double? weight,
    int? userGoal,
    int? userGoalStepWeek,
    int? userGoalExTimeWeek,
    String? email,
  }) {
    return HealthAssessmentPersonalDataRequestModel(
      imageUrl: imageUrl ?? this.imageUrl,
      username: username ?? this.username,
      yearOfBirth: yearOfBirth ?? this.yearOfBirth,
      gender: gender ?? this.gender,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      userGoal: userGoal ?? this.userGoal,
      userGoalStepWeek: userGoalStepWeek ?? this.userGoalStepWeek,
      userGoalExTimeWeek: userGoalExTimeWeek ?? this.userGoalExTimeWeek,
      email: email ?? this.email,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'IMAGE_URL': imageUrl,
      'USERNAME': username,
      'YEAR_OF_BIRTH': yearOfBirth,
      'GENDER': gender,
      'HEIGHT': height,
      'WEIGHT': weight,
      'USER_GOAL': userGoal,
      'USER_GOAL_EX_TIME_WEEK': userGoalExTimeWeek,
      'USER_GOAL_STEP_WEEK': userGoalStepWeek,
      'EMAIL': email,
    };
  }

  factory HealthAssessmentPersonalDataRequestModel.fromJson(
      Map<String, dynamic> json) {
    return HealthAssessmentPersonalDataRequestModel(
      imageUrl: json['IMAGE_URL'] as String? ?? "",
      username: json['username'] as String? ?? "",
      yearOfBirth: json['yearOfBirth'] as int? ?? 0,
      gender: json['gender'] as bool? ?? false,
      height: (json['height'] as num?)?.toDouble() ?? 0.0,
      weight: (json['weight'] as num?)?.toDouble() ?? 0.0,
      userGoal: json['userGoal'] as int? ?? 0,
      userGoalExTimeWeek: json['userGoalExTimeWeek'] as int? ?? 0,
      userGoalStepWeek: json['userGoalStepWeek'] as int? ?? 0,
      email: json['email'] as String? ?? "",
    );
  }

  Map<String, dynamic> toEditLogsRequestJson(String isShowToEmployee) {
    return {
      'IMAGE_URL': imageUrl,
      'USERNAME': username,
      'YEAR_OF_BIRTH': yearOfBirth,
      'GENDER': gender,
      'HEIGHT': height,
      'WEIGHT': weight,
      'USER_GOAL': userGoal,
      'USER_GOAL_EX_TIME_WEEK': userGoalExTimeWeek,
      'USER_GOAL_STEP_WEEK': userGoalStepWeek,
      'EMAIL': email,
    };
  }
}
