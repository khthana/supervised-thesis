class ArcheivementRequestModel {
  final int uid;
  final String achId;
  final int level;
  final bool isRead;
  final Achievement achievement;

  ArcheivementRequestModel({
    required this.uid,
    required this.achId,
    required this.level,
    required this.isRead,
    required this.achievement,
  });

  ArcheivementRequestModel copyWith({
    int? uid,
    String? achId,
    int? level,
    bool? isRead,
    Achievement? achievement,
  }) {
    return ArcheivementRequestModel(
      uid: uid ?? this.uid,
      achId: achId ?? this.achId,
      level: level ?? this.level,
      isRead: isRead ?? this.isRead,
      achievement: achievement ?? this.achievement,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      "UID": uid,
      "ACH_ID": achId,
      "LEVEL": level,
      "IS_READ": isRead,
      "achievement": achievement.toJson(),
    };
  }

  factory ArcheivementRequestModel.fromJson(Map<String, dynamic> json) {
    return ArcheivementRequestModel(
      uid: json['UID'] as int,
      achId: json['ACH_ID'] as String,
      level: json['LEVEL'] as int,
      isRead: json['IS_READ'] as bool,
      achievement: Achievement.fromJson(json['achievement']),
    );
  }
}

class Achievement {
  final String title;
  final String description;
  final List<Levels> levels;

  Achievement({
    required this.title,
    required this.description,
    required this.levels,
  });

  Achievement copyWith({
    String? title,
    String? description,
    List<Levels>? levels,
  }) {
    return Achievement(
      title: title ?? this.title,
      description: description ?? this.description,
      levels: levels ?? this.levels,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      "TITLE": title,
      "DESCRIPTION": description,
      "levels": levels.map((e) => e.toJson()).toList(),
    };
  }

  factory Achievement.fromJson(Map<String, dynamic> json) {
    return Achievement(
      title: json['TITLE'] as String,
      description: json['DESCRIPTION'] as String,
      levels: List<Levels>.from(json['levels'].map((x) => Levels.fromJson(x))),
    );
  }
}

class Levels {
  final int level;
  final String iconUrl;

  Levels({
    required this.level,
    required this.iconUrl,
  });

  Levels copyWith({
    int? level,
    String? iconUrl,
  }) {
    return Levels(
      level: level ?? this.level,
      iconUrl: iconUrl ?? this.iconUrl,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      "LEVEL": level,
      "ICON_URL": iconUrl,
    };
  }

  factory Levels.fromJson(Map<String, dynamic> json) {
    return Levels(
      level: json['LEVEL'] as int,
      iconUrl: json['ICON_URL'] as String,
    );
  }
}
