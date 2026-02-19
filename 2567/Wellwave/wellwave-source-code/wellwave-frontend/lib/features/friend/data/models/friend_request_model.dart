class FriendRequestModel {
  final int uid;
  final String username;
  final String imageUrl;
  final String lastLogin;
  final int exp;
  final int gem;
  final String league;
  final List<Map<String, dynamic>> stepsLog;
  final List<Map<String, dynamic>> sleepLog;

  FriendRequestModel({
    required this.uid,
    required this.username,
    required this.imageUrl,
    required this.lastLogin,
    required this.exp,
    required this.gem,
    required this.league,
    required this.stepsLog,
    required this.sleepLog,
  });

  factory FriendRequestModel.fromJson(Map<String, dynamic> json) {
    print('Parsing JSON: $json'); // Debug log
    return FriendRequestModel(
      uid: json['UID'] ?? 0,
      username: json['USERNAME'] ?? '',
      imageUrl: json['IMAGE_URL'] ?? '',
      lastLogin: json['LAST_LOGIN'] ?? '',
      exp: json['EXP'] ?? 0,
      gem: json['GEM'] ?? 0,
      league: json['LEAGUE'] ?? '',
      stepsLog: List<Map<String, dynamic>>.from(json['STEPS_LOG'] ?? []),
      sleepLog: List<Map<String, dynamic>>.from(json['SLEEP_LOG'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'UID': uid,
      'USERNAME': username,
      'IMAGE_URL': imageUrl,
      'LAST_LOGIN': lastLogin,
      'EXP': exp,
      'GEM': gem,
      'LEAGUE': league,
      'STEPS_LOG': stepsLog,
      'SLEEP_LOG': sleepLog,
    };
  }
}

class LogEntry {
  final int uid;
  final String logName;
  final String date;
  final int value;

  LogEntry({
    required this.uid,
    required this.logName,
    required this.date,
    required this.value,
  });

  factory LogEntry.fromJson(Map<String, dynamic> json) {
    return LogEntry(
      uid: json["UID"] ?? -1,
      logName: json["LOG_NAME"] ?? '',
      date: json["DATE"] ?? '',
      value: json["VALUE"] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'UID': uid,
      'LOG_NAME': logName,
      'DATE': date,
      'VALUE': value,
    };
  }
}
