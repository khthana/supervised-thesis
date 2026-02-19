class DiseaseModel {
  final int diseaseId;
  final String thName;
  final String engName;

  DiseaseModel({
    required this.diseaseId,
    required this.thName,
    required this.engName,
  });

  factory DiseaseModel.fromJson(Map<String, dynamic> json) {
    return DiseaseModel(
      diseaseId: json['DISEASE_ID'],
      thName: json['TH_NAME'],
      engName: json['ENG_NAME'],
    );
  }
}

class ArticleModel {
  final int aid;
  final String topic;
  final String body;
  final int estimatedReadTime;
  final String? author;
  final String thumbnailUrl;
  final int viewCount;
  final DateTime publishDate;
  final List<DiseaseModel> diseases;

  ArticleModel({
    required this.aid,
    required this.topic,
    required this.body,
    required this.estimatedReadTime,
    this.author,
    required this.thumbnailUrl,
    required this.viewCount,
    required this.publishDate,
    required this.diseases,
  });

  factory ArticleModel.fromJson(Map<String, dynamic> json) {
    return ArticleModel(
      aid: json['AID'] ?? 0,
      topic: json['TOPIC'] ?? '',
      body: json['BODY'] ?? '',
      estimatedReadTime: json['ESTIMATED_READ_TIME'] ?? 0,
      author: json['AUTHOR'],
      thumbnailUrl: json['THUMBNAIL_URL'] ?? '',
      viewCount: json['VIEW_COUNT'] ?? 0,
      publishDate: json['PUBLISH_DATE'] != null
          ? DateTime.parse(json['PUBLISH_DATE'])
          : DateTime.now(),
      diseases: (json['diseases'] as List?)
              ?.map((d) => DiseaseModel.fromJson(d))
              .toList() ??
          [],
    );
  }
}
