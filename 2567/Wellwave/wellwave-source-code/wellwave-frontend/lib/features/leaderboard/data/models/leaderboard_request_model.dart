class LeaderboardRequestModel {
  final int league;
  final int dayLeft;
  final UserStatsRequestModel userStats;
  final BoardMembersRequestModel boardMembers;

  const LeaderboardRequestModel({
    required this.league,
    required this.dayLeft,
    required this.userStats,
    required this.boardMembers,
  });

  factory LeaderboardRequestModel.fromJson(Map<String, dynamic> json) {
    return LeaderboardRequestModel(
      league: _mapLeagueToInt(json['league'] ?? ''),
      dayLeft: json['date']['dayLeft'] ?? 0,
      userStats: UserStatsRequestModel.fromJson(json['userStats']),
      boardMembers: BoardMembersRequestModel.fromJson(json['boardMembers']),
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
        return -1; // Default case for unknown league names
    }
  }
}

class UserStatsRequestModel {
  final int currentRank;
  final int currentExp;
  final String previousLeague;
  final int? previousRank;
  final UserRequestModel user;

  const UserStatsRequestModel({
    required this.currentRank,
    required this.currentExp,
    required this.previousLeague,
    this.previousRank,
    required this.user,
  });

  factory UserStatsRequestModel.fromJson(Map<String, dynamic> json) {
    return UserStatsRequestModel(
      currentRank: json['CURRENT_RANK'] ?? 0,
      currentExp: json['CURRENT_EXP'] ?? 0,
      previousLeague: json['PREVIOUS_LEAGUE'] ?? '',
      previousRank: json['PREVIOUS_RANK'],
      user: UserRequestModel.fromJson(json['user']),
    );
  }
}

class BoardMembersRequestModel {
  final List<MemberRequestModel> members;
  final int total;

  const BoardMembersRequestModel({
    required this.members,
    required this.total,
  });

  factory BoardMembersRequestModel.fromJson(Map<String, dynamic> json) {
    return BoardMembersRequestModel(
      members: (json['data'] as List)
          .map((e) => MemberRequestModel.fromJson(e))
          .toList(),
      total: json['total'] ?? 0,
    );
  }
}

class MemberRequestModel {
  final int uid;
  final int currentRank;
  final int currentExp;
  final UserRequestModel user;

  const MemberRequestModel({
    required this.uid,
    required this.currentRank,
    required this.currentExp,
    required this.user,
  });

  factory MemberRequestModel.fromJson(Map<String, dynamic> json) {
    return MemberRequestModel(
      uid: json['UID'] ?? 0,
      currentRank: json['CURRENT_RANK'] ?? 0,
      currentExp: json['CURRENT_EXP'] ?? 0,
      user: UserRequestModel.fromJson(json['user']),
    );
  }
}

class UserRequestModel {
  final String? username;
  final String? imageUrl;

  const UserRequestModel({
    this.username,
    this.imageUrl,
  });

  factory UserRequestModel.fromJson(Map<String, dynamic>? json) {
    return UserRequestModel(
      username: json?['USERNAME'],
      imageUrl: json?['IMAGE_URL'],
    );
  }
}
