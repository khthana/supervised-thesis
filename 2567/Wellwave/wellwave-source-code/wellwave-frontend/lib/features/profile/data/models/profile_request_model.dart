class ProfileRequestModel {
  final int uid;
  final String imageUrl;
  final String username;
  final int yearOfBirth;
  final bool gender;
  final num height;
  final num weight;
  final int gem;
  final int exp;
  final int? stepPerWeek;
  final int? exercisePerWeek;
  final UserLeague? userLeague;
  final LogInStats? loginStats;
  final WeeklyGoal? weeklyGoal;
  final DateTime? createAt;

  ProfileRequestModel({
    required this.uid,
    required this.imageUrl,
    required this.username,
    required this.yearOfBirth,
    required this.gender,
    required this.height,
    required this.weight,
    required this.exp,
    required this.gem,
    this.loginStats,
    this.userLeague,
    this.stepPerWeek,
    this.exercisePerWeek,
    this.weeklyGoal,
    this.createAt,
  });

  ProfileRequestModel copyWith(
      {String? imageUrl,
      String? username,
      int? yearOfBirth,
      bool? gender,
      double? height,
      double? weight,
      int? userGoal,
      String? email,
      int? stepPerWeek,
      int? exercisePerWeek,
      DateTime? createAt}) {
    return ProfileRequestModel(
      imageUrl: imageUrl ?? this.imageUrl,
      username: username ?? this.username,
      yearOfBirth: yearOfBirth ?? this.yearOfBirth,
      gender: gender ?? this.gender,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      uid: uid,
      exp: exp,
      gem: gem,
      stepPerWeek: stepPerWeek,
      exercisePerWeek: exercisePerWeek,
      createAt: createAt,
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
      'UID': uid,
      'EXP': exp,
      'GEM': gem,
      'USER_GOAL_STEP_WEEK': stepPerWeek,
      'USER_GOAL_EX_TIME_WEEK': exercisePerWeek,
      'CREATE_AT': createAt,
    };
  }

  factory ProfileRequestModel.fromJson(Map<String, dynamic> json) {
    return ProfileRequestModel(
      uid: json['userInfo']['UID'] as int,
      imageUrl: json['userInfo']['IMAGE_URL'] as String? ?? "",
      username: json['userInfo']['USERNAME'] as String? ?? "",
      yearOfBirth: json['userInfo']['YEAR_OF_BIRTH'] as int? ?? 0,
      gender: json['userInfo']['GENDER'] as bool? ?? false,
      height: (json['userInfo']['HEIGHT'] as num?)?.toDouble() ?? 0.0,
      weight: (json['userInfo']['WEIGHT'] as num?)?.toDouble() ?? 0.0,
      exp: json['userInfo']['EXP'] as int? ?? 0,
      gem: json['userInfo']['GEM'] as int? ?? 0,
      stepPerWeek: json['userInfo']['USER_GOAL_STEP_WEEK'] as int? ?? 0,
      exercisePerWeek: json['userInfo']['USER_GOAL_EX_TIME_WEEK'] as int? ?? 0,
      userLeague: json['userLeague'] != null
          ? UserLeague.fromJson(json['userLeague'])
          : null,
      loginStats: json['loginStats'] != null
          ? LogInStats.fromJson(json['loginStats'])
          : null,
      weeklyGoal: json['weeklyGoal'] != null
          ? WeeklyGoal.fromJson(json['weeklyGoal'])
          : null,
      createAt: json['userInfo']['createAt'] != null
          ? DateTime.parse(json['userInfo']['createAt'])
          : null,
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
      'UID': uid,
      'EXP': exp,
      'GEM': gem,
      'USER_GOAL_STEP_WEEK': stepPerWeek,
      'USER_GOAL_EX_TIME_WEEK': exercisePerWeek,
    };
  }
}

class UserLeague {
  final int uid;
  final int currentLeague;

  UserLeague({
    required this.uid,
    required this.currentLeague,
  });

  factory UserLeague.fromJson(Map<String, dynamic> json) {
    return UserLeague(
      uid: json['UID'] as int? ?? 0,
      currentLeague: _mapLeagueToInt(json['CURRENT_LEAGUE'] ?? ''),
    );
  }

  static int _mapLeagueToInt(String league) {
    switch (league.toLowerCase()) {
      case 'bronze':
        return 0;
      case 'silver':
        return 1;
      case 'gold':
        return 2;
      case 'diamond':
        return 3;
      case 'emerald':
        return 4;
      default:
        return -1;
    }
  }
}

class WeeklyGoal {
  final Progress progress;
  final int daysLeft;

  WeeklyGoal({required this.progress, required this.daysLeft});

  factory WeeklyGoal.fromJson(Map<String, dynamic> json) {
    return WeeklyGoal(
      progress: Progress.fromJson(json['progress']),
      daysLeft: json['daysLeft'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'progress': progress.toJson(),
      'daysLeft': daysLeft,
    };
  }
}

class Progress {
  final Goal step;
  final Goal exerciseTime;
  final Goal mission;

  Progress(
      {required this.step, required this.exerciseTime, required this.mission});

  factory Progress.fromJson(Map<String, dynamic> json) {
    return Progress(
      step: Goal.fromJson(json['step']),
      exerciseTime: Goal.fromJson(json['exercise_time']),
      mission: Goal.fromJson(json['mission']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'step': step.toJson(),
      'exercise_time': exerciseTime.toJson(),
      'mission': mission.toJson(),
    };
  }
}

class Goal {
  final int current;
  final int goal;

  Goal({required this.current, required this.goal});

  factory Goal.fromJson(Map<String, dynamic> json) {
    return Goal(
      current: json['current'],
      goal: json['goal'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'current': current,
      'goal': goal,
    };
  }
}

class LogInStats {
  final List<CheckInStats> checkInStats;
  final OverAllStats? overAllStats;

  LogInStats({
    required this.checkInStats,
    required this.overAllStats,
  });

  factory LogInStats.fromJson(Map<String, dynamic> json) {
    return LogInStats(
      checkInStats: (json['checkInStats'] as List<dynamic>?)
              ?.map((e) => CheckInStats.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      overAllStats: json['overallStats'] != null
          ? OverAllStats.fromJson(json['overallStats'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'checkInStats': checkInStats.map((e) => e.toJson()).toList(),
      'overallStats': overAllStats?.toJson(),
    };
  }
}

class CheckInStats {
  final int day;
  final bool isLogin;
  final int rewardAmount;

  CheckInStats({
    required this.day,
    required this.isLogin,
    required this.rewardAmount,
  });

  factory CheckInStats.fromJson(Map<String, dynamic> json) {
    return CheckInStats(
      day: json['day'] as int,
      isLogin: json['isLogin'] as bool,
      rewardAmount: json['rewardAmount'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'isLogin': isLogin,
      'rewardAmount': rewardAmount,
    };
  }
}

class OverAllStats {
  final int uid;
  final String? streakStartDate;
  final String? lastLoginDate;
  final int currentStreak;
  final int longestStreak;
  final int totalPointsEarned;

  OverAllStats({
    required this.uid,
    this.streakStartDate,
    this.lastLoginDate,
    required this.currentStreak,
    required this.longestStreak,
    required this.totalPointsEarned,
  });

  factory OverAllStats.fromJson(Map<String, dynamic> json) {
    return OverAllStats(
      uid: json['UID'] as int,
      streakStartDate: json['STREAK_START_DATE'] as String?,
      lastLoginDate: json['LAST_LOGIN_DATE'] as String?,
      currentStreak: json['CURRENT_STREAK'] as int,
      longestStreak: json['LONGEST_STREAK'] as int,
      totalPointsEarned: json['TOTAL_POINTS_EARNED'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'UID': uid,
      'STREAK_START_DATE': streakStartDate,
      'LAST_LOGIN_DATE': lastLoginDate,
      'CURRENT_STREAK': currentStreak,
      'LONGEST_STREAK': longestStreak,
      'TOTAL_POINTS_EARNED': totalPointsEarned,
    };
  }
}

class UsersAchievement {
  final String? imgPath;
  final String? achTitle;
  final DateTime? dateAcheived;

  UsersAchievement({
    this.imgPath,
    this.achTitle,
    this.dateAcheived,
  });

  factory UsersAchievement.fromJson(Map<String, dynamic> json) {
    return UsersAchievement(
      imgPath: json['imgPath'] as String?,
      achTitle: json['achTitle'] as String?,
      dateAcheived: json['dateAcheived'] != null
          ? DateTime.parse(json['dateAcheived'])
          : null,
    );
  }
}
