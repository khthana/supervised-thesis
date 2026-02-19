class DrinkPlanNotificationResponseModel {
  final String? settingType;
  final bool isActive;
  final List<DrinkSettingDetail> setting;

  DrinkPlanNotificationResponseModel({
    this.settingType,
    required this.isActive,
    required this.setting,
  });

  factory DrinkPlanNotificationResponseModel.fromJson(
      Map<String, dynamic> json) {
    return DrinkPlanNotificationResponseModel(
      settingType: json['settingType'] ?? 'WATER_PLAN',
      isActive: json['isActive'] as bool,
      setting: (json['setting'] as List<dynamic>)
          .map((e) => DrinkSettingDetail.fromJson(e))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'settingType': settingType,
      'isActive': isActive,
      'setting': setting.map((e) => e.toJson()).toList(),
    };
  }
}

class DrinkSettingDetail {
  final int? uid;
  final String? notificationType;
  final String notitime;
  final int glassNumber;

  DrinkSettingDetail({
    this.uid,
    this.notificationType,
    required this.notitime,
    required this.glassNumber,
  });

  factory DrinkSettingDetail.fromJson(Map<String, dynamic> json) {
    return DrinkSettingDetail(
      uid: json['UID'] as int,
      notificationType: json['NOTIFICATION_TYPE'] ?? 'WATER_PLAN',
      notitime: json['NOTI_TIME'] as String,
      glassNumber: json['GLASS_NUMBER'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'UID': uid,
      'NOTIFICATION_TYPE': notificationType,
      'NOTI_TIME': notitime,
      'GLASS_NUMBER': glassNumber,
    };
  }
}
