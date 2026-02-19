import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/features/home/data/models/notifications_data_response_model.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_bloc.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_event.dart';
import 'package:wellwave_frontend/features/home/presentation/bloc/home_state.dart';

import '../../../config/constants/app_url.dart';

class NotificationItem extends StatelessWidget {
  final NotificationsDataResponseModel notification;
  final VoidCallback? onTap;
  const NotificationItem({
    Key? key,
    required this.notification,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        return Container(
          padding: const EdgeInsets.all(16.0),
          child: ListTile(
            title: Text(notification.message,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: notification.isRead
                          ? AppColors.darkGrayColor
                          : AppColors.blackColor,
                    )),
            leading: CircleAvatar(
              radius: 24,
              backgroundImage: NetworkImage('$baseUrl${notification.imageUrl}'),
            ),
            trailing: Icon(
              Icons.circle,
              color: notification.isRead
                  ? AppColors.transparentColor
                  : AppColors.orangeColor,
              size: 12,
            ),
            onTap: () {
              final notificationId = notification.notificationId;
              context.read<HomeBloc>().add(MarkAsReadNotiEvent(notificationId));

              _navigateToAppRoute(context, notification.appRoute);
            },
          ),
        );
      },
    );
  }
}

void _navigateToAppRoute(BuildContext context, String appRoute) {
  final routeMap = {
    'achievement': AppPages.achievementPage,
    'friend': AppPages.friendPage,
    'leaderboard': AppPages.leaderboardPage,
  };

  final routeName = routeMap[appRoute];

  if (routeName != null) {
    context.goNamed(routeName);
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Unknown route: $appRoute')),
    );
  }
}
