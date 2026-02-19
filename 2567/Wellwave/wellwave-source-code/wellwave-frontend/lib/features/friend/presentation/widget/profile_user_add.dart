import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_images.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/config/constants/app_url.dart';
import 'package:wellwave_frontend/features/friend/data/repositories/friend_repositories.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_event.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ProfileUserAdd extends StatelessWidget {
  final String searchId;

  const ProfileUserAdd({super.key, required this.searchId});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => FriendBloc(
        friendRepositories: FriendRepositories(),
      )..add(SearchFriendEvent(searchId)),
      child: BlocBuilder<FriendBloc, FriendState>(
        builder: (context, state) {
          if (state is FriendLoaded) {
            final friends = state.friends;
            final searchId = state.searchId;
            final isFriend = state.isFriend;
            final numericId = searchId.replaceAll(RegExp(r'[^0-9]'), '');
            String imageUrl = friends.imageUrl ?? '';
            return Column(
              children: [
                CircleAvatar(
                  backgroundImage: (imageUrl.isNotEmpty ?? false)
                      ? NetworkImage('$baseUrl$imageUrl')
                      : null,
                  radius: 52.0,
                  child: (imageUrl.isEmpty ?? true)
                      ? SvgPicture.asset(
                          AppImages.avatarDefaultIcon,
                        )
                      : null,
                ),
                const SizedBox(height: 16),
                Text(
                  state.friends.username,
                  style: Theme.of(context).textTheme.labelLarge,
                ),
                const SizedBox(height: 16),
                if (isFriend)
                  Text(
                    AppStrings.AlreadyFriendText,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.darkGrayColor,
                        ),
                  ),
                const SizedBox(height: 16),
                CustomButtonSmall(
                  bgColor: AppColors.transparentColor,
                  outlineColor: AppColors.primaryColor,
                  textColor: AppColors.primaryColor,
                  title:
                      isFriend ? AppStrings.seeDetailsText : AppStrings.addText,
                  onPressed: isFriend
                      ? () {
                          context.goNamed(
                            AppPages.profileFriendName,
                            pathParameters: {'uid': numericId},
                          );
                        }
                      : () {
                          context.read<FriendBloc>().add(
                              ToggleAddfriendButtonEvent(searchId: numericId));
                          context
                              .read<FriendBloc>()
                              .add(SearchFriendEvent(numericId));
                        },
                ),
              ],
            );
          } else if (state is FriendLoading) {
            return const Center(child: CircularProgressIndicator());
          } else {
            return const SizedBox.shrink();
          }
        },
      ),
    );
  }
}
