class ExerciseTrendTracker {
  void getExerciseTrend(List<int> data) {
    if (data.length < 8) {
      return;
    }

    String currentTrend = "";
    List<int> streakValues = [data[0]];
    int streakCount = 1;
    List<String> results = [];

    for (int i = 1; i < data.length; i++) {
      if (data[i] > data[i - 1]) {
        if (currentTrend == "down") {
          results.add(
              "ลดลงติดต่อกัน $streakCount สัปดาห์ (${streakValues.join(', ')})");
          streakValues = [data[i - 1]];
          streakCount = 1;
          results.add("สัปดาห์นี้เพิ่มขึ้น (ค่าตัวเลขคือ ${data[i]})");
          currentTrend = "up";
        } else if (currentTrend == "up") {
          streakValues.add(data[i]);
          streakCount++;
        } else {
          currentTrend = "up";
          streakValues.add(data[i]);
          streakCount++;
        }
      } else if (data[i] < data[i - 1]) {
        if (currentTrend == "up") {
          results.add(
              "เพิ่มขึ้นติดต่อกัน $streakCount สัปดาห์ (${streakValues.join(', ')})");
          streakValues = [data[i - 1]];
          streakCount = 1;
          results.add("สัปดาห์นี้ลดลง (ค่าตัวเลขคือ ${data[i]})");
          currentTrend = "down";
        } else if (currentTrend == "down") {
          streakValues.add(data[i]);
          streakCount++;
        } else {
          currentTrend = "down";
          streakValues.add(data[i]);
          streakCount++;
        }
      } else {
        streakValues.add(data[i]);
        streakCount++;
      }

      if (i == data.length - 1) {
        if (currentTrend == "up") {
          if (streakCount == 1) {
            results.add(
                "สัปดาห์นี้เพิ่มขึ้น (ค่าตัวเลขคือ ${streakValues.join(', ')})");
          } else {
            results.add(
                "เพิ่มขึ้นติดต่อกัน $streakCount สัปดาห์ (${streakValues.join(', ')})");
          }
        } else if (currentTrend == "down") {
          if (streakCount == 1) {
            results.add(
                "สัปดาห์นี้ลดลง (ค่าตัวเลขคือ ${streakValues.join(', ')})");
          } else {
            results.add(
                "ลดลงติดต่อกัน $streakCount สัปดาห์ (${streakValues.join(', ')})");
          }
        }
      }
    }
  }
}
