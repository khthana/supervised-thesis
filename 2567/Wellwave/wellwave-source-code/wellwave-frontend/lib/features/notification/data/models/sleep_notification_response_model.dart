class SleepNotificationResponseModel {
  final String? settingType;
  final bool isActive;
  final SettingDetail setting;

  SleepNotificationResponseModel({
    this.settingType,
    required this.isActive,
    required this.setting,
  });

  factory SleepNotificationResponseModel.fromJson(Map<String, dynamic> json) {
    return SleepNotificationResponseModel(
      settingType: json['settingType'] ?? 'BEDTIME',
      isActive: json['isActive'] as bool,
      setting: SettingDetail.fromJson(json['setting']),
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

class SettingDetail {
  final int? uid;
  final String? notificationType;
  final String bedtime;
  final String? wakeTime;
  final Map<String, bool> weekdays;

  SettingDetail({
    this.uid,
    this.notificationType,
    required this.bedtime,
    this.wakeTime,
    required this.weekdays,
  });

  factory SettingDetail.fromJson(Map<String, dynamic> json) {
    return SettingDetail(
      uid: json['UID'] as int,
      notificationType: json['NOTIFICATION_TYPE'] ?? 'BEDTIME',
      bedtime: json['BEDTIME'] ?? '',
      wakeTime: json['WAKE_TIME'] ?? '',
      weekdays: Map<String, bool>.from(json['WEEKDAYS'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'UID': uid,
      'NOTIFICATION_TYPE': notificationType,
      'BEDTIME': bedtime,
      'WAKE_TIME': wakeTime,
      'WEEKDAYS': weekdays,
    };
  }
}
