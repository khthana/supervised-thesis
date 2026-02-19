import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_event.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_state.dart';
import 'package:wellwave_frontend/features/friend/presentation/widget/friend_chart_section_widget.dart';
import 'package:wellwave_frontend/features/friend/presentation/widget/user_info.dart';

class FriendProfileScreen extends StatefulWidget {
  final String friendUid;

  const FriendProfileScreen({
    Key? key,
    required this.friendUid,
  }) : super(key: key);

  @override
  State<FriendProfileScreen> createState() => _FriendProfileScreenState();
}

class _FriendProfileScreenState extends State<FriendProfileScreen> {
  bool showUnfriendButton = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        onLeading: true,
        backgroundColor: AppColors.transparentColor,
        onBackPressed: () {
          context.goNamed(AppPages.friendPage);
          context.read<FriendBloc>().add(ResetEvent());
        },
        actionIcon: SvgPicture.asset(AppImages.actionIcon),
        action: () {
          setState(() {
            showUnfriendButton = !showUnfriendButton;
          });
        },
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  BlocBuilder<FriendBloc, FriendState>(
                    builder: (context, state) {
                      if (state is FriendLoaded &&
                          state.searchId == widget.friendUid) {
                        print('stepsLog ${state.friends.stepsLog}');
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            UserInformation(
                              userID: state.friends.uid.toString(),
                              userName: state.friends.username,
                              gemAmount: state.friends.gem,
                              expAmount: state.friends.exp,
                              imgUrl: state.friends.imageUrl,
                              league: state.friends.league,
                            ),
                            const SizedBox(height: 32),
                          ],
                        );
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                  FriendChartSectionWidget(friendUid: widget.friendUid),
                ],
              ),
            ),
          ),
          if (showUnfriendButton)
            Positioned(
              top: 0,
              right: 24,
              child: CustomButtonSmall(
                bgColor: AppColors.whiteColor,
                outlineColor: AppColors.lightgrayColor,
                textColor: AppColors.blackColor,
                title: 'เลิกเป็นเพื่อน',
                onPressed: () async {
                  debugPrint('เลิกเป็นเพื่อน');

                  showDialog(
                    context: context,
                    barrierDismissible: false,
                    builder: (BuildContext context) {
                      return const Center(
                        child: CircularProgressIndicator(),
                      );
                    },
                  );

                  context.read<FriendBloc>()
                    ..add(UnfriendButtonEvent(searchId: widget.friendUid))
                    ..add(LoadFriendsEvent());

                  await Future.delayed(const Duration(seconds: 1));

                  if (mounted) {
                    Navigator.of(context).pop();
                    context.goNamed(AppPages.friendPage);
                  }
                },
              ),
            ),
        ],
      ),
    );
  }
}
