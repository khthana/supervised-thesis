import 'package:wellwave_frontend/features/home/data/models/progress.dart';

final List<Map<String, dynamic>> progressMockData = [
  {
    "id": 1,
    "progress": 0.5,
    "taskDescription": "ทานโปรตีนจากเนื้อสัตว์สำหรับมื้อเช้า",
    "rewardType": "EXP",
    "activityType": "sleep",
    "rewards": 15,
    "totalDays": 7,
    "startDate": "2025-02-03 10:07:37.524796",
  },
  {
    "id": 2,
    "progress": 0.7,
    "taskDescription": "Description of progress 2",
    "rewardType": "EXP",
    "activityType": "exercise",
    "rewards": 15,
    "totalDays": 5,
    "startDate": "2025-01-21 10:07:37.524796",
  },
  {
    "id": 3,
    "progress": 0.7,
    "taskDescription":
        "Description of progressDescription of progress Description of progress ",
    "rewardType": "EXP",
    "activityType": "exercise",
    "rewards": 15,
    "totalDays": 10,
    "startDate": "2025-01-15 10:07:37.524796",
    "dailyCompletion": {
      "2025-01-15": true,
      "2025-01-16": false,
      "2025-01-17": true,
      "2025-01-18": true,
      "2025-01-19": false,
      "2025-01-20": true,
      "2025-01-21": false,
      "2025-01-22": true,
      "2025-01-23": true,
    }
  },
];

List<Progress> getMockProgressData() {
  return progressMockData.map((data) => Progress.fromJson(data)).toList();
}
