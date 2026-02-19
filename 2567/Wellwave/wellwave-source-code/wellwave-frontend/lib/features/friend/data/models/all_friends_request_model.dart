class AllFriendsRequestModel {
  final List<UserProfile> data;
  final Meta meta;

  AllFriendsRequestModel({
    required this.data,
    required this.meta,
  });

  factory AllFriendsRequestModel.fromJson(Map<String, dynamic> json) {
    return AllFriendsRequestModel(
      data: (json['data'] as List)
          .map((profile) => UserProfile.fromJson(profile))
          .toList(),
      meta: Meta.fromJson(json['meta']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'data': data.map((profile) => profile.toJson()).toList(),
      'meta': meta.toJson(),
    };
  }
}

class UserProfile {
  final int uid;
  final String? username;
  final String? imageUrl;
  final String? lastLogin;
  final int steps;
  final int sleepHours;
  final int exp;
  final int gem;
  final String league;

  UserProfile({
    required this.uid,
    this.username,
    this.imageUrl,
    this.lastLogin,
    required this.steps,
    required this.sleepHours,
    required this.exp,
    required this.gem,
    required this.league,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      uid: json['UID'] ?? -1,
      username: json['USERNAME'],
      imageUrl: json['IMAGE_URL'],
      lastLogin: json['LAST_LOGIN'],
      steps: json['STEPS'] ?? 0,
      sleepHours: json['SLEEP_HOURS'] ?? 0,
      exp: json['EXP'] ?? 0,
      gem: json['GEM'] ?? 0,
      league: json['LEAGUE'] ?? 'none',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'UID': uid,
      'USERNAME': username,
      'IMAGE_URL': imageUrl,
      'LAST_LOGIN': lastLogin,
      'STEPS': steps,
      'SLEEP_HOURS': sleepHours,
      'EXP': exp,
      'GEM': gem,
      'LEAGUE': league,
    };
  }
}

class Meta {
  final int total;

  Meta({
    required this.total,
  });

  factory Meta.fromJson(Map<String, dynamic> json) {
    return Meta(
      total: json['total'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'total': total,
    };
  }
}
