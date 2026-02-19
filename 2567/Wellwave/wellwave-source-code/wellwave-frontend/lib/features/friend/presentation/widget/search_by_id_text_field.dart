import 'package:flutter/material.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';

class SearchByIdTextField extends StatefulWidget {
  final TextEditingController controller;

  const SearchByIdTextField({super.key, required this.controller});

  @override
  _SearchByIdTextFieldState createState() => _SearchByIdTextFieldState();
}

class _SearchByIdTextFieldState extends State<SearchByIdTextField> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: widget.controller,
      decoration: InputDecoration(
        hintText: 'เพิ่มเพื่อนด้วยไอดี',
        hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.greyColor,
            ),
        fillColor: AppColors.whiteColor,
        filled: true,
        prefixIcon: const Icon(Icons.search),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8.0),
          borderSide: const BorderSide(
            color: AppColors.greyColor,
            width: 1.0,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8.0),
          borderSide: const BorderSide(
            color: AppColors.greyColor,
            width: 1.0,
          ),
        ),
      ),
      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: AppColors.blackColor,
          ),
    );
  }
}
