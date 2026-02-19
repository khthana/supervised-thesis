class LogsWeightRequestModel {
  final DateTime date;
  final double value;

  LogsWeightRequestModel({
    required this.date,
    required this.value,
  });

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'DATE': date.millisecondsSinceEpoch,
      'VALUE': value,
    };
  }

  factory LogsWeightRequestModel.fromJson(Map<String, dynamic> json) {
    return LogsWeightRequestModel(
      date: json['DATE'] is int
          ? DateTime.fromMillisecondsSinceEpoch(json['DATE'])
          : DateTime.tryParse(json['DATE']) ??
              DateTime.now(), // Handle date as String
      value: (json['VALUE'] is num)
          ? (json['VALUE'] as num).toDouble()
          : double.tryParse(json['VALUE'] ?? '0.0') ??
              0.0, // Handle String to double
    );
  }

  // Method for editing logs request
  Map<String, dynamic> toEditLogsRequestJson(String isShowToEmployee) {
    return {
      'DATE': date.toIso8601String(), // Use ISO format for date
      'VALUE': value,
    };
  }
}
