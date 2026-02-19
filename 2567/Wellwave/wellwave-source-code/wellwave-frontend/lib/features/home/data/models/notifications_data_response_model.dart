class NotificationsDataResponseModel {
  final String message;
  final String from;
  final String imageUrl;
  final String to;
  final String notificationId;
  final bool isRead;
  final DateTime createAt;
  final String appRoute;

  NotificationsDataResponseModel({
    required this.message,
    required this.from,
    this.imageUrl = '',
    this.to = '',
    required this.notificationId,
    required this.isRead,
    required this.createAt,
    required this.appRoute,
  });

  NotificationsDataResponseModel copyWith({
    String? message,
    String? from,
    String? imageUrl,
    String? to,
    String? notificationId,
    bool? isRead,
    DateTime? createAt,
    String? appRoute,
  }) {
    return NotificationsDataResponseModel(
      message: message ?? this.message,
      from: from ?? this.from,
      imageUrl: imageUrl ?? this.imageUrl,
      to: to ?? this.to,
      notificationId: notificationId ?? this.notificationId,
      isRead: isRead ?? this.isRead,
      createAt: createAt ?? this.createAt,
      appRoute: appRoute ?? this.appRoute,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'MESSAGE': message,
      'FROM': from,
      'IMAGE_URL': imageUrl,
      'TO': to,
      'NOTIFICATION_ID': notificationId,
      'IS_READ': isRead,
      'APP_ROUTE': appRoute,
      'CREATE_AT': createAt.toIso8601String(),
    };
  }

  factory NotificationsDataResponseModel.fromJson(Map<String, dynamic> json) {
    return NotificationsDataResponseModel(
      message: json['MESSAGE'] ?? '',
      from: json['FROM'] ?? '',
      imageUrl: json['IMAGE_URL'] ?? '',
      to: json['TO'] ?? '',
      notificationId: json['NOTIFICATION_ID'] ?? '',
      isRead: json['IS_READ'] ?? false,
      createAt: json['CREATE_AT'] != null
          ? DateTime.parse(json['CREATE_AT'])
          : DateTime.now(),
      appRoute: json['APP_ROUTE'] ?? '',
    );
  }
}
