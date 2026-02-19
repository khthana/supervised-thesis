class MissionNotificationModel {
  final int challengeId;
  final String title;
  final String notiTime;
  final String status;
  final bool isNotificationEnabled;
  final Map<String, bool> weekdaysNoti;

  MissionNotificationModel({
    required this.challengeId,
    required this.title,
    required this.notiTime,
    required this.isNotificationEnabled,
    required this.weekdaysNoti,
    this.status = 'active',
  });

  MissionNotificationModel copyWith({
    int? challengeId,
    String? title,
    String? notiTime,
    bool? isNotificationEnabled,
    String? status,
    Map<String, bool>? weekdaysNoti,
  }) {
    return MissionNotificationModel(
      challengeId: challengeId ?? this.challengeId,
      title: title ?? this.title,
      notiTime: notiTime ?? this.notiTime,
      isNotificationEnabled:
          isNotificationEnabled ?? this.isNotificationEnabled,
      weekdaysNoti: weekdaysNoti ?? this.weekdaysNoti,
      status: status ?? this.status,
    );
  }

  factory MissionNotificationModel.fromJson(Map<String, dynamic> json) {
    return MissionNotificationModel(
      isNotificationEnabled: json['IS_NOTIFICATION_ENABLED'] ?? false,
      title: json['habits']?['TITLE'] ?? '',
      notiTime: json['NOTI_TIME'] ?? '',
      weekdaysNoti: Map<String, bool>.from(json['WEEKDAYS_NOTI'] ?? {}),
      challengeId: json['CHALLENGE_ID'] ?? 0,
      status: json['STATUS'] ?? '',
    );
  }
}
