class ThaiDateFormatter {
  static const List<String> _thaiMonths = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];

  static const List<String> _thaiDays = [
    'อา',
    'จ',
    'อ',
    'พ',
    'พฤ',
    'ศ',
    'ส',
  ];

  static String formatDateRange(DateTime startDate, DateTime endDate) {
    if (startDate.month == endDate.month && startDate.year == endDate.year) {
      final month = _thaiMonths[startDate.month - 1];
      return '${startDate.day}-${endDate.day} $month';
    } else {
      final startMonth = _thaiMonths[startDate.month - 1];
      final endMonth = _thaiMonths[endDate.month - 1];
      return '${startDate.day} $startMonth - ${endDate.day} $endMonth';
    }
  }

  static String formatSingleDate(DateTime date) {
    final day = date.day;
    final month = _thaiMonths[date.month - 1];
    final year = date.year + 543;
    return '$day $month $year';
  }

  static String getThaiDayName(DateTime date) {
    final dayIndex = date.weekday % 7;
    return _thaiDays[dayIndex];
  }
}
