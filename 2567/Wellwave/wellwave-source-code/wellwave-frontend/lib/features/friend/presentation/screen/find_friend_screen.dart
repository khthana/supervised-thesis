import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:wellwave_frontend/common/widget/app_bar.dart';
import 'package:wellwave_frontend/common/widget/custom_button.dart';
import 'package:wellwave_frontend/config/constants/app_colors.dart';
import 'package:wellwave_frontend/config/constants/app_pages.dart';
import 'package:wellwave_frontend/config/constants/app_strings.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_bloc.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_event.dart';
import 'package:wellwave_frontend/features/friend/presentation/bloc/friend_state.dart';
import 'package:wellwave_frontend/features/friend/presentation/widget/profile_user_add.dart';
import 'package:wellwave_frontend/features/friend/presentation/widget/search_by_id_text_field.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class FindFriendScreen extends StatelessWidget {
  const FindFriendScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController searchController = TextEditingController();

    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        onLeading: true,
        backgroundColor: AppColors.transparentColor,
        title: 'เพิ่มเพื่อน',
        onBackPressed: () {
          context.goNamed(AppPages.friendPage);
          context.read<FriendBloc>().add(ResetEvent());
        },
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            SearchByIdTextField(
              controller: searchController,
            ),
            const SizedBox(height: 24),
            CustomButton(
              width: double.infinity,
              bgColor: AppColors.primaryColor,
              textColor: AppColors.whiteColor,
              title: 'ค้นหา',
              onPressed: () {
                final input = searchController.text.trim();
                if (input.isNotEmpty) {
                  context.read<FriendBloc>().add(SearchFriendEvent(input));
                }
              },
            ),
            const SizedBox(height: 64),
            BlocBuilder<FriendBloc, FriendState>(
              builder: (context, state) {
                final searchId = searchController.text;
                print('searchId $searchId');
                if (state is FriendLoaded && searchId.isNotEmpty) {
                  return ProfileUserAdd(searchId: state.searchId);
                } else if (state is FriendLoading) {
                  return const Center(child: CircularProgressIndicator());
                } else if (state is FriendError && searchId.isNotEmpty) {
                  return Center(
                    child: Text(
                      AppStrings.userNotFoundText,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.darkGrayColor,
                          ),
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ],
        ),
      ),
    );
  }
}
