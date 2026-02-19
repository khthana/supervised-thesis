class DrinkRangeNotificationResponseModel {
  final String? settingType;
  final bool isActive;
  final DrinkRangeSettingDetail setting;

  DrinkRangeNotificationResponseModel({
    this.settingType,
    required this.isActive,
    required this.setting,
  });

  factory DrinkRangeNotificationResponseModel.fromJson(
      Map<String, dynamic> json) {
    return DrinkRangeNotificationResponseModel(
      settingType: json['settingType'] ?? 'WATER_RANGE',
      isActive: json['isActive'] as bool,
      setting: DrinkRangeSettingDetail.fromJson(json['setting']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'settingType': settingType,
      'isActive': isActive,
      'setting': setting.toJson(),
    };
  }
}

class DrinkRangeSettingDetail {
  final int? uid;
  final String? notificationType;
  final String startTime;
  final String endTime;
  final int intervalMinute;

  DrinkRangeSettingDetail({
    this.uid,
    this.notificationType,
    required this.startTime,
    required this.endTime,
    required this.intervalMinute,
  });

  factory DrinkRangeSettingDetail.fromJson(Map<String, dynamic> json) {
    return DrinkRangeSettingDetail(
      uid: json['UID'] as int,
      notificationType: json['NOTIFICATION_TYPE'] ?? 'WATER_RANGE',
      startTime: json['START_TIME'] ?? '08:00',
      endTime: json['END_TIME'] ?? '20:00',
      intervalMinute: json['INTERVAL_MINUTES'] ?? 60,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'UID': uid,
      'NOTIFICATION_TYPE': notificationType,
      'START_TIME': startTime,
      'END_TIME': endTime,
      'INTERVAL_MINUTES': intervalMinute
    };
  }
}
