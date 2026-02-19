import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';

import '../../widget/floating_button_with_shake.dart';
import '../../widget/progress_widget.dart';
import '../../widget/top_of_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    context.read<HomeBloc>().add(FetchChallengesDataEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryColor,
      body: BlocBuilder<HomeBloc, HomeState>(builder: (context, state) {
        if (state is HomeLoading) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is HomeLoadedState) {
          final notifications = state.notiData;
          final profileCreateAt = state.profile?.createAt;

          return Stack(
            children: [
              Positioned(
                top: 48.0,
                left: -16.0,
                child: SvgPicture.asset(
                  AppImages.cloudImage,
                ),
              ),
              Positioned(
                top: 108.0,
                right: -24.0,
                child: SvgPicture.asset(
                  AppImages.cloudImage,
                ),
              ),
              SingleChildScrollView(
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(
                          top: 40.0, left: 24, right: 24, bottom: 24),
                      child: TopOfScreen(
                        notifications: notifications ?? [],
                      ),
                    ),
                    const ProgressWidget(),
                  ],
                ),
              ),
              // FloatingButtonWithShake(),
              FutureBuilder<bool>(
                future: _checkShowFloatingButton(profileCreateAt),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (snapshot.data == true) {
                    return const FloatingButtonWithShake();
                  }

                  return const SizedBox.shrink();
                },
              ),
            ],
          );
        } else if (state is HomeError) {
          return Center(child: Text('Error:  ${state.message}'));
        } else {
          return Container();
        }
      }),
    );
  }
}

Future<bool> _checkShowFloatingButton(DateTime? profileCreateAt) async {
  final prefs = await SharedPreferences.getInstance();
  final lastPressedTimestamp = prefs.getInt('last_button_pressed');
  if (lastPressedTimestamp == null) {
    if (profileCreateAt != null) {
      return await isCreateAtDateWithin30Days(profileCreateAt);
    }
    return false;
  }

  final lastPressedDate =
      DateTime.fromMillisecondsSinceEpoch(lastPressedTimestamp);
  final currentDate = DateTime.now();
  final difference = currentDate.difference(lastPressedDate).inDays;

  return difference >= 30;
}

Future<bool> isCreateAtDateWithin30Days(DateTime createAt) async {
  final currentDate = DateTime.now();
  final difference = currentDate.difference(createAt).inDays;

  return difference > 30;
}

Future<void> setLastButtonPressedDate(DateTime dateTime) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setInt('last_button_pressed', dateTime.millisecondsSinceEpoch);
}
