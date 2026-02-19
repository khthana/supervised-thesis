class HealthDataStepAndExResponseModel {
  final DateRange dateRange;
  final HealthData data;

  HealthDataStepAndExResponseModel({
    required this.dateRange,
    required this.data,
  });

  factory HealthDataStepAndExResponseModel.fromJson(Map<String, dynamic> json) {
    return HealthDataStepAndExResponseModel(
      dateRange: DateRange.fromJson(json['dateRange']),
      data: HealthData.fromJson(json['data']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'dateRange': dateRange.toJson(),
      'data': data.toJson(),
    };
  }
}

class DateRange {
  final String from;
  final String to;

  DateRange({required this.from, required this.to});

  factory DateRange.fromJson(Map<String, dynamic> json) {
    return DateRange(
      from: json['from'],
      to: json['to'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'from': from,
      'to': to,
    };
  }
}

class HealthData {
  final List<HealthEntry> step;
  final List<HealthEntry> habits;

  HealthData({required this.step, required this.habits});

  factory HealthData.fromJson(Map<String, dynamic> json) {
    return HealthData(
      step: (json['step'] as List).map((e) => HealthEntry.fromJson(e)).toList(),
      habits:
          (json['habits'] as List).map((e) => HealthEntry.fromJson(e)).toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'step': step.map((e) => e.toJson()).toList(),
      'habits': habits.map((e) => e.toJson()).toList(),
    };
  }
}

class HealthEntry {
  final int value;
  final String date;

  HealthEntry({required this.value, required this.date});

  factory HealthEntry.fromJson(Map<String, dynamic> json) {
    return HealthEntry(
      value: json['value'],
      date: json['date'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'value': value,
      'date': date,
    };
  }
}
