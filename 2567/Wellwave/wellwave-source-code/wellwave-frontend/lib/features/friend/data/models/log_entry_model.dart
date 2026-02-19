class LogEntryModel {
  final int uid;
  final String logName;
  final String date;
  final int value;

  LogEntryModel({
    required this.uid,
    required this.logName,
    required this.date,
    required this.value,
  });

  factory LogEntryModel.fromJson(Map<String, dynamic> json) {
    return LogEntryModel(
      uid: json['UID'] ?? 0,
      logName: json['LOG_NAME'] ?? '',
      date: json['DATE'] ?? '',
      value: json['VALUE'] ?? 0,
    );
  }
}
