import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_event.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_state.dart';
import 'package:wellwave_frontend/features/friend/presentation/widget/user_info_card.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';

class FriendScreen extends StatefulWidget {
  const FriendScreen({super.key});

  @override
  State<FriendScreen> createState() => _FriendScreenState();
}

class _FriendScreenState extends State<FriendScreen> {
  @override
  void initState() {
    super.initState();

    context.read<FriendBloc>().add(LoadFriendsEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        onLeading: false,
        title: 'เพื่อนของฉัน',
        backgroundColor: AppColors.transparentColor,
        actionIcon: SvgPicture.asset(AppImages.addfriendIcon),
        action: () {
          context.goNamed(
            AppPages.findFriendPage,
          );
        },
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: BlocBuilder<FriendBloc, FriendState>(
          builder: (context, state) {
            if (state is FriendLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is FriendLoaded &&
                state.allFriends?.data.isNotEmpty == true) {
              return ListView.separated(
                itemCount: state.allFriends!.data.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: 16),
                itemBuilder: (context, index) {
                  final friend = state.allFriends!.data[index];
                  return UserInfoCard(
                    uid: friend.uid.toString(),
                    username: friend.username,
                    imageUrl: friend.imageUrl,
                    steps: friend.steps,
                    sleepHours: friend.sleepHours,
                    lastLogin: friend.lastLogin,
                  );
                },
              );
            } else if (state is FriendLoaded &&
                state.allFriends?.data.isEmpty == true) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SvgPicture.asset(
                      AppImages.findFriendAvatar,
                      width: 128,
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'ยังไม่มีข้อมูล เพิ่มเพื่อนเลย!',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.darkGrayColor,
                          ),
                    ),
                  ],
                ),
              );
            } else {
              return Container();
            }
          },
        ),
      ),
    );
  }
}
