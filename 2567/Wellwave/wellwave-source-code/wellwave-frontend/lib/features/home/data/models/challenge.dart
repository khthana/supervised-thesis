class Challenge {
  final int id;
  final String image;
  final String rewardType;
  final int points;
  final String taskDescription;

  Challenge({
    required this.id,
    required this.image,
    required this.rewardType,
    required this.points,
    required this.taskDescription,
  });

  factory Challenge.fromJson(Map<String, dynamic> json) {
    return Challenge(
      id: json['id'],
      image: json['image'],
      rewardType: json['rewardType'],
      points: json['points'],
      taskDescription: json['taskDescription'],
    );
  }
}
