import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

ThemeData appTheme(BuildContext context) {
  return ThemeData(
      scaffoldBackgroundColor: AppColors.whiteColor,
      appBarTheme: appBarTheme(context),
      navigationBarTheme: navigationBarThemeData(context),
      primaryColor: AppColors.primaryColor,
      primaryColorDark: AppColors.secondaryDarkColor,
      textTheme: textTheme(context));
}

AppBarTheme appBarTheme(BuildContext context) {
  return AppBarTheme(
    color: Colors.transparent,
    elevation: 0,
    centerTitle: true,
    iconTheme: const IconThemeData(color: AppColors.whiteColor),
    titleTextStyle: Theme.of(context).textTheme.titleMedium!.copyWith(
          color: AppColors.primaryColor,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
  );
}

NavigationBarThemeData navigationBarThemeData(BuildContext context) {
  return const NavigationBarThemeData(
    height: 60,
    labelBehavior: NavigationDestinationLabelBehavior.alwaysHide,
    backgroundColor: AppColors.whiteColor,
    indicatorColor: Colors.transparent,
    indicatorShape: InputBorder.none,
  );
}

TextTheme textTheme(BuildContext context) {
  return const TextTheme(
    headlineLarge: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 20,
      color: AppColors.blackColor,
    ),
    headlineMedium: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 17,
      color: AppColors.blackColor,
    ),
    headlineSmall: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 16,
      color: AppColors.blackColor,
    ),
    titleLargeBold: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 34,
      color: AppColors.blackColor,
    ),
    titleLarge: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 28,
      color: AppColors.blackColor,
    ),
    titleMedium: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w400,
      fontSize: 22,
      color: AppColors.blackColor,
    ),
    titleSmall: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 13,
      color: AppColors.blackColor,
    ),
    title320: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w400,
      fontSize: 20,
      color: AppColors.blackColor,
    ),
    titleXL: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 48,
      color: AppColors.blackColor,
    ),
    bodyLarge: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w400,
      fontSize: 28,
      color: AppColors.blackColor,
    ),
    bodyMedium: TextStyle(
      fontFamily: 'NotoSansThai',
      fontSize: 17,
      fontWeight: FontWeight.w400,
    ),
    bodySmall: TextStyle(
      fontFamily: 'NotoSansThai',
      fontSize: 13,
      fontWeight: FontWeight.w400,
    ),
    labelLarge: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 22,
      color: AppColors.blackColor,
    ),
    labelMedium: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 22,
      color: AppColors.blackColor,
    ),
    labelSmall: TextStyle(
      fontFamily: 'NotoSansThai',
      fontWeight: FontWeight.w600,
      fontSize: 12,
      color: AppColors.blackColor,
    ),
    // caption1: TextStyle(
    //   fontFamily: 'NotoSansThai',
    //   fontWeight: FontWeight.w600,
    //   fontSize: 12,
    //   color: AppColors.blackColor,
    // ),
  );
}
