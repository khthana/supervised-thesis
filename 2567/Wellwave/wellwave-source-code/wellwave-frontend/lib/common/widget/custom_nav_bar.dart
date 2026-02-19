import 'package:flutter/material.dart';
import 'package:wellwave_frontend/common/widget/custom_nav_bar_item.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
class CustomNavigationBar extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemTapped;

  const CustomNavigationBar({
    Key? key,
    required this.selectedIndex,
    required this.onItemTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          CustomNavigationBarItem(
            index: 0,
            selectedIndex: selectedIndex,
            iconAssetName: AppImages.homeIcon,
            iconActiveAssetName: AppImages.homeIconActive,
            width: 24,
            height: 24,
            showDot: true,
            onItemTapped: onItemTapped,
          ),
          CustomNavigationBarItem(
            index: 1,
            selectedIndex: selectedIndex,
            iconAssetName: AppImages.logIcon,
            iconActiveAssetName: AppImages.logIconActive,
            width: 24,
            height: 24,
            showDot: true,
            onItemTapped: onItemTapped,
          ),
          CustomNavigationBarItem(
            index: 2,
            selectedIndex: selectedIndex,
            iconAssetName: AppImages.missionIcon,
            iconActiveAssetName: AppImages.missionIcon,
            width: 56,
            height: 56,
            showDot: false,
            onItemTapped: onItemTapped,
          ),
          CustomNavigationBarItem(
            index: 3,
            selectedIndex: selectedIndex,
            iconAssetName: AppImages.friendIcon,
            iconActiveAssetName: AppImages.friendIconActive,
            width: 24,
            height: 24,
            showDot: true,
            onItemTapped: onItemTapped,
          ),
          CustomNavigationBarItem(
            index: 4,
            selectedIndex: selectedIndex,
            iconAssetName: AppImages.articleIcon,
            iconActiveAssetName: AppImages.articleIconActive,
            width: 24,
            height: 24,
            showDot: true,
            onItemTapped: onItemTapped,
          ),
        ],
      ),
    );
  }
}
