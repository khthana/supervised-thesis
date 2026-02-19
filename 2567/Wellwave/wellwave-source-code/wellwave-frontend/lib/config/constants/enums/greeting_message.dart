import 'dart:math';

class GreetingTimeText {
  static String getGreetingMessage() {
    final now = DateTime.now();
    final hour = now.hour;

    if (hour >= 5 && hour < 12) {
      return 'อรุณสวัสดิ์';
    } else if (hour >= 12 && hour < 18) {
      return 'สวัสดีตอนบ่าย';
    } else {
      return 'สวัสดีตอนกลางคืน';
    }
  }
}

class DailyMessage {
  final List<String> _messages = [
    'ทุกก้าวเล็ก ๆ ที่ทำสำคัญเสมอ!',
    'ไม่มีอะไรที่เราทำไม่ได้!',
    'ความสำเร็จเริ่มจากก้าวแรก!',
    'ทุกก้าวคือความสำเร็จ!',
    'พยายามต่อไป ไม่มีคำว่าแพ้!',
    'พัฒนาตัวเองทุกวัน!',
    'สู้ต่อไป อย่าหยุดพัฒนา!',
  ];

  String getMessage() {
    final today = DateTime.now();
    final random = Random(today.day);
    final index = random.nextInt(_messages.length);
    return _messages[index];
  }
}
