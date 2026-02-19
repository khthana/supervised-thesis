class AllArcheivementRequestModel {
  final String achId;
  final String title;
  final String description;
  final List<Levels> levels;

  AllArcheivementRequestModel({
    required this.achId,
    required this.title,
    required this.description,
    required this.levels,
  });

  AllArcheivementRequestModel copyWith({
    String? achId,
    String? title,
    String? description,
    List<Levels>? levels,
  }) {
    return AllArcheivementRequestModel(
      achId: achId ?? this.achId,
      title: title ?? this.title,
      description: description ?? this.description,
      levels: levels ?? this.levels,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      "ACH_ID": achId,
      "TITLE": title,
      "DESCRIPTION": description,
      "levels": levels.map((e) => e.toJson()).toList(),
    };
  }

  factory AllArcheivementRequestModel.fromJson(Map<String, dynamic> json) {
    return AllArcheivementRequestModel(
      achId: json['ACH_ID'] as String,
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
