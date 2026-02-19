import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/features/home/data/models/notifications_data_response_model.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';

import 'showpoint.dart';

class TopOfScreen extends StatelessWidget {
  final List<NotificationsDataResponseModel> notifications;
  const TopOfScreen({super.key, required this.notifications});

  @override
  Widget build(BuildContext context) {
    bool hasUnread =
        notifications.take(7).any((notification) => !notification.isRead);

    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        Widget profilePicture;

        if (state is HomeLoadedState &&
            state.profile?.imageUrl != null &&
            state.profile!.imageUrl.isNotEmpty) {
          profilePicture = Container(
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
            ),
            child: ClipOval(
              child: Image.network(
                '$baseUrl${state.profile!.imageUrl}',
                height: 32.0,
                width: 32.0,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return SvgPicture.asset(
                    AppImages.avatarDefaultIcon,
                    height: 32.0,
                    width: 32.0,
                  );
                },
              ),
            ),
          );
        } else {
          profilePicture = SvgPicture.asset(
            AppImages.avatarDefaultIcon,
            height: 32.0,
          );
        }

        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                CoinDisplay(
                  pointText: (state is HomeLoadedState)
                      ? state.profile?.exp.toString() ?? '0'
                      : '0',
                  icon: AppImages.expIcon,
                ),
                const SizedBox(width: 16),
                CoinDisplay(
                  pointText: (state is HomeLoadedState)
                      ? state.profile?.gem.toString() ?? '0'
                      : '0',
                  icon: AppImages.gemIcon,
                ),
              ],
            ),
            Row(
              children: [
                Stack(
                  children: [
                    GestureDetector(
                      onTap: () {
                        context.goNamed(AppPages.notificationName);
                      },
                      child: SvgPicture.asset(
                        AppImages.notiIcon,
                        height: 32.0,
                      ),
                    ),
                    if (hasUnread)
                      const Positioned(
                        right: 0,
                        top: 0,
                        child: SizedBox(
                          width: 16,
                          height: 16,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              color: AppColors.orangeColor,
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 16),
                GestureDetector(
                  onTap: () {
                    context.goNamed(AppPages.profilePage);
                  },
                  child: profilePicture,
                ),
              ],
            ),
          ],
        );
      },
    );
  }
}
