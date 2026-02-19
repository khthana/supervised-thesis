import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';
import 'package:wellwave_frontend/features/home/widget/notification_item.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          final hasNotifications = state is HomeLoadedState &&
              state.notiData != null &&
              state.notiData!.isNotEmpty;

          return Scaffold(
            appBar: CustomAppBar(
              context: context,
              onLeading: true,
              title: 'แจ้งเตือน',
              backgroundColor: AppColors.transparentColor,
              actionIcon: hasNotifications
                  ? Text(
                      AppStrings.MarkAsReadAllText,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            color: AppColors.darkGrayColor,
                          ),
                    )
                  : null,
              action: hasNotifications
                  ? () {
                      context.read<HomeBloc>().add(MarkAllAsReadNotiEvent());
                    }
                  : null,
            ),
            body: hasNotifications
                ? ListView.builder(
                    itemCount: state.notiData!.length,
                    itemBuilder: (context, index) {
                      final notification = state.notiData![index];
                      return NotificationItem(notification: notification);
                    },
                  )
                : Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SvgPicture.asset(
                          AppImages.avatarNotiImage,
                          width: 128,
                        ),
                        const SizedBox(height: 24),
                        Text(
                          AppStrings.noNotiText,
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: AppColors.darkGrayColor,
                                  ),
                        ),
                      ],
                    ),
                  ),
          );
        },
      ),
    );
  }
}
