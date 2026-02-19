import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
class CustomNavigationBarItem extends StatelessWidget {
  final int index;
  final int selectedIndex;
  final String iconAssetName;
  final String iconActiveAssetName;
  final double width;
  final double height;
  final bool showDot;
  final Function(int) onItemTapped;

  const CustomNavigationBarItem({
    super.key,
    required this.index,
    required this.selectedIndex,
    required this.iconAssetName,
    required this.iconActiveAssetName,
    required this.width,
    required this.height,
    required this.showDot,
    required this.onItemTapped,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = selectedIndex == index;
    return GestureDetector(
      onTap: () => onItemTapped(index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: width,
            height: height + 20, 
            child: Stack(
              alignment: Alignment.center,
              children: [
                SvgPicture.asset(
                  isSelected ? iconActiveAssetName : iconAssetName,
                  width: width,
                  height: height,
                ),
                if (isSelected && showDot)
                  Positioned(
                    bottom: 0, 
                    child: Container(
                      width: 6, 
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.primaryColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

