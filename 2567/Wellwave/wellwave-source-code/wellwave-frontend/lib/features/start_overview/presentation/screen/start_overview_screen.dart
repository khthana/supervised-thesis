import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/authentication/presentation/bloc/auth_bloc.dart';
import 'package:wellwave_frontend/features/start_overview/presentation/widget/start_recommend.dart';

class StartOverviewScreen extends StatelessWidget {
  final List<String> titles = [
    AppStrings.metabolicSyndromeText,
    AppStrings.metaEffectText,
    AppStrings.metaBehaviorText,
  ];

  final List<String> descriptions = [
    AppStrings.metabolicDescriptionText,
    AppStrings.metaEffectDescriptionText,
    AppStrings.metaBehaviorDescriptionText,
  ];

  final List<String> imageUrls = [
    AppImages.metabolicSyndromeImage,
    AppImages.metaEffectImage,
    AppImages.metaBehaviorImage,
  ];

  StartOverviewScreen({super.key});
  Future<void> _checkFirstTime(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    final hasSeenStartOverview = prefs.getBool('hasSeenStartOverview') ?? false;

    if (!hasSeenStartOverview) {
      await prefs.setBool('hasSeenStartOverview', true);
    } else {
      context.read<AuthBloc>().add(CheckLoginStatusEvent());
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _checkFirstTime(context),
      builder: (context, snapshot) {
        return BlocListener<AuthBloc, AuthState>(
          listener: (context, state) {
            if (state is Authenticated) {
              context.goNamed(AppPages.homeName);
            } else if (state is Unauthenticated) {
              context.goNamed(AppPages.authenticationName);
            }
          },
          child: Scaffold(
            body: StartRecommend(
              titles: titles,
              descriptions: descriptions,
              imageUrls: imageUrls,
            ),
          ),
        );
      },
    );
  }
}
