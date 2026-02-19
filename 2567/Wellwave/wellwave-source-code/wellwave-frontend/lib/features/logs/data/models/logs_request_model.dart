class LogsRequestModel {
  final int lid;
  final String logName; 
  final DateTime date;
  final double value;
  final int uid;

  LogsRequestModel({
    required this.lid,
    required this.logName,
    required this.date,
    required this.value,
    required this.uid,
  });

  // Convert LogsRequestModel to JSON format
  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'LID': lid,
      'LOG_NAME': logName,
      'DATE': date.millisecondsSinceEpoch, 
      'VALUE': value,
      'UID': uid,
    };
  }

  factory LogsRequestModel.fromJson(Map<String, dynamic> json) {
  return LogsRequestModel(
    lid: json['LID'] is int
        ? json['LID'] as int
        : int.tryParse(json['LID'] ?? '0') ?? 0, // Handle String to int conversion
    logName: json['LOG_NAME'] ?? "", 
    date: json['DATE'] is int 
        ? DateTime.fromMillisecondsSinceEpoch(json['DATE']) 
        : DateTime.tryParse(json['DATE']) ?? DateTime.now(), // Handle date as String
    value: (json['VALUE'] is num) 
        ? (json['VALUE'] as num).toDouble() 
        : double.tryParse(json['VALUE'] ?? '0.0') ?? 0.0, // Handle String to double
    uid: json['UID'] is int
        ? json['UID'] as int
        : int.tryParse(json['UID'] ?? '0') ?? 0, // Handle String to int conversion
  );
}


  // Method for editing logs request
  Map<String, dynamic> toEditLogsRequestJson(String isShowToEmployee) {
    return {
      'LID': lid, // Include id if needed
      'LOG_NAME': logName,
      'DATE': date.toIso8601String(), // Use ISO format for date
      'VALUE': value,
      'UID': uid,
    };
  }
}
