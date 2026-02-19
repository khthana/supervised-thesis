import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class DiseaseCard extends StatelessWidget {
  final String svgAsset; // ใช้สำหรับ SVG ไฟล์
  final String title;
  final TextStyle? textStyle;
  final VoidCallback? onTap;
  const DiseaseCard({
    Key? key,
    required this.svgAsset, // เปลี่ยนจาก IconData เป็น String
    required this.title,
    this.textStyle,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: 80, // กำหนดความกว้างเท่ากัน
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.whiteColor, // สีพื้นหลัง
            borderRadius: BorderRadius.circular(12), // มุมโค้งด้านบน
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.25), // สีและความโปร่งแสงของเงา
                spreadRadius: 2, // ความกว้างของเงา
                blurRadius: 8, // ระยะเบลอของเงา
                offset: Offset(0, 4), // ตำแหน่งของเงา (x, y)
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset(
                  svgAsset,
                  height: 60, // กำหนดขนาด SVG
                  width: 60,
                ),
                const Spacer(),
                // const SizedBox(height: 8), // ระยะห่างระหว่างไอคอนกับข้อความ
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: textStyle ?? Theme.of(context).textTheme.caption2,
                ),
                const Spacer(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
