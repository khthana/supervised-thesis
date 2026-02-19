import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';

class MissionHistoryCard extends StatelessWidget {
  final String imagePath;
  final String title;
  final String state;

  const MissionHistoryCard({
    Key? key,
    required this.imagePath,
    required this.title,
    required this.state,
  }) : super(key: key);

  String _getStateText(String state) {
    switch (state.toLowerCase()) {
      case 'active':
        return 'กำลังทำ';
      case 'completed':
        return 'สำเร็จ';
      case 'failed':
        return 'ล้มเหลว';
      case 'canceled':
        return 'ยกเลิก';
      default:
        return state;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: AppColors.tertiaryColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: AppColors.whiteColor,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                '$baseUrl${imagePath}',
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => const Icon(
                  Icons.error,
                  size: 32,
                  color: AppColors.darkGrayColor,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.headlineMedium),
              ],
            ),
          ),
          Text(
            _getStateText(state),
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.blueGrayColor,
                ),
          ),
        ],
      ),
    );
  }
}
