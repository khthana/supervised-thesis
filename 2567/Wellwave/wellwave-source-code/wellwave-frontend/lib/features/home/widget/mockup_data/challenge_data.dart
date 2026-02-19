import 'package:wellwave_frontend/features/home/data/models/challenge.dart';

final List<Map<String, dynamic>> challengeMockData = [
  {
    "id": 1,
    "image": "AppImages.fireIcon",
    "rewardType": "EXP",
    "points": 10,
    "taskDescription": "ทานโปรตีนจากเนื้อสัตว์สำหรับมื้อเช้า"
  },
  {
    "id": 2,
    "image": "AppImages.fireIcon",
    "rewardType": "EXP",
    "points": 5,
    "taskDescription": "Description of progress 2"
  },
  {
    "id": 3,
    "image": "AppImages.fireIcon",
    "rewardType": "EXP",
    "points": 15,
    "taskDescription": "progress 3"
  },
];

List<Challenge> getMockChallengeData() {
  return challengeMockData.map((data) => Challenge.fromJson(data)).toList();
}
